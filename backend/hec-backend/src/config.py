import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # MongoDB configuration
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.environ.get('DATABASE_NAME', 'hec_sl_db')
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
    
    # CORS configuration
    CORS_ORIGINS = [
        "https://elephantguardsl.netlify.app",
        "http://localhost:3000",  # For local development
        "http://localhost:5173",  # For Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    @staticmethod
    def get_mongo_client():
        """Get MongoDB client instance"""
        return MongoClient(Config.MONGODB_URI)
    
    @staticmethod
    def get_database():
        """Get database instance"""
        client = Config.get_mongo_client()
        return client[Config.DATABASE_NAME]

