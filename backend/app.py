from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import qrcode
import os
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE = 'packages.db'

def init_db():
    """Initialize the database with the packages table"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
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
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            volunteer_id TEXT,
            pickup_completed_at DATETIME
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

@app.route('/api/packages', methods=['POST'])
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
        
        # Generate unique package ID
        package_id = str(int(datetime.now().timestamp() * 1000))
        
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
                qr_code_data, qr_code_image_path, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            'pending'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'package_id': package_id,
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
                'status': package[10],
                'created_at': package[11],
                'volunteer_id': package[12],
                'pickup_completed_at': package[13]
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
            'status': package[10],
            'created_at': package[11],
            'volunteer_id': package[12],
            'pickup_completed_at': package[13]
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'success': True, 'message': 'Backend is running'})

@app.route('/uploads/<filename>')
def serve_qr_code(filename):
    """Serve QR code images"""
    try:
        return send_file(f'uploads/{filename}')
    except FileNotFoundError:
        return jsonify({'error': 'QR code not found'}), 404

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully")
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
