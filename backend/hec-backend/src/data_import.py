#!/usr/bin/env python3
"""
Data import script for HEC-SL project
This script imports GeoJSON files into MongoDB
"""

import os
import json
import sys
from pathlib import Path

# Add the parent directory of src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.geojson_data import GeoJSONData

def import_geojson_file(file_path, layer_name, description=None):
    """Import a single GeoJSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
        
        geojson_model = GeoJSONData()
        
        # Delete existing layer if it exists
        deleted_count = geojson_model.delete_layer(layer_name)
        if deleted_count > 0:
            print(f"Deleted {deleted_count} existing features for layer: {layer_name}")
        
        # Import new data
        success = geojson_model.insert_layer(layer_name, geojson_data, description)
        
        if success:
            feature_count = len(geojson_data.get('features', []))
            print(f"Successfully imported {feature_count} features for layer: {layer_name}")
        else:
            print(f"Failed to import layer: {layer_name}")
            
        return success
        
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return False
    except json.JSONDecodeError as e:
        print(f"Invalid JSON in file {file_path}: {e}")
        return False
    except Exception as e:
        print(f"Error importing {file_path}: {e}")
        return False

def import_all_data(data_directory):
    """Import all GeoJSON files from the data directory"""
    
    # Define the layers to import with their descriptions
    layers_config = {
        "Districts.geojson": {
            "layer_name": "districts",
            "description": "District boundaries of Sri Lanka"
        },
        "DSDs.geojson": {
            "layer_name": "dsds", 
            "description": "Divisional Secretariat Division boundaries"
        },
        "All Elephant Deaths from 2018 - 2023.geojson": {
            "layer_name": "elephant_deaths",
            "description": "Elephant death incidents from 2018-2023"
        },
        "Forest Cover.geojson": {
            "layer_name": "forest_cover",
            "description": "Forest cover areas in Sri Lanka"
        },
        "Forests.geojson": {
            "layer_name": "forests",
            "description": "Forest areas with food sources for elephants"
        },
        "Habitat Area 1960.geojson": {
            "layer_name": "habitat_1960",
            "description": "Elephant habitat areas in 1960"
        },
        "Habitat Area 2020.geojson": {
            "layer_name": "habitat_2020", 
            "description": "Elephant habitat areas in 2020"
        },
        "HEC Density.geojson": {
            "layer_name": "hec_density",
            "description": "Human-Elephant Conflict density areas"
        },
        "All Human Deaths from 2018 - 2020.geojson": {
            "layer_name": "human_deaths",
            "description": "Human death incidents from 2018-2020"
        }
    }
    
    data_path = Path(data_directory)
    imported_count = 0
    
    print(f"Starting data import from: {data_path}")
    print("=" * 50)
    
    # Walk through the directory structure
    for root, dirs, files in os.walk(data_path):
        for file in files:
            if file.endswith('.geojson'):
                file_path = os.path.join(root, file)
                
                # Check if this file is in our configuration
                if file in layers_config:
                    config = layers_config[file]
                    success = import_geojson_file(
                        file_path, 
                        config["layer_name"], 
                        config["description"]
                    )
                    if success:
                        imported_count += 1
                else:
                    print(f"Skipping unconfigured file: {file}")
    
    print("=" * 50)
    print(f"Import completed. Successfully imported {imported_count} layers.")
    
    # List all available layers
    geojson_model = GeoJSONData()
    available_layers = geojson_model.get_all_layers()
    print(f"Available layers in database: {available_layers}")

if __name__ == "__main__":
    # Default data directory (adjust path as needed)
    default_data_dir = os.path.join(os.path.dirname(__file__), "..")
    
    if len(sys.argv) > 1:
        data_directory = sys.argv[1]
    else:
        data_directory = default_data_dir
    
    if not os.path.exists(data_directory):
        print(f"Data directory not found: {data_directory}")
        print("Usage: python data_import.py [data_directory]")
        sys.exit(1)
    
    import_all_data(data_directory)

