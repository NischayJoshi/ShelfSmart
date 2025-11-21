"""
ShelfSmart Backend - FastAPI Application
Retail shelf monitoring using CLIP for detection and Graph logic for misplacements.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import json
import os
from typing import Dict, List, Any
import networkx as nx

app = FastAPI(
    title="ShelfSmart API",
    description="Retail shelf monitoring using CLIP for detection and Graph logic for misplacements",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the graph database
GRAPH_DB_PATH = os.path.join(os.path.dirname(__file__), "graph_db.json")

# Global variable to store the product graph
product_graph = nx.Graph()


def load_graph_db():
    """Load product metadata from graph_db.json"""
    global product_graph
    try:
        if os.path.exists(GRAPH_DB_PATH):
            with open(GRAPH_DB_PATH, 'r') as f:
                data = json.load(f)
                # Build graph from data
                if "products" in data:
                    for product in data["products"]:
                        product_graph.add_node(
                            product["id"],
                            name=product["name"],
                            category=product.get("category", ""),
                            expected_location=product.get("expected_location", "")
                        )
                if "relationships" in data:
                    for rel in data["relationships"]:
                        product_graph.add_edge(
                            rel["from"],
                            rel["to"],
                            relationship=rel.get("type", "related")
                        )
            print(f"Loaded {product_graph.number_of_nodes()} products and {product_graph.number_of_edges()} relationships")
    except Exception as e:
        print(f"Error loading graph database: {e}")


@app.on_event("startup")
async def startup_event():
    """Load graph database on startup"""
    load_graph_db()


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "ShelfSmart API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/products")
async def get_products():
    """Get all products from the graph database"""
    try:
        products = []
        for node_id in product_graph.nodes():
            node_data = product_graph.nodes[node_id]
            products.append({
                "id": node_id,
                "name": node_data.get("name", ""),
                "category": node_data.get("category", ""),
                "expected_location": node_data.get("expected_location", "")
            })
        return {"products": products, "count": len(products)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
async def analyze_shelf(file: UploadFile = File(...)):
    """
    Analyze shelf image for product detection and misplacements.
    
    This endpoint will:
    1. Accept an image upload
    2. Use CLIP model for product detection
    3. Apply graph logic to identify misplacements
    4. Return analysis results
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Get image dimensions
        width, height = image.size
        
        # Placeholder for CLIP model integration
        # TODO: Integrate HuggingFace CLIP model for actual detection
        # from transformers import CLIPProcessor, CLIPModel
        # model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        # processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # Mock detected products (replace with actual CLIP detection)
        detected_products = [
            {
                "id": "prod_001",
                "name": "Example Product 1",
                "confidence": 0.92,
                "location": {"x": 100, "y": 150, "width": 80, "height": 120}
            },
            {
                "id": "prod_002",
                "name": "Example Product 2",
                "confidence": 0.87,
                "location": {"x": 250, "y": 160, "width": 85, "height": 115}
            }
        ]
        
        # Analyze misplacements using graph logic
        misplacements = []
        for product in detected_products:
            product_id = product["id"]
            if product_id in product_graph.nodes():
                node_data = product_graph.nodes[product_id]
                expected_location = node_data.get("expected_location", "")
                
                # Check if product is in expected location (simplified logic)
                # TODO: Implement more sophisticated location matching
                if expected_location and expected_location != "shelf_center":
                    misplacements.append({
                        "product_id": product_id,
                        "product_name": product["name"],
                        "issue": "Potential misplacement",
                        "expected": expected_location,
                        "severity": "medium"
                    })
        
        # Prepare response
        result = {
            "status": "success",
            "image_info": {
                "width": width,
                "height": height,
                "format": image.format
            },
            "detected_products": detected_products,
            "misplacements": misplacements,
            "summary": {
                "total_products": len(detected_products),
                "total_misplacements": len(misplacements)
            }
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "graph_loaded": product_graph.number_of_nodes() > 0,
        "products_count": product_graph.number_of_nodes()
    }
