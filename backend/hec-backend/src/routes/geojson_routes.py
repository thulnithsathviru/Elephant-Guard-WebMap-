from flask import Blueprint, request, jsonify
from src.models.geojson_data import GeoJSONData, UserReports
import json

geojson_bp = Blueprint('geojson', __name__)

# Initialize models
geojson_model = GeoJSONData()
user_reports_model = UserReports()

@geojson_bp.route('/layers', methods=['GET'])
def get_all_layers():
    """Get list of all available layers"""
    try:
        layers = geojson_model.get_all_layers()
        return jsonify({
            "success": True,
            "layers": layers
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@geojson_bp.route('/layers/<layer_name>', methods=['GET'])
def get_layer(layer_name):
    """Get GeoJSON data for a specific layer"""
    try:
        layer_data = geojson_model.get_layer(layer_name)
        
        if layer_data is None:
            return jsonify({
                "success": False,
                "error": "Layer not found"
            }), 404
        
        return jsonify({
            "success": True,
            "data": layer_data
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@geojson_bp.route('/reports', methods=['POST'])
def create_report():
    """Create a new user report"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['latitude', 'longitude', 'report_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Create the report
        report_id = user_reports_model.create_report(
            latitude=float(data['latitude']),
            longitude=float(data['longitude']),
            report_type=data['report_type'],
            description=data.get('description', ''),
            date=data.get('date'),
            time=data.get('time')
        )
        
        return jsonify({
            "success": True,
            "report_id": report_id,
            "message": "Report created successfully"
        })
    
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": "Invalid latitude or longitude format"
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@geojson_bp.route('/reports', methods=['GET'])
def get_all_reports():
    """Get all user reports as GeoJSON"""
    try:
        reports = user_reports_model.get_all_reports()
        return jsonify({
            "success": True,
            "data": reports
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@geojson_bp.route('/reports/near', methods=['GET'])
def get_reports_near():
    """Get reports near a specific location"""
    try:
        latitude = float(request.args.get('lat'))
        longitude = float(request.args.get('lng'))
        max_distance = float(request.args.get('distance', 10))  # Default 10km
        
        reports = user_reports_model.get_reports_near(latitude, longitude, max_distance)
        
        return jsonify({
            "success": True,
            "data": reports
        })
    
    except (TypeError, ValueError) as e:
        return jsonify({
            "success": False,
            "error": "Invalid latitude, longitude, or distance parameters"
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@geojson_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "message": "HEC-SL API is running",
        "status": "healthy"
    })

