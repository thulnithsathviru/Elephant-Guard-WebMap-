from pymongo import MongoClient, GEOSPHERE
from src.config import Config
import json
from datetime import datetime

class GeoJSONData:
    def __init__(self):
        self.db = Config.get_database()
        self.collection = self.db.geojson_layers
        
        # Create geospatial index for efficient spatial queries
        try:
            self.collection.create_index([("geometry", GEOSPHERE)])
        except Exception as e:
            print(f"Index creation warning: {e}")
    
    def insert_layer(self, layer_name, geojson_data, description=None):
        """Insert a GeoJSON layer into the database"""
        document = {
            "layer_name": layer_name,
            "description": description,
            "geojson_data": geojson_data,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Add geometry field for spatial indexing
        if "features" in geojson_data:
            for feature in geojson_data["features"]:
                if "geometry" in feature:
                    # Store each feature as a separate document for better spatial queries
                    feature_doc = {
                        "layer_name": layer_name,
                        "description": description,
                        "feature_id": feature.get("properties", {}).get("id"),
                        "properties": feature.get("properties", {}),
                        "geometry": feature["geometry"],
                        "created_at": datetime.utcnow()
                    }
                    self.collection.insert_one(feature_doc)
        
        return True
    
    def get_layer(self, layer_name):
        """Get all features for a specific layer"""
        features = list(self.collection.find({"layer_name": layer_name}))
        
        if not features:
            return None
        
        # Convert to GeoJSON format
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        for feature in features:
            geojson_feature = {
                "type": "Feature",
                "properties": feature.get("properties", {}),
                "geometry": feature.get("geometry", {})
            }
            geojson["features"].append(geojson_feature)
        
        return geojson
    
    def get_all_layers(self):
        """Get list of all available layers"""
        layers = self.collection.distinct("layer_name")
        return layers
    
    def delete_layer(self, layer_name):
        """Delete a layer and all its features"""
        result = self.collection.delete_many({"layer_name": layer_name})
        return result.deleted_count

class UserReports:
    def __init__(self):
        self.db = Config.get_database()
        self.collection = self.db.user_reports
        
        # Create geospatial index
        try:
            self.collection.create_index([("location", GEOSPHERE)])
        except Exception as e:
            print(f"Index creation warning: {e}")
    
    def create_report(self, latitude, longitude, report_type, description, date=None, time=None):
        """Create a new user report"""
        report = {
            "location": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            },
            "latitude": latitude,
            "longitude": longitude,
            "report_type": report_type,
            "description": description,
            "date": date,
            "time": time,
            "created_at": datetime.utcnow(),
            "status": "pending"
        }
        
        result = self.collection.insert_one(report)
        return str(result.inserted_id)
    
    def get_all_reports(self):
        """Get all user reports"""
        reports = list(self.collection.find())
        
        # Convert to GeoJSON format
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        for report in reports:
            feature = {
                "type": "Feature",
                "properties": {
                    "id": str(report["_id"]),
                    "report_type": report.get("report_type"),
                    "description": report.get("description"),
                    "date": report.get("date"),
                    "time": report.get("time"),
                    "created_at": report.get("created_at").isoformat() if report.get("created_at") else None,
                    "status": report.get("status")
                },
                "geometry": report.get("location")
            }
            geojson["features"].append(feature)
        
        return geojson
    
    def get_reports_near(self, latitude, longitude, max_distance_km=10):
        """Get reports near a specific location"""
        max_distance_meters = max_distance_km * 1000
        
        reports = list(self.collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "$maxDistance": max_distance_meters
                }
            }
        }))
        
        return reports

