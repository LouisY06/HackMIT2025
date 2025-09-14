from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import sqlite3
import qrcode
import os
import json
import random
import base64
from datetime import datetime, timedelta
from dotenv import load_dotenv
import anthropic
from PIL import Image
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

# Anthropic API key should be set via environment variable ANTHROPIC_API_KEY
# For development, you can create a .env file with: ANTHROPIC_API_KEY=your_key_here

# Initialize Anthropic client
anthropic_client = anthropic.Anthropic(
    api_key=os.getenv('ANTHROPIC_API_KEY')
)

# Database setup
DATABASE = os.getenv('DATABASE_URL', 'packages.db')

def init_db():
    """Initialize the database with all tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Packages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS packages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            store_name TEXT NOT NULL,
            store_email TEXT NOT NULL,
            weight_lbs REAL NOT NULL,
            food_type TEXT NOT NULL,
            pickup_window_start TEXT NOT NULL,
            pickup_window_end TEXT NOT NULL,
            special_instructions TEXT,
            qr_code_data TEXT,
            qr_code_image_path TEXT,
            pickup_pin TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            volunteer_id TEXT,
            pickup_completed_at DATETIME
        )
    ''')
    
    # Volunteer profiles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS volunteer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Store profiles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS store_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Food Bank profiles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS foodbank_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def generate_qr_code(package_data, package_id):
    """Generate QR code image and return the file path"""
    # Create uploads directory if it doesn't exist
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    qr.add_data(json.dumps(package_data))
    qr.make(fit=True)
    
    # Create QR code image
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Save QR code image
    qr_filename = f'qr-{package_id}.png'
    qr_path = os.path.join('uploads', qr_filename)
    qr_image.save(qr_path)
    
    return qr_path

def generate_pickup_pin():
    """Generate a 4-digit PIN for package pickup confirmation"""
    return f"{random.randint(1000, 9999)}"

@app.route('/api/packages/create', methods=['POST'])
def create_package():
    """Create a new package and generate QR code"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['store_name', 'store_email', 'weight_lbs', 'food_type', 
                          'pickup_window_start', 'pickup_window_end']
        
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Generate unique package ID and pickup PIN
        package_id = str(int(datetime.now().timestamp() * 1000))
        pickup_pin = generate_pickup_pin()
        
        # Create QR code data
        qr_data = {
            'package_id': package_id,
            'store_name': data['store_name'],
            'store_email': data['store_email'],
            'weight_lbs': float(data['weight_lbs']),
            'food_type': data['food_type'],
            'pickup_window_start': data['pickup_window_start'],
            'pickup_window_end': data['pickup_window_end'],
            'special_instructions': data.get('special_instructions', ''),
            'created_at': datetime.now().isoformat()
        }
        
        # Generate QR code image
        qr_image_path = generate_qr_code(qr_data, package_id)
        
        # Save to database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO packages (
                store_name, store_email, weight_lbs, food_type,
                pickup_window_start, pickup_window_end, special_instructions,
                qr_code_data, qr_code_image_path, pickup_pin, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['store_name'],
            data['store_email'],
            float(data['weight_lbs']),
            data['food_type'],
            data['pickup_window_start'],
            data['pickup_window_end'],
            data.get('special_instructions', ''),
            json.dumps(qr_data),
            qr_image_path,
            pickup_pin,
            'pending'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'package_id': package_id,
            'pickup_pin': pickup_pin,
            'qr_code_image_path': qr_image_path,
            'message': 'Package created successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/store/<store_email>', methods=['GET'])
def get_packages_by_store(store_email):
    """Get all packages for a specific store"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM packages 
            WHERE store_email = ? 
            ORDER BY created_at DESC
        ''', (store_email,))
        
        packages = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        package_list = []
        for package in packages:
            package_dict = {
                'id': package[0],
                'store_name': package[1],
                'store_email': package[2],
                'weight_lbs': package[3],
                'food_type': package[4],
                'pickup_window_start': package[5],
                'pickup_window_end': package[6],
                'special_instructions': package[7],
                'qr_code_data': package[8],
                'qr_code_image_path': package[9],
                'pickup_pin': package[10],
                'status': package[11],
                'created_at': package[12],
                'volunteer_id': package[13],
                'pickup_completed_at': package[14]
            }
            package_list.append(package_dict)
        
        return jsonify({'success': True, 'packages': package_list})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>', methods=['GET'])
def get_package(package_id):
    """Get a specific package by ID"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        conn.close()
        
        if not package:
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        package_dict = {
            'id': package[0],
            'store_name': package[1],
            'store_email': package[2],
            'weight_lbs': package[3],
            'food_type': package[4],
            'pickup_window_start': package[5],
            'pickup_window_end': package[6],
            'special_instructions': package[7],
            'qr_code_data': package[8],
            'qr_code_image_path': package[9],
            'pickup_pin': package[10],
            'status': package[11],
            'created_at': package[12],
            'volunteer_id': package[13],
            'pickup_completed_at': package[14]
        }
        
        return jsonify({'success': True, 'package': package_dict})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/status', methods=['PUT'])
def update_package_status(package_id):
    """Update package status"""
    try:
        data = request.get_json()
        status = data.get('status')
        volunteer_id = data.get('volunteer_id')
        
        if not status:
            return jsonify({'success': False, 'error': 'Status is required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        pickup_time = datetime.now().isoformat() if status == 'completed' else None
        
        cursor.execute('''
            UPDATE packages 
            SET status = ?, volunteer_id = ?, pickup_completed_at = ?
            WHERE id = ?
        ''', (status, volunteer_id, pickup_time, package_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Package status updated'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/qr', methods=['GET'])
def get_qr_data(package_id):
    """Get QR code data for volunteers"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT qr_code_data FROM packages WHERE id = ?', (package_id,))
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        qr_data = json.loads(result[0])
        return jsonify({'success': True, 'package_data': qr_data})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# User Profile API endpoints

@app.route('/api/users/profile', methods=['POST'])
def create_user_profile():
    """Create or update a user profile"""
    try:
        data = request.get_json()
        
        required_fields = ['firebase_uid', 'email', 'user_type', 'profile_data']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        user_type = data['user_type']
        table_name = f"{user_type}_profiles"
        
        # Check if user already exists
        cursor.execute(f'SELECT id FROM {table_name} WHERE firebase_uid = ?', (data['firebase_uid'],))
        existing_user = cursor.fetchone()
        
        if existing_user:
            # Update existing profile
            cursor.execute(f'''
                UPDATE {table_name} 
                SET email = ?, profile_data = ?, updated_at = CURRENT_TIMESTAMP
                WHERE firebase_uid = ?
            ''', (data['email'], json.dumps(data['profile_data']), data['firebase_uid']))
        else:
            # Create new profile
            cursor.execute(f'''
                INSERT INTO {table_name} (firebase_uid, email, profile_data)
                VALUES (?, ?, ?)
            ''', (data['firebase_uid'], data['email'], json.dumps(data['profile_data'])))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Profile saved successfully'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/profile/<firebase_uid>', methods=['GET'])
def get_user_profile(firebase_uid):
    """Get user profile by Firebase UID"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check all user type tables
        user_types = ['volunteer', 'store', 'foodbank']
        profile = None
        user_type = None
        
        for ut in user_types:
            cursor.execute(f'''
                SELECT email, profile_data, created_at, updated_at
                FROM {ut}_profiles WHERE firebase_uid = ?
            ''', (firebase_uid,))
            result = cursor.fetchone()
            if result:
                profile = result
                user_type = ut
                break
        
        conn.close()
        
        if profile:
            return jsonify({
                'success': True,
                'profile': {
                    'email': profile[0],
                    'user_type': user_type,
                    'profile_data': json.loads(profile[1]),
                    'created_at': profile[2],
                    'updated_at': profile[3]
                }
            })
        else:
            return jsonify({'success': False, 'error': 'Profile not found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/check-profile/<firebase_uid>', methods=['GET'])
def check_profile_completion(firebase_uid):
    """Check if user has completed their profile"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check all user type tables
        user_types = ['volunteer', 'store', 'foodbank']
        profile_found = False
        user_type = None
        
        for ut in user_types:
            cursor.execute(f'SELECT id FROM {ut}_profiles WHERE firebase_uid = ?', (firebase_uid,))
            result = cursor.fetchone()
            if result:
                profile_found = True
                user_type = ut
                break
        
        conn.close()
        
        return jsonify({
            'success': True,
            'profile_completed': profile_found,
            'user_type': user_type
        })
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/check-profile/<user_type>/<firebase_uid>', methods=['GET'])
def check_specific_profile_completion(user_type, firebase_uid):
    """Check if user has completed their profile for a specific user type"""
    try:
        if user_type not in ['volunteer', 'store', 'foodbank']:
            return jsonify({'success': False, 'error': 'Invalid user type'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        table_name = f"{user_type}_profiles"
        cursor.execute(f'SELECT id FROM {table_name} WHERE firebase_uid = ?', (firebase_uid,))
        result = cursor.fetchone()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'profile_completed': bool(result)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/check-email/<user_type>/<email>', methods=['GET'])
def check_email_exists(user_type, email):
    """Check if email exists in a specific user type table"""
    try:
        if user_type not in ['volunteer', 'store', 'foodbank']:
            return jsonify({'success': False, 'error': 'Invalid user type'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        table_name = f"{user_type}_profiles"
        cursor.execute(f'SELECT id FROM {table_name} WHERE email = ?', (email,))
        result = cursor.fetchone()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'email_exists': bool(result)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/available', methods=['GET'])
def get_available_packages():
    """Get all available packages for volunteers (status = 'pending')"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT p.*, s.profile_data
            FROM packages p
            LEFT JOIN store_profiles s ON p.store_email = s.email
            WHERE p.status = 'pending'
            ORDER BY p.created_at DESC
        ''')
        
        packages = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries with store location info
        package_list = []
        for package in packages:
            # Parse store profile data if available
            store_data = None
            if package[15]:  # profile_data column (shifted due to pickup_pin)
                try:
                    store_data = json.loads(package[15])
                except json.JSONDecodeError:
                    store_data = None
            
            package_dict = {
                'id': package[0],
                'store_name': package[1],
                'store_email': package[2],
                'weight_lbs': package[3],
                'food_type': package[4],
                'pickup_window_start': package[5],
                'pickup_window_end': package[6],
                'special_instructions': package[7],
                'qr_code_data': package[8],
                'qr_code_image_path': package[9],
                'pickup_pin': package[10],
                'status': package[11],
                'created_at': package[12],
                'volunteer_id': package[13],
                'pickup_completed_at': package[14],
                'store_address': store_data.get('address', 'Address not available') if store_data and isinstance(store_data, dict) else 'Address not available',
                'store_lat': float(store_data.get('latitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('latitude') else None,
                'store_lng': float(store_data.get('longitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('longitude') else None
            }
            package_list.append(package_dict)
        
        return jsonify({'success': True, 'packages': package_list})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/stores/locations', methods=['GET'])
def get_store_locations():
    """Get all store locations for map display"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get all stores with their profile data
        cursor.execute('''
            SELECT firebase_uid, email, profile_data
            FROM store_profiles
        ''')
        
        stores = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        store_locations = []
        for store in stores:
            try:
                profile_data = json.loads(store[2])  # Parse JSON from profile_data
                
                # Only include stores that have location data
                if profile_data.get('latitude') and profile_data.get('longitude'):
                    store_locations.append({
                        'id': store[0],  # firebase_uid as id
                        'name': profile_data.get('storeName', 'Unnamed Store'),
                        'address': profile_data.get('address', 'No address'),
                        'lat': float(profile_data.get('latitude')),
                        'lng': float(profile_data.get('longitude')),
                        'email': store[1]
                    })
            except json.JSONDecodeError:
                # Skip stores with invalid JSON data
                continue
        
        return jsonify({
            'success': True,
            'stores': store_locations
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/verify-pin', methods=['POST'])
def verify_pickup_pin(package_id):
    """Verify pickup PIN and assign package to volunteer"""
    try:
        data = request.get_json()
        entered_pin = data.get('pin')
        volunteer_id = data.get('volunteer_id')
        
        if not entered_pin or not volunteer_id:
            return jsonify({'success': False, 'error': 'PIN and volunteer ID are required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if package exists and get its PIN
        cursor.execute('SELECT id, pickup_pin, status FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        if package[2] != 'pending':
            conn.close()
            return jsonify({'success': False, 'error': 'Package is no longer available'}), 400
        
        # Verify PIN
        if str(entered_pin) != str(package[1]):
            conn.close()
            return jsonify({'success': False, 'error': 'Invalid PIN. Please check with the store.'}), 400
        
        # PIN is correct - assign package to volunteer
        cursor.execute('''
            UPDATE packages 
            SET status = 'assigned', volunteer_id = ?
            WHERE id = ?
        ''', (volunteer_id, package_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'PIN verified! Package assigned successfully.',
            'package_id': package_id,
            'volunteer_id': volunteer_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/assign', methods=['POST'])
def assign_package_to_volunteer(package_id):
    """Assign a package to a volunteer"""
    try:
        data = request.get_json()
        volunteer_id = data.get('volunteer_id')
        
        if not volunteer_id:
            return jsonify({'success': False, 'error': 'Volunteer ID is required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if package exists and is available
        cursor.execute('SELECT id, status FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        if package[1] != 'pending':
            conn.close()
            return jsonify({'success': False, 'error': 'Package is no longer available'}), 400
        
        # Update package status and assign to volunteer
        cursor.execute('''
            UPDATE packages 
            SET status = 'assigned', volunteer_id = ?
            WHERE id = ?
        ''', (volunteer_id, package_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Package assigned successfully',
            'package_id': package_id,
            'volunteer_id': volunteer_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/volunteer/<volunteer_id>', methods=['GET'])
def get_volunteer_packages(volunteer_id):
    """Get active packages assigned to a specific volunteer (excludes completed packages)"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT p.*, s.profile_data
            FROM packages p
            LEFT JOIN store_profiles s ON p.store_email = s.email
            WHERE p.volunteer_id = ? AND p.status != 'completed'
            ORDER BY p.created_at DESC
        ''', (volunteer_id,))
        
        packages = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries with store location info
        package_list = []
        for package in packages:
            # Parse store profile data if available
            store_data = None
            if package[15]:  # profile_data column (shifted due to pickup_pin)
                try:
                    store_data = json.loads(package[15])
                except json.JSONDecodeError:
                    store_data = None
            
            package_dict = {
                'id': package[0],
                'store_name': package[1],
                'store_email': package[2],
                'weight_lbs': package[3],
                'food_type': package[4],
                'pickup_window_start': package[5],
                'pickup_window_end': package[6],
                'special_instructions': package[7],
                'qr_code_data': package[8],
                'qr_code_image_path': package[9],
                'pickup_pin': package[10],
                'status': package[11],
                'created_at': package[12],
                'volunteer_id': package[13],
                'pickup_completed_at': package[14],
                'store_address': store_data.get('address', 'Address not available') if store_data and isinstance(store_data, dict) else 'Address not available',
                'store_lat': float(store_data.get('latitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('latitude') else None,
                'store_lng': float(store_data.get('longitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('longitude') else None
            }
            package_list.append(package_dict)
        
        return jsonify({'success': True, 'packages': package_list})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/volunteer/<volunteer_id>/stats', methods=['GET'])
def get_volunteer_stats(volunteer_id):
    """Get volunteer statistics including completed pickups, food saved, etc."""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get all packages for this volunteer
        cursor.execute('''
            SELECT status, weight_lbs, pickup_completed_at
            FROM packages 
            WHERE volunteer_id = ?
        ''', (volunteer_id,))
        
        packages = cursor.fetchall()
        conn.close()
        
        # Calculate statistics
        completed_pickups = len([p for p in packages if p[0] == 'completed'])
        total_food_saved = sum(p[1] for p in packages if p[0] == 'completed')
        
        # Calculate CO2 reduced (rough estimate: 1 lb food waste = ~1.13 kg CO2)
        co2_reduced = total_food_saved * 1.13
        
        # Calculate meals provided (rough estimate: 1 lb food = ~2.3 meals)
        meals_provided = total_food_saved * 2.3
        
        # Calculate points (rough estimate: 10 points per lb of food saved)
        points = int(total_food_saved * 10)
        
        stats = {
            'completed_pickups': completed_pickups,
            'food_saved_lbs': round(total_food_saved, 1),
            'co2_reduced_kg': round(co2_reduced, 1),
            'meals_provided': round(meals_provided, 0),
            'points': points,
            'rank': 1  # TODO: Implement ranking system
        }
        
        return jsonify({'success': True, 'stats': stats})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/foodbank/dashboard', methods=['GET'])
def get_foodbank_dashboard():
    """Get food bank dashboard data including recent deliveries and KPIs"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get today's deliveries (completed packages)
        today = datetime.now().strftime('%Y-%m-%d')
        cursor.execute('''
            SELECT COUNT(*), COALESCE(SUM(weight_lbs), 0)
            FROM packages 
            WHERE status = 'completed' 
            AND DATE(pickup_completed_at) = ?
        ''', (today,))
        
        today_result = cursor.fetchone()
        today_deliveries = today_result[0] if today_result else 0
        today_weight = today_result[1] if today_result else 0
        
        # Get total completed packages for recent deliveries
        cursor.execute('''
            SELECT p.*, s.profile_data
            FROM packages p
            LEFT JOIN store_profiles s ON p.store_email = s.email
            WHERE p.status = 'completed'
            ORDER BY p.pickup_completed_at DESC
            LIMIT 10
        ''')
        
        recent_deliveries = cursor.fetchall()
        
        # Format recent deliveries
        delivery_list = []
        for delivery in recent_deliveries:
            store_data = None
            if delivery[14]:  # profile_data column (index 14, not 15)
                try:
                    store_data = json.loads(delivery[14])
                except json.JSONDecodeError:
                    store_data = None
            
            delivery_list.append({
                'id': delivery[0],
                'store_name': delivery[1],
                'store_email': delivery[2],
                'weight_lbs': delivery[3],
                'food_type': delivery[4],
                'volunteer_id': delivery[13],
                'pickup_completed_at': delivery[14],
                'store_address': store_data.get('address', 'Address not available') if store_data and isinstance(store_data, dict) else 'Address not available'
            })
        
        # Calculate KPIs
        total_weight = sum(d['weight_lbs'] for d in delivery_list)
        co2_prevented = total_weight * 1.13  # kg CO2 per lb of food
        meals_provided = total_weight * 2.3
        
        kpi_data = {
            'todayDeliveries': today_deliveries,
            'foodReceived': f'{today_weight:.1f} lbs today',
            'activeVolunteers': len(set(d['volunteer_id'] for d in delivery_list if d['volunteer_id'])),
            'co2Prevented': f'{co2_prevented:.1f} lbs',
            'mealsProvided': f'{meals_provided:.0f} meals provided',
            'familiesHelped': f'{meals_provided/4:.0f} families helped',
        }
        
        conn.close()
        
        return jsonify({
            'success': True,
            'kpi': kpi_data,
            'recent_deliveries': delivery_list
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/foodbank/pending-deliveries', methods=['GET'])
def get_pending_deliveries():
    """Get packages that are ready for food bank delivery confirmation (status = 'picked_up')"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT p.*, s.profile_data
            FROM packages p
            LEFT JOIN store_profiles s ON p.store_email = s.email
            WHERE p.status = 'picked_up'
            ORDER BY p.pickup_completed_at ASC
        ''')
        
        packages = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries with store location info
        package_list = []
        for package in packages:
            # Parse store profile data if available
            store_data = None
            if len(package) > 15 and package[15]:  # profile_data column (index 15)
                try:
                    store_data = json.loads(package[15])
                except json.JSONDecodeError:
                    store_data = None
            
            package_dict = {
                'id': package[0],
                'store_name': package[1],
                'store_email': package[2],
                'weight_lbs': package[3],
                'food_type': package[4],
                'pickup_window_start': package[5],
                'pickup_window_end': package[6],
                'special_instructions': package[7],
                'qr_code_data': package[8],
                'qr_code_image_path': package[9],
                'pickup_pin': package[10],
                'status': package[11],
                'created_at': package[12],
                'volunteer_id': package[13],
                'pickup_completed_at': package[14],
                'store_address': store_data.get('address', 'Address not available') if store_data and isinstance(store_data, dict) else 'Address not available',
                'store_lat': float(store_data.get('latitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('latitude') else None,
                'store_lng': float(store_data.get('longitude', 0)) if store_data and isinstance(store_data, dict) and store_data.get('longitude') else None
            }
            package_list.append(package_dict)
        
        return jsonify({'success': True, 'packages': package_list})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>', methods=['DELETE'])
def delete_package(package_id):
    """Delete a package from the database"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if package exists
        cursor.execute('SELECT id, status FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        # Don't allow deletion of packages that are assigned, picked up, or completed
        if package[1] in ['assigned', 'picked_up', 'completed']:
            conn.close()
            return jsonify({'success': False, 'error': 'Cannot delete package that is assigned, picked up, or completed'}), 400
        
        # Delete the package
        cursor.execute('DELETE FROM packages WHERE id = ?', (package_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found or already deleted'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Package deleted successfully',
            'package_id': package_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/pickup', methods=['POST'])
def confirm_pickup(package_id):
    """Confirm package pickup at store using PIN (volunteer -> picked_up status)"""
    try:
        data = request.get_json()
        entered_pin = data.get('pin')
        volunteer_id = data.get('volunteer_id')
        
        if not entered_pin or not volunteer_id:
            return jsonify({'success': False, 'error': 'PIN and volunteer_id are required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get package details and verify assignment
        cursor.execute('SELECT id, pickup_pin, status, volunteer_id FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        # Verify package is assigned to this volunteer
        if package[3] != volunteer_id:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not assigned to this volunteer'}), 403
        
        # Verify package status
        if package[2] != 'assigned':
            conn.close()
            return jsonify({'success': False, 'error': f'Package status is {package[2]}, expected assigned'}), 400
        
        # Verify PIN
        if str(entered_pin) != str(package[1]):
            conn.close()
            return jsonify({'success': False, 'error': 'Invalid PIN. Please check with the store.'}), 400
        
        # Update status to picked_up
        cursor.execute('''
            UPDATE packages 
            SET status = 'picked_up', pickup_completed_at = ?
            WHERE id = ?
        ''', (datetime.now().isoformat(), package_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Package pickup confirmed! Now deliver to food bank.',
            'package_id': package_id,
            'status': 'picked_up'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/packages/<int:package_id>/deliver', methods=['POST'])
def confirm_delivery(package_id):
    """Confirm package delivery at food bank using PIN (food bank -> completed status)"""
    try:
        data = request.get_json()
        entered_pin = data.get('pin')
        foodbank_id = data.get('foodbank_id')
        
        if not entered_pin:
            return jsonify({'success': False, 'error': 'PIN is required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get package details
        cursor.execute('SELECT id, pickup_pin, status FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        # Verify package status
        if package[2] != 'picked_up':
            conn.close()
            return jsonify({'success': False, 'error': f'Package status is {package[2]}, expected picked_up'}), 400
        
        # Verify PIN
        if str(entered_pin) != str(package[1]):
            conn.close()
            return jsonify({'success': False, 'error': 'Invalid PIN. Please check with the volunteer.'}), 400
        
        # Update status to completed
        cursor.execute('''
            UPDATE packages 
            SET status = 'completed'
            WHERE id = ?
        ''', (package_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Order completed! Volunteer has received their points and the mission is now complete.',
            'package_id': package_id,
            'status': 'completed'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/uploads/<filename>')
def serve_qr_code(filename):
    """Serve QR code images"""
    try:
        return send_file(f'uploads/{filename}')
    except FileNotFoundError:
        return jsonify({'error': 'QR code not found'}), 404

@app.route('/api/packages/<int:package_id>/complete', methods=['POST'])
def complete_package(package_id):
    """Mark a package as completed after QR code verification"""
    try:
        data = request.get_json()
        volunteer_id = data.get('volunteer_id')
        
        if not volunteer_id:
            return jsonify({'success': False, 'error': 'Volunteer ID is required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if package exists and is assigned to this volunteer
        cursor.execute('SELECT id, status, volunteer_id FROM packages WHERE id = ?', (package_id,))
        package = cursor.fetchone()
        
        if not package:
            conn.close()
            return jsonify({'success': False, 'error': 'Package not found'}), 404
        
        if package[1] != 'assigned':
            conn.close()
            return jsonify({'success': False, 'error': 'Package is not assigned'}), 400
        
        if package[2] != volunteer_id:
            conn.close()
            return jsonify({'success': False, 'error': 'Package is not assigned to this volunteer'}), 403
        
        # Update package status to completed
        cursor.execute('''
            UPDATE packages 
            SET status = 'completed', pickup_completed_at = datetime('now')
            WHERE id = ?
        ''', (package_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Package completed successfully',
            'package_id': package_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint for AWS deployment"""
    try:
        # Test database connection
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }), 500

@app.route('/api/analyze-food-image', methods=['POST'])
def analyze_food_image():
    """Analyze food image using Anthropic Claude to determine food type and estimate weight"""
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'success': False, 'error': 'No image data provided'}), 400
        
        # Extract base64 image data (remove data:image/jpeg;base64, prefix if present)
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Validate the image
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary and resize if too large
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if image is too large (max 1024x1024)
            if image.width > 1024 or image.height > 1024:
                image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            
            # Convert back to base64
            output_buffer = io.BytesIO()
            image.save(output_buffer, format='JPEG', quality=85)
            processed_image_data = base64.b64encode(output_buffer.getvalue()).decode()
            
        except Exception as e:
            return jsonify({'success': False, 'error': f'Invalid image data: {str(e)}'}), 400
        
        # Check if Anthropic API key is configured
        if not os.getenv('ANTHROPIC_API_KEY'):
            return jsonify({
                'success': False, 
                'error': 'Anthropic API key not configured on server'
            }), 500
        
        # Analyze image with Claude
        try:
            message = anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=500,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": processed_image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": """You are an expert food analyst helping stores estimate food waste for donation. Analyze this food image and provide accurate weight estimates.

WEIGHT ESTIMATION GUIDELINES:
- Use common food references: 1 slice bread = ~1oz, 1 apple = ~6oz, 1 sandwich = ~8oz
- Consider container weight: plastic containers +0.1-0.3 lbs, paper bags +0.05-0.1 lbs
- Look for size references: hands, utensils, plates, or packaging for scale
- Account for food density: bread is light, soup/sauces are heavy, fresh produce varies
- Be conservative but realistic: round to nearest 0.1 lbs

COMMON ESTIMATES:
- Single bagel/donut: 0.2-0.4 lbs
- Loaf of bread: 1.5-2.5 lbs  
- Large pizza: 2-4 lbs
- Prepared sandwich: 0.4-0.8 lbs
- Bunch of bananas (5-6): 2-3 lbs
- Large prepared meal: 1-2 lbs

Provide a JSON response with:
1. food_type: Specific, descriptive name (e.g., "Fresh Baked Bread Loaves", "Prepared Deli Sandwiches", "Mixed Produce - Apples & Bananas")
2. estimated_weight_lbs: Your best weight estimate in pounds (be realistic, consider all visible items + containers)
3. confidence: Your confidence level (high/medium/low)
4. description: Brief description including what you see and why you estimated this weight
5. reasoning: Explain your weight calculation approach

Respond ONLY with valid JSON in this exact format:
{
  "food_type": "string",
  "estimated_weight_lbs": number,
  "confidence": "high|medium|low", 
  "description": "string",
  "reasoning": "string"
}"""
                        }
                    ]
                }]
            )
            
            # Parse Claude's response
            claude_response = message.content[0].text.strip()
            
            # Try to extract JSON from the response
            try:
                # Find JSON in the response (in case Claude adds extra text)
                start_idx = claude_response.find('{')
                end_idx = claude_response.rfind('}') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = claude_response[start_idx:end_idx]
                    analysis_result = json.loads(json_str)
                else:
                    raise ValueError("No valid JSON found in response")
                
                # Validate the response structure
                required_keys = ['food_type', 'estimated_weight_lbs', 'confidence', 'description']
                if not all(key in analysis_result for key in required_keys):
                    raise ValueError("Missing required keys in response")
                
                # Reasoning is optional but helpful
                if 'reasoning' not in analysis_result:
                    analysis_result['reasoning'] = "Weight estimated based on visual analysis"
                
                # Ensure weight is a number and reasonable
                weight = float(analysis_result['estimated_weight_lbs'])
                if weight < 0.1 or weight > 100:  # Reasonable bounds
                    weight = max(0.5, min(weight, 50))  # Clamp to reasonable range
                analysis_result['estimated_weight_lbs'] = round(weight, 1)
                
                return jsonify({
                    'success': True,
                    'analysis': analysis_result
                })
                
            except (json.JSONDecodeError, ValueError) as e:
                return jsonify({
                    'success': False,
                    'error': f'Failed to parse AI response: {str(e)}',
                    'raw_response': claude_response
                }), 500
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'AI analysis failed: {str(e)}'
            }), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# AI Insights API endpoints
@app.route('/api/ai/store-insights/<store_email>', methods=['GET'])
def get_store_insights(store_email):
    """Get AI insights for a specific store"""
    try:
        # Import AI models or use fallback functions
        try:
            from ai_models import WasteAnalytics, calculate_financial_impact
        except ImportError:
            # Fallback functions if AI models can't be imported
            def calculate_financial_impact(waste_lbs, food_type='default'):
                retail_values = {
                    'meat': 8.50, 'dairy': 3.20, 'produce': 2.80,
                    'bread': 1.50, 'prepared_foods': 6.00, 'default': 3.50
                }
                value_per_lb = retail_values.get(food_type, retail_values['default'])
                total_value = waste_lbs * value_per_lb
                disposal_cost_savings = waste_lbs * 0.30
                return {
                    'retail_value_saved': round(total_value, 2),
                    'disposal_cost_savings': round(disposal_cost_savings, 2),
                    'total_financial_impact': round(total_value + disposal_cost_savings, 2)
                }
            
            class WasteAnalytics:
                def __init__(self, db_path):
                    self.db_path = db_path
                
                def get_historical_data(self, days=30):
                    # Simplified version without pandas
                    import sqlite3
                    conn = sqlite3.connect(self.db_path)
                    cursor = conn.cursor()
                    cursor.execute('''
                        SELECT store_name, store_email, weight_lbs, food_type, created_at,
                               pickup_completed_at, status, volunteer_id
                        FROM packages 
                        WHERE created_at >= datetime('now', '-{} days')
                        ORDER BY created_at DESC
                    '''.format(days))
                    
                    data = cursor.fetchall()
                    conn.close()
                    return data
                
                def calculate_carbon_footprint(self, waste_lbs):
                    waste_kg = waste_lbs * 0.453592
                    co2e_kg = waste_kg * 3.5
                    co2e_lbs = co2e_kg * 2.20462
                    meals_provided = waste_lbs * 1.2
                    return {
                        'co2e_prevented_kg': round(co2e_kg, 2),
                        'co2e_prevented_lbs': round(co2e_lbs, 2),
                        'meals_provided': round(meals_provided, 1),
                        'families_helped': round(meals_provided / 4, 1)
                    }
        
        days = request.args.get('days', 30, type=int)
        
        # Get analytics engine
        analytics = WasteAnalytics(DATABASE)
        data = analytics.get_historical_data(days)
        
        # Filter for specific store (simplified without pandas)
        store_data = [row for row in data if row[1] == store_email]
        
        if not store_data:
            return jsonify({
                'success': True,
                'insights': {
                    'store_email': store_email,
                    'period_days': days,
                    'total_waste_lbs': 0,
                    'total_packages': 0,
                    'completion_rate': 0,
                    'avg_pickup_time_hours': 0,
                    'financial_impact': {
                        'retail_value_saved': 0,
                        'disposal_cost_savings': 0,
                        'total_financial_impact': 0
                    },
                    'environmental_impact': {
                        'co2e_prevented_kg': 0,
                        'co2e_prevented_lbs': 0,
                        'meals_provided': 0,
                        'families_helped': 0
                    },
                    'food_type_breakdown': {},
                    'performance_score': 0
                }
            })
        
        # Calculate metrics (simplified without pandas)
        total_waste = sum(row[2] for row in store_data)  # weight_lbs is at index 2
        total_packages = len(store_data)
        completed_packages = len([row for row in store_data if row[6] == 'completed'])  # status is at index 6
        completion_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
        avg_pickup_time = 2.0  # Mock value for now
        
        # Financial impact
        financial_impact = calculate_financial_impact(total_waste, 'default')
        
        # Environmental impact
        environmental_impact = analytics.calculate_carbon_footprint(total_waste)
        
        # Food type breakdown
        food_type_breakdown = {}
        for row in store_data:
            food_type = row[3]  # food_type is at index 3
            weight = row[2]     # weight_lbs is at index 2
            if food_type not in food_type_breakdown:
                food_type_breakdown[food_type] = {'weight_lbs': 0, 'count': 0}
            food_type_breakdown[food_type]['weight_lbs'] += weight
            food_type_breakdown[food_type]['count'] += 1
        
        # Performance score
        performance_score = min(100, completion_rate * 0.7 + (100 - min(avg_pickup_time * 10, 100)) * 0.3)
        
        insights = {
            'store_email': store_email,
            'period_days': days,
            'total_waste_lbs': round(total_waste, 1),
            'total_packages': total_packages,
            'completion_rate': round(completion_rate, 1),
            'avg_pickup_time_hours': round(avg_pickup_time, 1),
            'financial_impact': financial_impact,
            'environmental_impact': environmental_impact,
            'food_type_breakdown': food_type_breakdown,
            'performance_score': round(performance_score, 1)
        }
        
        return jsonify({
            'success': True,
            'insights': insights,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/weekly-report', methods=['POST'])
def generate_weekly_report():
    """Generate AI-powered weekly report"""
    try:
        # Import AI models or use fallback functions
        try:
            from ai_models import AIInsightsGenerator, WasteAnalytics, WastePredictor
        except ImportError:
            # Use fallback classes
            class AIInsightsGenerator:
                def __init__(self, api_key):
                    self.api_key = api_key
                
                def generate_weekly_report(self, trends, predictions, recommendations):
                    return f"""# Weekly AI-Generated Report

## 📊 Key Metrics
- **Total Waste Diverted**: {trends.get('total_waste_lbs', 0):.1f} lbs
- **Packages Processed**: {trends.get('total_packages', 0)}
- **Completion Rate**: {trends.get('completion_rate', 0):.1f}%

## 🎯 AI Recommendations
- Optimize pickup scheduling for better efficiency
- Expand volunteer network for improved coverage
- Monitor waste patterns for trend analysis

*Report generated by AI analytics system*"""
            
            class WastePredictor:
                def get_optimization_recommendations(self):
                    return {
                        'inventory_reductions': {},
                        'top_volunteers': []
                    }
            
            class WasteAnalytics:
                def __init__(self, db_path):
                    self.db_path = db_path
                
                def get_historical_data(self, days=30):
                    # Simplified version without pandas
                    import sqlite3
                    conn = sqlite3.connect(self.db_path)
                    cursor = conn.cursor()
                    cursor.execute('''
                        SELECT store_name, store_email, weight_lbs, food_type, created_at,
                               pickup_completed_at, status, volunteer_id
                        FROM packages 
                        WHERE created_at >= datetime('now', '-{} days')
                        ORDER BY created_at DESC
                    '''.format(days))
                    
                    data = cursor.fetchall()
                    conn.close()
                    return data
                
                def calculate_carbon_footprint(self, waste_lbs):
                    waste_kg = waste_lbs * 0.453592
                    co2e_kg = waste_kg * 3.5
                    co2e_lbs = co2e_kg * 2.20462
                    meals_provided = waste_lbs * 1.2
                    return {
                        'co2e_prevented_kg': round(co2e_kg, 2),
                        'co2e_prevented_lbs': round(co2e_lbs, 2),
                        'meals_provided': round(meals_provided, 1),
                        'families_helped': round(meals_provided / 4, 1)
                    }
        
        data = request.get_json()
        store_email = data.get('store_email')
        days = data.get('days', 7)
        
        if not store_email:
            return jsonify({'success': False, 'error': 'store_email is required'}), 400
        
        # Get analytics
        analytics = WasteAnalytics(DATABASE)
        data = analytics.get_historical_data(days)
        store_data = [row for row in data if row[1] == store_email]
        
        if not store_data:
            return jsonify({
                'success': True,
                'report': f"No data available for store {store_email} in the last {days} days.",
                'executive_summary': "Insufficient data to generate meaningful insights.",
                'detailed_report': "No packages found for analysis.",
                'predictions': {},
                'metrics': {},
                'trends': {},
                'recommendations': {},
                'environmental_impact': {},
                'period_days': days,
                'generated_at': datetime.now().isoformat()
            })
        
        # Calculate trends and metrics (simplified)
        total_waste = sum(row[2] for row in store_data)  # weight_lbs
        total_packages = len(store_data)
        completed_packages = len([row for row in store_data if row[6] == 'completed'])
        completion_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
        
        trends = {
            'total_waste_lbs': total_waste,
            'total_packages': total_packages,
            'completion_rate': completion_rate,
            'food_type_breakdown': {}
        }
        
        # Get AI predictions
        predictor = WastePredictor()
        predictions = predictor.get_optimization_recommendations()
        
        # Generate structured report
        
        # Mock structured report data
        structured_report = {
            'store_name': store_data[0][0] if store_data else 'Unknown Store',  # store_name is at index 0
            'period_start': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
            'period_end': datetime.now().strftime('%Y-%m-%d'),
            'kpis': {
                'total_packages': trends.get('total_packages', 0),
                'completed_packages': completed_packages,
                'completion_rate': completion_rate / 100,
                'waste_generated_lbs': total_waste,
                'waste_diverted_lbs': total_waste * (completion_rate / 100),
                'financial_impact_usd': total_waste * 3.5,
                'meals_lost_est': total_waste * 2.3,
                'co2e_kg': total_waste * 1.13
            },
            'category_breakdown': [
                {'category': k, 'waste_lbs': v.get('sum', 0), 'share': 0.2}
                for k, v in trends.get('food_type_breakdown', {}).items()
            ],
            'root_causes_ranked': [
                "Inconsistent pickup scheduling leading to food spoilage",
                "Limited volunteer availability during peak waste periods",
                "Lack of coordination between store staff and volunteers"
            ],
            'recommendations': [
                {
                    'title': 'Optimize Pickup Scheduling',
                    'priority': 'high',
                    'rationale': 'Current pickup times are not aligned with waste generation patterns',
                    'expected_impact': '15-20% reduction in food waste',
                    'how_to_measure': 'Track pickup completion rate and time to pickup',
                    'owner': 'Store Manager',
                    'eta_days': 14
                },
                {
                    'title': 'Expand Volunteer Network',
                    'priority': 'medium',
                    'rationale': 'More volunteers would provide better coverage',
                    'expected_impact': '10-15% improvement in pickup reliability',
                    'how_to_measure': 'Monitor volunteer response time and availability',
                    'owner': 'Community Coordinator',
                    'eta_days': 30
                }
            ],
            'forecast': {
                'waste_next_week_lbs_low': total_waste * 0.8,
                'waste_next_week_lbs_high': total_waste * 1.2,
                'assumptions': 'Based on historical patterns and seasonal trends'
            },
            'confidence': 0.75,
            'data_quality_notes': f'Analysis based on {len(store_data)} data points over {days} days',
            'plain_text_report': f"""Store Performance Summary:
Your store has processed {total_packages} packages over the last {days} days, 
with a completion rate of {completion_rate:.1f}%. Total food waste diverted: {total_waste:.1f} lbs.

Key Areas for Improvement:
1. Pickup scheduling optimization could reduce food spoilage
2. Volunteer engagement initiatives could improve reliability
3. Better coordination between staff and volunteers needed

Environmental Impact:
- CO2 emissions prevented: {total_waste * 1.13:.1f} kg
- Meals provided: {total_waste * 2.3:.0f}
- Financial value saved: ${total_waste * 3.5:.2f}"""
        }
        
        # Generate AI report using Anthropic if available
        ai_generator = AIInsightsGenerator(os.getenv('ANTHROPIC_API_KEY', ''))
        report = ai_generator.generate_weekly_report(trends, predictions, predictions)
        
        return jsonify({
            'success': True,
            'report': report,
            'executive_summary': f"Your store successfully diverted {total_waste:.1f} lbs of food waste with a {completion_rate:.1f}% completion rate over the last {days} days.",
            'detailed_report': report,
            'predictions': predictions,
            'metrics': trends,
            'trends': trends,
            'recommendations': predictions,
            'environmental_impact': analytics.calculate_carbon_footprint(total_waste),
            'period_days': days,
            'generated_at': datetime.now().isoformat(),
            'structured_report': structured_report
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/reports/history/<store_email>', methods=['GET'])
def get_report_history(store_email):
    """Get report history for a store"""
    try:
        # Mock report history - in a real implementation, you'd store these in a database
        mock_reports = [
            {
                'id': 1,
                'report_type': 'weekly_report',
                'period_days': 7,
                'report_date': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'created_at': (datetime.now() - timedelta(days=7)).isoformat(),
                'executive_summary': 'Weekly performance analysis showing 12.5 lbs food waste diverted with 85% completion rate.'
            },
            {
                'id': 2,
                'report_type': 'weekly_report',
                'period_days': 7,
                'report_date': (datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d'),
                'created_at': (datetime.now() - timedelta(days=14)).isoformat(),
                'executive_summary': 'Strong volunteer engagement resulted in 15.2 lbs food waste recovery with 90% completion rate.'
            }
        ]
        
        return jsonify({
            'success': True,
            'reports': mock_reports
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/reports/<int:report_id>', methods=['GET'])
def get_report_by_id(report_id):
    """Get a specific report by ID"""
    try:
        # Mock report data
        mock_report = {
            'id': report_id,
            'report': 'Detailed AI analysis of food waste patterns and optimization opportunities.',
            'executive_summary': 'Strong performance with opportunities for improvement in pickup scheduling.',
            'detailed_report': 'Comprehensive analysis showing waste trends, volunteer performance, and environmental impact.',
            'predictions': {
                'next_week_waste_lbs': 18.5,
                'efficiency_improvements': ['Schedule optimization', 'Volunteer engagement']
            },
            'metrics': {
                'total_waste_lbs': 25.3,
                'completion_rate': 87.5,
                'environmental_impact': 'Significant CO2 reduction achieved'
            },
            'trends': {
                'waste_trend': 'decreasing',
                'volunteer_engagement': 'high'
            },
            'recommendations': {
                'high_priority': ['Optimize pickup times'],
                'medium_priority': ['Expand food types', 'Volunteer training']
            },
            'environmental_impact': {
                'co2_prevented': 28.6,
                'meals_provided': 58
            },
            'period_days': 7,
            'generated_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'report': mock_report
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/reports/<int:report_id>/export', methods=['GET'])
def export_report(report_id):
    """Export report in CSV or PDF format"""
    try:
        format_type = request.args.get('format', 'csv')
        
        if format_type == 'csv':
            # Mock CSV content
            csv_content = """Report ID,Date,Store,Waste Diverted (lbs),Completion Rate (%),CO2 Prevented (kg)
{},2024-03-20,Sample Store,25.3,87.5,28.6""".format(report_id)
            
            return jsonify({
                'success': True,
                'content': csv_content,
                'filename': f'waste_report_{report_id}.csv',
                'mime_type': 'text/csv'
            })
        elif format_type == 'pdf':
            # Mock PDF content (in real implementation, generate actual PDF)
            return jsonify({
                'success': True,
                'content': 'Mock PDF content - implement PDF generation',
                'filename': f'waste_report_{report_id}.pdf',
                'mime_type': 'application/pdf'
            })
        else:
            return jsonify({'success': False, 'error': 'Unsupported format'}), 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the React application"""
    if path != "" and os.path.exists(os.path.join('frontend/build', path)):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully")
    
    # Get port from environment variable (Railway/Vercel requirement)
    port = int(os.environ.get('PORT', 5001))
    
    print(f"Starting Flask server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
