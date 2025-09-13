import math

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r

def calculate_points(distance_km: float) -> int:
    """Calculate points based on distance (10 points per km, minimum 5 points)"""
    points = max(5, int(distance_km * 10))
    return points

def calculate_estimated_hours(distance_km: float, average_speed_kmh: float = 15) -> float:
    """Calculate estimated hours based on distance and average speed"""
    return round(distance_km / average_speed_kmh, 2)

# Hardcoded store locations for demo
DEMO_STORES = [
    {
        "id": 1,
        "name": "Demo Grocery Store",
        "address": "123 Main St, Cambridge, MA",
        "lat": 42.3601,
        "lng": -71.0589
    },
    {
        "id": 2,
        "name": "Tech Campus Store",
        "address": "77 Massachusetts Ave, Cambridge, MA",
        "lat": 42.3601,
        "lng": -71.0931
    },
    {
        "id": 3,
        "name": "Central Square Market",
        "address": "1 Central Square, Cambridge, MA",
        "lat": 42.3656,
        "lng": -71.1036
    },
    {
        "id": 4,
        "name": "Harvard Square Store",
        "address": "1400 Massachusetts Ave, Cambridge, MA",
        "lat": 42.3736,
        "lng": -71.1189
    },
    {
        "id": 5,
        "name": "Kendall Square Market",
        "address": "1 Kendall Square, Cambridge, MA",
        "lat": 42.3641,
        "lng": -71.0861
    }
]

def get_store_by_id(store_id: int):
    """Get store information by ID"""
    for store in DEMO_STORES:
        if store["id"] == store_id:
            return store
    return None
