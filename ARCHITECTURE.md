# ShelfSmart Architecture

## System Overview

ShelfSmart is a retail shelf monitoring system that uses AI-based product detection (CLIP) and graph-based logic to identify product misplacements.

## Technology Stack

### Backend
- **FastAPI 0.121+** - Modern Python web framework
- **Python 3.8+** - Core language
- **Uvicorn** - ASGI server
- **NetworkX** - Graph database for product relationships
- **Pillow** - Image processing
- **Transformers** - HuggingFace library (for CLIP integration)
- **PyTorch** - Deep learning framework

### Frontend
- **React 18** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **JavaScript (ES6+)** - Core language

## Architecture Patterns

### Monorepo Structure
```
ShelfSmart/
├── backend/          # Python FastAPI backend
├── frontend/         # React + Vite frontend
├── requirements.txt  # Shared Python dependencies
└── package.json      # Workspace configuration
```

### Backend Architecture

#### Application Lifecycle
- Uses modern FastAPI **lifespan context manager** for startup/shutdown
- Loads graph database on startup
- Graceful shutdown with cleanup hooks

#### Data Flow
1. Client uploads image via `/analyze` endpoint
2. Image is validated and processed with Pillow
3. CLIP model (to be integrated) detects products
4. Graph database queries product relationships
5. Misplacement detection logic runs
6. Results returned as JSON

#### Graph Database Structure
- **Nodes**: Products with metadata (id, name, category, expected_location)
- **Edges**: Relationships between products (similar_category, often_bought_together)
- Loaded from `graph_db.json` into NetworkX graph

### Frontend Architecture

#### Component Structure
- **App.jsx** - Main application component
  - Image upload handler
  - API integration
  - Results display
  - Error handling

#### State Management
- React hooks (useState) for local state
- No external state management needed (simple app)

#### Styling
- Tailwind CSS v4 with PostCSS
- Responsive design
- Gradient backgrounds
- Card-based layouts

## API Endpoints

### Public Endpoints

#### `GET /`
Health check endpoint
```json
{
  "message": "ShelfSmart API",
  "status": "running",
  "version": "1.0.0"
}
```

#### `GET /health`
Detailed health status
```json
{
  "status": "healthy",
  "graph_loaded": true,
  "products_count": 6
}
```

#### `GET /products`
List all products
```json
{
  "products": [...],
  "count": 6
}
```

#### `POST /analyze`
Analyze shelf image

**Request**: multipart/form-data with image file

**Response**:
```json
{
  "status": "success",
  "image_info": {
    "width": 800,
    "height": 600,
    "format": "JPEG"
  },
  "detected_products": [...],
  "misplacements": [...],
  "summary": {
    "total_products": 2,
    "total_misplacements": 1
  }
}
```

## Security Considerations

### Current Implementation
- CORS enabled for all origins (development only)
- No authentication/authorization
- No rate limiting
- No input validation beyond file type

### Production Requirements
- [ ] Implement JWT-based authentication
- [ ] Add rate limiting
- [ ] Configure CORS for specific origins
- [ ] Add input validation and sanitization
- [ ] Implement API key management
- [ ] Add request logging and monitoring
- [ ] Enable HTTPS only

## Scalability Considerations

### Current Limitations
- Single server instance
- In-memory graph database
- Synchronous image processing
- No caching

### Future Improvements
- [ ] Add Redis for caching
- [ ] Implement async task queue (Celery)
- [ ] Use PostgreSQL for persistent storage
- [ ] Add load balancer
- [ ] Implement CDN for frontend
- [ ] Add monitoring and metrics (Prometheus)
- [ ] Implement horizontal scaling

## CLIP Model Integration

### Current State
- Mock data returned from `/analyze` endpoint
- Placeholder for HuggingFace CLIP integration

### Implementation Plan
```python
from transformers import CLIPProcessor, CLIPModel

# Load model (startup)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Process image (in /analyze endpoint)
inputs = processor(
    text=product_names,
    images=image,
    return_tensors="pt",
    padding=True
)
outputs = model(**inputs)
logits_per_image = outputs.logits_per_image
probs = logits_per_image.softmax(dim=1)
```

## Graph Logic

### Product Relationships
- **similar_category**: Products in the same category should be near each other
- **often_bought_together**: Products frequently purchased together

### Misplacement Detection
1. Detect product in image using CLIP
2. Get expected location from graph node
3. Compare detected location with expected location
4. Calculate distance/deviation
5. Flag as misplacement if deviation exceeds threshold

## Development Workflow

### Local Development
1. Start backend: `cd backend && uvicorn main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Access at http://localhost:5173

### Testing
- Backend: Manual API testing with curl or Swagger UI
- Frontend: Manual testing in browser
- Integration: Upload test images and verify results

### Code Quality
- Code review using automated tools
- Security scanning with CodeQL
- No linting configured yet (future improvement)

## Deployment Strategy

### Backend Deployment
- Container: Docker with Python 3.11
- Server: Uvicorn with 4 workers
- Platform: Railway, Render, or AWS

### Frontend Deployment
- Build: `npm run build`
- Static files: Serve from Vercel, Netlify, or S3
- CDN: CloudFront or Vercel Edge Network

### Environment Variables
```bash
# Backend
API_HOST=0.0.0.0
API_PORT=8000
CLIP_MODEL=openai/clip-vit-base-patch32
DATABASE_URL=postgresql://...

# Frontend
VITE_API_URL=https://api.shelfsmart.com
```

## Monitoring and Observability

### Future Requirements
- [ ] Application Performance Monitoring (APM)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (ELK stack)
- [ ] Metrics collection (Prometheus + Grafana)
- [ ] Uptime monitoring
- [ ] User analytics

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and update graph database
- Monitor API performance
- Review error logs
- Update documentation

### Backup Strategy
- Graph database: Daily JSON exports
- User data: (when implemented) Daily database backups
- Configuration: Version controlled in Git

## Future Enhancements

### Short Term
- [ ] Integrate actual CLIP model
- [ ] Add user authentication
- [ ] Implement database persistence
- [ ] Add comprehensive tests

### Medium Term
- [ ] Real-time monitoring with WebSockets
- [ ] Batch image processing
- [ ] Mobile app
- [ ] API rate limiting

### Long Term
- [ ] Custom trained detection model
- [ ] Multi-store support
- [ ] Analytics dashboard
- [ ] Automated alerting system
- [ ] Integration with inventory systems
