# ShelfSmart Setup Guide

Complete guide for setting up the ShelfSmart development environment.

## Prerequisites

### Required Software
- **Python 3.8+** (3.10 or 3.11 recommended)
- **Node.js 18+** (LTS version recommended)
- **npm** or **yarn**
- **Git**

### Optional but Recommended
- **VS Code** with extensions:
  - Python
  - ESLint
  - Tailwind CSS IntelliSense
  - REST Client

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NischayJoshi/ShelfSmart.git
cd ShelfSmart
```

### 2. Backend Setup

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Navigate to backend and start server
cd backend
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Detailed Setup Instructions

### Backend Configuration

#### Environment Variables (Optional)

Create a `.env` file in the backend directory:

```env
# Backend settings
HOST=0.0.0.0
PORT=8000
RELOAD=true

# Model settings (for future CLIP integration)
CLIP_MODEL=openai/clip-vit-base-patch32
BATCH_SIZE=32
```

#### Testing the Backend

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test products endpoint
curl http://localhost:8000/products

# Test analyze endpoint with an image
curl -X POST -F "file=@path/to/image.jpg" http://localhost:8000/analyze
```

### Frontend Configuration

#### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

Update `App.jsx` to use the environment variable:

```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
  method: 'POST',
  body: formData,
})
```

#### Building for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

## Project Structure Overview

```
ShelfSmart/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application file
│   ├── graph_db.json    # Product database
│   └── README.md        # Backend documentation
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main application component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
├── requirements.txt      # Python dependencies
├── package.json         # Root package.json (monorepo)
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
└── SETUP.md             # This file
```

## Common Issues and Solutions

### Issue: Port Already in Use

**Backend (Port 8000)**
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

**Frontend (Port 5173)**
```bash
# Find process using port 5173
lsof -i :5173
# Kill process
kill -9 <PID>
```

### Issue: Module Not Found (Python)

Ensure you're in the virtual environment:
```bash
which python
# Should show path to venv
```

If not, activate it:
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### Issue: Node Modules Not Found

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors

Make sure the backend CORS middleware is configured to allow your frontend origin. In `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development Workflow

### Starting Development

```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Making Changes

1. **Backend changes**: FastAPI will auto-reload when you save files
2. **Frontend changes**: Vite will hot-reload in the browser
3. **Graph database changes**: Restart the backend to reload `graph_db.json`

### Testing Changes

1. Upload a test image through the frontend
2. Verify the API response in browser console
3. Check backend logs for any errors

## Production Deployment

### Backend Deployment

```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

```bash
cd frontend
npm run build

# Serve the dist/ folder with any static file server
# Example with serve:
npx serve -s dist
```

### Recommended Hosting Platforms

**Backend**:
- Railway
- Render
- Heroku
- AWS EC2/Elastic Beanstalk
- Google Cloud Run

**Frontend**:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Next Steps

1. [ ] Integrate actual CLIP model for real product detection
2. [ ] Add user authentication
3. [ ] Implement database persistence
4. [ ] Add unit and integration tests
5. [ ] Set up CI/CD pipeline
6. [ ] Add monitoring and logging
7. [ ] Optimize performance

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed information
- Include error messages, logs, and steps to reproduce

## License

MIT
