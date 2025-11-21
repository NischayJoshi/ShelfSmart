# ShelfSmart

Retail shelf monitoring using CLIP (HuggingFace) for detection and Graph logic for misplacements.

## Project Structure

```
ShelfSmart/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx   # Main app with image upload and results display
│   │   └── ...
│   └── package.json
├── backend/           # FastAPI + Python
│   ├── main.py       # FastAPI application with /analyze endpoint
│   └── graph_db.json # Product metadata and relationships
├── requirements.txt   # Python dependencies
└── package.json      # Root package.json for monorepo
```

## Features

- **Image Upload**: Upload shelf images for analysis
- **Product Detection**: Uses CLIP (HuggingFace) for detecting products
- **Graph Logic**: NetworkX-based graph database for product relationships
- **Misplacement Detection**: Identifies products in incorrect locations
- **Real-time Results**: Visual display of detected products and issues

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
npm install
cd frontend && npm install
```

## Running the Application

### Start Backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Start Frontend (React + Vite)

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /products` - List all products in graph database
- `POST /analyze` - Analyze shelf image (accepts multipart/form-data with image file)

## Usage

1. Open the frontend at `http://localhost:5173`
2. Click "Choose File" and select a shelf image
3. Click "Analyze Shelf" to process the image
4. View detected products and misplacements in the results section

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- Uvicorn - ASGI server
- Transformers - HuggingFace library for CLIP model
- PyTorch - Deep learning framework
- Pillow - Image processing
- NetworkX - Graph database and analysis
- Python-multipart - File upload handling

### Frontend
- React - UI framework
- Vite - Build tool and dev server
- Tailwind CSS - Utility-first CSS framework

## Development

The project uses a monorepo structure with workspaces. Root scripts available:

```bash
npm run frontend    # Start frontend dev server
npm run backend     # Start backend server
```

## Graph Database

The `backend/graph_db.json` file contains:
- Product metadata (ID, name, category, expected location)
- Product relationships (similar categories, often bought together)

This data is loaded into a NetworkX graph for efficient relationship queries and misplacement detection.

## Future Enhancements

- [ ] Integrate actual CLIP model for real product detection
- [ ] Add authentication and user management
- [ ] Implement database persistence (PostgreSQL/MongoDB)
- [ ] Add real-time monitoring with websockets
- [ ] Deploy to production environment
- [ ] Add comprehensive test coverage
