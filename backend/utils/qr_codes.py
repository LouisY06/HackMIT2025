import qrcode
import base64
from io import BytesIO
from typing import Dict, Any

def generate_qr_code(data: Dict[str, Any]) -> str:
    """
    Generate a QR code from data and return as base64 string
    """
    # Convert data to string
    qr_data = f"package_id:{data['package_id']},volunteer_id:{data['volunteer_id']},points:{data['points']}"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def decode_qr_code(qr_data: str) -> Dict[str, Any]:
    """
    Decode QR code data string back to dictionary
    """
    try:
        parts = qr_data.split(',')
        result = {}
        for part in parts:
            key, value = part.split(':')
            if key == 'package_id' or key == 'volunteer_id' or key == 'points':
                result[key] = int(value)
            else:
                result[key] = value
        return result
    except Exception as e:
        raise ValueError(f"Invalid QR code data: {e}")

def validate_qr_code(qr_data: str, expected_package_id: int, expected_volunteer_id: int) -> bool:
    """
    Validate that QR code data matches expected values
    """
    try:
        decoded = decode_qr_code(qr_data)
        return (decoded.get('package_id') == expected_package_id and 
                decoded.get('volunteer_id') == expected_volunteer_id)
    except:
        return False
