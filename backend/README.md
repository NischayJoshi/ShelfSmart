# ShelfSmart Backend

FastAPI-based backend for retail shelf monitoring using CLIP for product detection and NetworkX for graph-based misplacement detection.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Product Graph Database**: NetworkX-based graph for storing product relationships
- **Image Processing**: Pillow for image handling
- **CLIP Integration Ready**: Placeholder for HuggingFace CLIP model integration
- **CORS Enabled**: Cross-Origin Resource Sharing configured for frontend integration

## API Endpoints

### Health & Info
- `GET /` - API health check
- `GET /health` - Detailed health status with graph information
- `GET /products` - List all products in the graph database

### Analysis
- `POST /analyze` - Analyze shelf image for product detection and misplacements
  - Accepts: multipart/form-data with image file
  - Returns: Detected products, misplacements, and summary statistics

## Graph Database

The `graph_db.json` file contains:

```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Product Name",
      "category": "Category",
      "expected_location": "shelf_location"
    }
  ],
  "relationships": [
    {
      "from": "prod_001",
      "to": "prod_002",
      "type": "similar_category"
    }
  ]
}
```

### Product Properties
- `id`: Unique product identifier
- `name`: Product name
- `category`: Product category (Beverages, Snacks, Dairy, etc.)
- `expected_location`: Expected shelf location

### Relationship Types
- `similar_category`: Products in the same category
- `often_bought_together`: Products frequently purchased together

## Installation

```bash
# Install dependencies
pip install -r ../requirements.txt

# Run server
uvicorn main:app --reload
```

## Development

The server runs on `http://localhost:8000` by default.

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CLIP Integration

Currently, the `/analyze` endpoint returns mock data. To integrate the actual CLIP model:

```python
from transformers import CLIPProcessor, CLIPModel

# Load model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Process image and text
inputs = processor(text=product_names, images=image, return_tensors="pt", padding=True)
outputs = model(**inputs)
```

## Future Enhancements

- [ ] Integrate actual CLIP model for product detection
- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Implement authentication and authorization
- [ ] Add logging and monitoring
- [ ] Implement caching for model predictions
- [ ] Add batch processing for multiple images
