# HEC-SL: Human Settlement & Human-Elephant Conflict Web Map

A comprehensive web mapping application for visualizing Human Settlement Patterns and Human-Elephant Conflict (HEC) in Sri Lanka. This interactive platform allows users to explore GIS data layers and contribute crowd-sourced reports of elephant encounters.

## 🌟 Features

- **Interactive Map Visualization**: Explore multiple GIS data layers including districts, forests, elephant habitats, and conflict zones
- **Layer Management**: Toggle different data layers on/off to customize map view
- **User Reporting**: Submit anonymous reports of elephant sightings and conflict incidents
- **Live Conflict Tracker**: View real-time user-submitted reports on the map
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark Theme**: Professional dark interface with red accent colors

## 🏗️ Architecture

### Frontend
- **React 18**: Modern React application with functional components and hooks
- **Leaflet**: Interactive mapping library for GIS data visualization
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for single-page application

### Backend
- **Flask**: Python web framework for REST API
- **MongoDB**: NoSQL database for storing GIS data and user reports
- **PyMongo**: MongoDB driver for Python
- **Flask-CORS**: Cross-origin resource sharing support
- **GeoJSON**: Standard format for geographic data

### Database Schema
- **geojson_layers**: Stores GIS layer data with spatial indexing
- **user_reports**: Stores crowd-sourced incident reports with location data

## 📁 Project Structure

```
hec-sl-app/
├── backend/
│   └── hec-backend/
│       ├── src/
│       │   ├── models/
│       │   │   ├── geojson_data.py    # MongoDB models
│       │   │   └── user.py            # User model (template)
│       │   ├── routes/
│       │   │   ├── geojson_routes.py  # API endpoints
│       │   │   └── user.py            # User routes (template)
│       │   ├── static/                # Built frontend files
│       │   ├── config.py              # Database configuration
│       │   ├── data_import.py         # GIS data import script
│       │   └── main.py                # Flask application entry point
│       ├── requirements.txt           # Python dependencies
│       └── venv/                      # Virtual environment
├── frontend/
│   └── hec-frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                # Shadcn/ui components
│       │   │   ├── Navigation.jsx     # Navigation component
│       │   │   └── MapComponent.jsx   # Leaflet map component
│       │   ├── pages/
│       │   │   ├── Home.jsx           # Homepage
│       │   │   ├── Live.jsx           # Live reporting page
│       │   │   ├── Map.jsx            # Map visualization page
│       │   │   └── About.jsx          # About page
│       │   ├── App.jsx                # Main application component
│       │   └── App.css                # Global styles
│       ├── package.json               # Node.js dependencies
│       └── dist/                      # Built production files
└── todo.md                           # Project progress tracking
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hec-sl-app
   ```

2. **Backend Setup**
   ```bash
   cd backend/hec-backend
   
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/hec-frontend
   
   # Install dependencies
   pnpm install  # or npm install
   ```

4. **Database Configuration**
   
   Set environment variables for MongoDB connection:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
   export DATABASE_NAME="hec_sl_db"
   ```

5. **Import GIS Data**
   ```bash
   cd backend/hec-backend
   source venv/bin/activate
   python src/data_import.py /path/to/gis/data/directory
   ```

### Development

1. **Start Backend Server**
   ```bash
   cd backend/hec-backend
   source venv/bin/activate
   python src/main.py
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend/hec-frontend
   pnpm run dev
   ```
   Application runs on http://localhost:5173

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend/hec-frontend
   pnpm run build
   ```

2. **Copy to Flask Static Directory**
   ```bash
   cp -r frontend/hec-frontend/dist/* backend/hec-backend/src/static/
   ```

3. **Run Production Server**
   ```bash
   cd backend/hec-backend
   source venv/bin/activate
   python src/main.py
   ```

## 🗺️ GIS Data Layers

The application supports the following data layers:

- **Districts**: Administrative district boundaries of Sri Lanka
- **DSDs**: Divisional Secretariat Division boundaries
- **Forests**: Forest areas with food sources for elephants
- **Forest Cover**: General forest cover areas
- **Habitat 1960**: Historical elephant habitat areas (1960)
- **Habitat 2020**: Current elephant habitat areas (2020)
- **HEC Density**: Human-Elephant Conflict density zones
- **Elephant Deaths**: Recorded elephant death incidents (2018-2023)
- **Human Deaths**: Recorded human death incidents (2018-2020)

## 🔌 API Endpoints

### GIS Data
- `GET /api/layers` - Get list of available layers
- `GET /api/layers/{layer_name}` - Get GeoJSON data for specific layer

### User Reports
- `POST /api/reports` - Submit new incident report
- `GET /api/reports` - Get all user reports as GeoJSON
- `GET /api/reports/near?lat={lat}&lng={lng}&distance={km}` - Get reports near location

### Health Check
- `GET /api/health` - API health status

## 🎨 Design System

### Color Palette
- **Background**: Black (#000000)
- **Primary Text**: White (#FFFFFF)
- **Accent**: Red (#DC2626)
- **Secondary**: Dark Gray (#1A1A1A)
- **Borders**: Gray (#333333)

### Typography
- **Headings**: Bold, uppercase for impact
- **Body Text**: Clean, readable sans-serif
- **Navigation**: Uppercase, spaced lettering

## 📱 Pages

### Home
- Hero section with project branding
- Statistics about elephant population and conflict
- Information about Human-Elephant Conflict in Sri Lanka

### Map
- Full-screen interactive map
- Layer control panel for toggling data layers
- Hover tooltips showing feature properties

### Live
- Live conflict tracker with user reports
- Interactive map for selecting report locations
- Report submission form with validation

### About
- Project information and developer details
- Social media links
- Academic context and objectives

## 🔧 Configuration

### Environment Variables
```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=hec_sl_db

# Flask Configuration
SECRET_KEY=your-secret-key-here
```

### MongoDB Collections
- `geojson_layers`: Stores GIS features with spatial indexing
- `user_reports`: Stores user-submitted reports with geospatial data

## 🚀 Deployment

### Option 1: Traditional Hosting
1. Set up MongoDB Atlas cluster
2. Deploy Flask backend to cloud provider (Railway, Heroku, etc.)
3. Configure environment variables
4. Import GIS data using the data import script

### Option 2: Docker Deployment
```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "src/main.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- University of Moratuwa - Advanced GIS and Remote Sensing module
- OpenStreetMap contributors for base map tiles
- Leaflet.js community for mapping library
- React and Flask communities for excellent documentation

## 📞 Support

For questions or support, please contact:
- Email: thulnithsathviruofficial@gmail.com
- LinkedIn: [[your-linkedin-profile]](https://www.linkedin.com/in/thulnith-sathviru?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- GitHub Issues: [repository-issues-url]

---

**Note**: This project was developed as part of an academic module focusing on Human-Elephant Conflict (HEC) in Sri Lanka. The goal is to visualize conflict patterns, empower public participation, and support data-driven planning decisions for wildlife conservation and human safety.

