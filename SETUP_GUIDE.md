# HEC-SL Setup Guide

This guide provides step-by-step instructions for setting up the HEC-SL (Human Settlement & Human-Elephant Conflict) web mapping application.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Python 3.11 or higher**
- **Node.js 20 or higher**
- **pnpm** (preferred) or npm
- **Git**
- **MongoDB Atlas account** (free tier available)

## 🗄️ Database Setup

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in
3. Create a new cluster (M0 free tier is sufficient)
4. Wait for cluster deployment (5-10 minutes)

### 2. Configure Database Access

1. **Create Database User**:
   - Go to Database Access
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Grant "Read and write to any database" privileges

2. **Configure Network Access**:
   - Go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, restrict to specific IPs

3. **Get Connection String**:
   - Go to Clusters
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🔧 Environment Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `backend/hec-backend/` directory:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=hec_sl_db

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
```

### 2. Frontend Configuration

The frontend uses Vite's proxy configuration to connect to the backend. No additional environment variables needed for development.

## 🚀 Installation Steps

### Step 1: Clone and Setup Backend

```bash
# Navigate to project directory
cd hec-sl-app/backend/hec-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import flask, pymongo; print('Dependencies installed successfully')"
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory
cd ../../frontend/hec-frontend

# Install Node.js dependencies
pnpm install

# Verify installation
pnpm run --version
```

### Step 3: Import GIS Data

```bash
# Navigate back to backend
cd ../../backend/hec-backend

# Ensure virtual environment is activated
source venv/bin/activate

# Import GIS data (adjust path to your GIS data directory)
python src/data_import.py /path/to/GIS_Data

# Expected output:
# Starting data import from: /path/to/GIS_Data
# Successfully imported X features for layer: districts
# Successfully imported X features for layer: forests
# ... (for each layer)
# Import completed. Successfully imported 9 layers.
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server**:
   ```bash
   cd backend/hec-backend
   source venv/bin/activate
   python src/main.py
   ```
   
   Expected output:
   ```
   * Running on all addresses (0.0.0.0)
   * Running on http://127.0.0.1:5000
   * Running on http://[your-ip]:5000
   ```

2. **Start Frontend Development Server** (in new terminal):
   ```bash
   cd frontend/hec-frontend
   pnpm run dev
   ```
   
   Expected output:
   ```
   Local:   http://localhost:5173/
   Network: http://[your-ip]:5173/
   ```

3. **Access Application**:
   - Open browser to `http://localhost:5173`
   - The frontend will proxy API requests to the backend

### Production Mode

1. **Build Frontend**:
   ```bash
   cd frontend/hec-frontend
   pnpm run build
   ```

2. **Copy Built Files to Flask Static Directory**:
   ```bash
   cp -r dist/* ../../backend/hec-backend/src/static/
   ```

3. **Run Production Server**:
   ```bash
   cd ../../backend/hec-backend
   source venv/bin/activate
   python src/main.py
   ```

4. **Access Application**:
   - Open browser to `http://localhost:5000`
   - Flask serves both API and frontend

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"success": true, "message": "HEC-SL API is running", "status": "healthy"}

# Test layers endpoint
curl http://localhost:5000/api/layers

# Expected response:
# {"success": true, "layers": ["districts", "forests", "hec_density", ...]}
```

### 2. Test Frontend

1. Navigate to `http://localhost:5173` (development) or `http://localhost:5000` (production)
2. Verify all pages load:
   - Home: Should show hero sections with statistics
   - Map: Should display interactive map with layer controls
   - Live: Should show conflict tracker with reporting functionality
   - About: Should display project information

### 3. Test Map Functionality

1. Go to Map page
2. Toggle different layers on/off using the layer control panel
3. Verify layers load and display correctly
4. Hover over map features to see popup information

### 4. Test Reporting Functionality

1. Go to Live page
2. Click on the map to select a location
3. Fill out the report form
4. Submit the report
5. Verify "SUBMITTED SUCCESSFULLY" message appears

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoServerError: Authentication failed
```
**Solution**: 
- Verify username/password in connection string
- Check database user permissions
- Ensure network access is configured

#### 2. Import Script Fails
```
Error importing /path/to/file.geojson: Invalid JSON
```
**Solution**:
- Verify GIS data files are valid GeoJSON format
- Check file paths are correct
- Ensure files are not corrupted

#### 3. Frontend Build Errors
```
Error: Cannot resolve module 'leaflet'
```
**Solution**:
- Delete `node_modules` and `pnpm-lock.yaml`
- Run `pnpm install` again
- Verify Node.js version compatibility

#### 4. CORS Errors
```
Access to fetch at 'http://localhost:5000/api/layers' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution**:
- Verify Flask-CORS is installed and configured
- Check backend is running on port 5000
- Verify proxy configuration in `vite.config.js`

#### 5. Map Not Loading
```
Leaflet container not found
```
**Solution**:
- Verify Leaflet CSS is included in `index.html`
- Check map container has proper height/width
- Ensure React components are properly mounted

### Debug Mode

Enable debug logging:

```bash
# Backend debug mode
export FLASK_ENV=development
export FLASK_DEBUG=1
python src/main.py

# Frontend debug mode
pnpm run dev --debug
```

### Log Files

Check application logs:
- Backend: Console output from Flask server
- Frontend: Browser developer console
- Database: MongoDB Atlas logs in dashboard

## 📊 Performance Optimization

### 1. Database Indexing

The application automatically creates geospatial indexes, but you can verify:

```python
# Connect to MongoDB and check indexes
from pymongo import MongoClient
client = MongoClient("your-connection-string")
db = client["hec_sl_db"]

# Check indexes
print(db.geojson_layers.list_indexes())
print(db.user_reports.list_indexes())
```

### 2. Frontend Optimization

- Use production build for deployment
- Enable gzip compression on server
- Implement lazy loading for large datasets
- Cache API responses where appropriate

### 3. Backend Optimization

- Use connection pooling for MongoDB
- Implement API rate limiting
- Add response caching for static data
- Optimize GeoJSON queries with spatial indexes

## 🔒 Security Considerations

### Development
- Use strong SECRET_KEY
- Don't commit sensitive data to version control
- Use environment variables for configuration

### Production
- Restrict MongoDB network access to specific IPs
- Use HTTPS for all connections
- Implement API authentication if needed
- Regular security updates for dependencies

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review application logs
3. Search existing GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Log output

## 🎯 Next Steps

After successful setup:

1. Customize the application for your specific use case
2. Add additional GIS data layers
3. Implement user authentication if needed
4. Deploy to production environment
5. Set up monitoring and logging
6. Configure automated backups

---

**Congratulations!** You should now have a fully functional HEC-SL web mapping application running locally. The application provides a powerful platform for visualizing Human-Elephant Conflict data and enabling community participation in wildlife conservation efforts.

