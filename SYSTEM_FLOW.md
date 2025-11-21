# ShelfSmart System Flow Diagram

## Complete Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                               │
│                                                                              │
│  1. User selects Shelf ID from dropdown                                      │
│     → shelf_A1 (Expected: coke_can, Neighbors: pepsi_can, sprite_bottle)   │
│                                                                              │
│  2. User uploads shelf image                                                 │
│     → Image preview displayed                                                │
│                                                                              │
│  3. User clicks "Analyze Shelf"                                              │
│     → POST /analyze with FormData {file, shelf_id}                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST Request
                                    │ (multipart/form-data)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                                     │
│                                                                              │
│  Step 1: Validate Inputs                                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ ✓ Check file is image                                                  │ │
│  │ ✓ Validate shelf_id exists in graph_db.json                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Step 2: Load Shelf Data                                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ graph_db.json → {                                                       │ │
│  │   "shelf_A1": {                                                         │ │
│  │     "expected_product": "coke_can",                                     │ │
│  │     "neighbors": ["pepsi_can", "sprite_bottle"],                       │ │
│  │     "zone_coordinates": [10, 20, 150, 200]                             │ │
│  │   }                                                                      │ │
│  │ }                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Step 3: Prepare Image                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Bytes → PIL.Image.open() → RGB conversion                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLIP MODEL (Zero-Shot Detection)                      │
│                                                                              │
│  Step 4: Create Text Prompts                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ text_prompts = [                                                        │ │
│  │   "a photo of coke can",              ← Expected product               │ │
│  │   "an empty retail shelf",            ← Out of stock detection         │ │
│  │   "a photo of pepsi can",             ← Neighbor 1                     │ │
│  │   "a photo of sprite bottle"          ← Neighbor 2                     │ │
│  │ ]                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Step 5: Run CLIP Inference                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ inputs = CLIPProcessor(text=prompts, images=image)                     │ │
│  │ outputs = CLIPModel(**inputs)                                           │ │
│  │ probs = outputs.logits_per_image.softmax(dim=1)                        │ │
│  │                                                                          │ │
│  │ Result: [0.555, 0.230, 0.1275, 0.0874]  ← Probabilities               │ │
│  │          └──┘   └───┘   └────┘  └────┘                                 │ │
│  │         coke   empty   pepsi   sprite                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DECISION LOGIC                                        │
│                                                                              │
│  Step 6: Determine Status                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ max_prob_idx = argmax(probs) = 0  ← Index 0 is highest                │ │
│  │                                                                          │ │
│  │ IF index == 1 (empty shelf):                                            │ │
│  │    status = "OUT_OF_STOCK"                                              │ │
│  │    severity = "HIGH"                                                     │ │
│  │                                                                          │ │
│  │ ELSE IF index == 0 (expected):                                          │ │
│  │    status = "COMPLIANT"            ← THIS PATH TAKEN                   │ │
│  │    severity = "NONE"                                                     │ │
│  │                                                                          │ │
│  │ ELSE (neighbor):                                                         │ │
│  │    status = "MISPLACED"                                                 │ │
│  │    severity = check_graph_severity()                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GRAPH LOGIC (graph_utils.py)                          │
│                                                                              │
│  Step 7: Calculate Severity (if MISPLACED)                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ def check_graph_severity(detected, expected, shelf_data):              │ │
│  │     if detected in shelf_data["neighbors"]:                             │ │
│  │         return "LOW"   # Customer moved it slightly                     │ │
│  │     else:                                                                │ │
│  │         return "HIGH"  # Complete anomaly                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Example Scenarios:                                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Detected: pepsi_can (in neighbors) → severity = "LOW"                  │ │
│  │ Detected: milk_carton (not neighbor) → severity = "HIGH"               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API RESPONSE                                          │
│                                                                              │
│  {                                                                           │
│    "status": "COMPLIANT",                                                    │
│    "shelf_id": "shelf_A1",                                                   │
│    "expected_product": "coke_can",                                           │
│    "expected_product_display": "Coke Can",                                   │
│    "detected_item": "coke_can",                                              │
│    "detected_item_display": "Coke Can",                                      │
│    "confidence": 55.5,                                                       │
│    "severity": "NONE",                                                       │
│    "issue_description": "Product is correctly placed",                       │
│    "image_info": {                                                           │
│      "width": 800,                                                           │
│      "height": 600,                                                          │
│      "format": "JPEG"                                                        │
│    },                                                                        │
│    "zone_coordinates": [10, 20, 150, 200],                                  │
│    "clip_analysis": {                                                        │
│      "all_prompts": [                                                        │
│        "a photo of coke can",                                                │
│        "an empty retail shelf",                                              │
│        "a photo of pepsi can",                                               │
│        "a photo of sprite bottle"                                            │
│      ],                                                                      │
│      "all_probabilities": [55.50, 23.00, 12.75, 8.74]                       │
│    }                                                                         │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JSON Response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND RENDERING                                    │
│                                                                              │
│  Status Badge: ✓ COMPLIANT 🟢                                               │
│                                                                              │
│  Confidence: 55.5% ███████████░░░░░                                         │
│                                                                              │
│  Product Detection:                                                          │
│    Expected: Coke Can                                                        │
│    Detected: Coke Can                                                        │
│    Shelf ID: shelf_A1                                                        │
│                                                                              │
│  CLIP Analysis:                                                              │
│    1. "a photo of coke can"      55.50%                                     │
│    2. "an empty retail shelf"    23.00%                                     │
│    3. "a photo of pepsi can"     12.75%                                     │
│    4. "a photo of sprite bottle"  8.74%                                     │
└─────────────────────────────────────────────────────────────────────────────┘

## Three Possible Outcomes

### Outcome 1: COMPLIANT (Product Correct)
```
Expected: coke_can
Detected: coke_can (highest probability)
Status: COMPLIANT 🟢
Severity: NONE
```

### Outcome 2: MISPLACED (Wrong Product)
```
Expected: coke_can
Detected: pepsi_can (neighbor with highest probability)
Status: MISPLACED 🟡
Severity: LOW (pepsi is in neighbors list)
```

### Outcome 3: OUT OF STOCK (Empty Shelf)
```
Expected: coke_can
Detected: empty_shelf (highest probability)
Status: OUT_OF_STOCK 🔴
Severity: HIGH
```

## Key Technologies

- **CLIP**: Zero-Shot visual recognition via contrastive learning
- **NetworkX**: Graph database for product relationships
- **FastAPI**: Modern async Python web framework
- **React**: Component-based UI framework
- **Tailwind**: Utility-first CSS framework
