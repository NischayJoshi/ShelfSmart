# ShelfSmart Dashboard UI Mockup

## Frontend Interface Design

### Header Section
```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║             🛒 ShelfSmart - CLIP Detection Dashboard                       ║
║                                                                            ║
║      Zero-Shot product detection using CLIP + Graph-based misplacement    ║
║                                                                            ║
║         CLIP provides fine-grained recognition without custom training    ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Simulator Section
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  📷 Shelf Simulator                                                        │
│                                                                            │
│  Select Shelf ID                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ shelf_A1 - Expected: coke_can                                      ▼│ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐│
│  │ ℹ️  Expected: coke_can                                                 ││
│  │    Neighbors: pepsi_can, sprite_bottle                                ││
│  └───────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  Upload Shelf Image                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  📁 Choose File     sample-shelf.jpg                    [Reset]      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│                     [ Analyze Shelf ]                                      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Results Panel - COMPLIANT Status
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  📊 Analysis Results                                                       │
│                                                                            │
│  ┌─────────────────────────┬─────────────────────────────────────────────┐│
│  │  Analyzed Image         │  Details                                    ││
│  │                         │                                             ││
│  │  ┌─────────────────┐    │  Status                                     ││
│  │  │                 │    │  ┌──────────────────────┐                   ││
│  │  │  [SHELF IMAGE]  │    │  │  ✓ COMPLIANT         │  🟢               ││
│  │  │                 │    │  └──────────────────────┘                   ││
│  │  └─────────────────┘    │                                             ││
│  │                         │  Product is correctly placed                ││
│  │  Status                 │                                             ││
│  │  ┌──────────────────┐   │  ┌────────────────────────────────────┐    ││
│  │  │  ✓ COMPLIANT  🟢 │   │  │ Confidence Score                   │    ││
│  │  └──────────────────┘   │  │                                    │    ││
│  │                         │  │       87.5%                        │    ││
│  │                         │  │  ████████████████░░░░░░            │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ Product Detection                  │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ Expected:  Coke Can                │    ││
│  │                         │  │ Detected:  Coke Can                │    ││
│  │                         │  │ Shelf ID:  shelf_A1                │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ CLIP Analysis Details              │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ "a photo of coke can"      87.5%   │    ││
│  │                         │  │ "an empty retail shelf"     2.1%   │    ││
│  │                         │  │ "a photo of pepsi can"      6.8%   │    ││
│  │                         │  │ "a photo of sprite bottle"  3.6%   │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  └─────────────────────────┴─────────────────────────────────────────────┘│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Results Panel - MISPLACED Status
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  📊 Analysis Results                                                       │
│                                                                            │
│  ┌─────────────────────────┬─────────────────────────────────────────────┐│
│  │  Analyzed Image         │  Details                                    ││
│  │                         │                                             ││
│  │  ┌─────────────────┐    │  Status                                     ││
│  │  │                 │    │  ┌──────────────────────┐                   ││
│  │  │  [SHELF IMAGE]  │    │  │  ⚠ MISPLACED         │  🟡               ││
│  │  │                 │    │  └──────────────────────┘                   ││
│  │  └─────────────────┘    │                                             ││
│  │                         │  Found Pepsi Can instead of Coke Can        ││
│  │  Status                 │                                             ││
│  │  ┌──────────────────┐   │  ┌────────────────────────────────────┐    ││
│  │  │  ⚠ MISPLACED  🟡 │   │  │ Confidence Score                   │    ││
│  │  └──────────────────┘   │  │                                    │    ││
│  │                         │  │       78.3%                        │    ││
│  │                         │  │  ███████████████░░░░░░░            │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ Product Detection                  │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ Expected:  Coke Can                │    ││
│  │                         │  │ Detected:  Pepsi Can               │    ││
│  │                         │  │ Shelf ID:  shelf_A1                │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ Graph Severity                     │    ││
│  │                         │  │                                    │    ││
│  │                         │  │  [ LOW ]                           │    ││
│  │                         │  │                                    │    ││
│  │                         │  │  Item is a neighbor - likely       │    ││
│  │                         │  │  customer moved it slightly        │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ CLIP Analysis Details              │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ "a photo of coke can"      12.5%   │    ││
│  │                         │  │ "an empty retail shelf"     4.2%   │    ││
│  │                         │  │ "a photo of pepsi can"     78.3%   │    ││
│  │                         │  │ "a photo of sprite bottle"  5.0%   │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  └─────────────────────────┴─────────────────────────────────────────────┘│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Results Panel - OUT_OF_STOCK Status
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  📊 Analysis Results                                                       │
│                                                                            │
│  ┌─────────────────────────┬─────────────────────────────────────────────┐│
│  │  Analyzed Image         │  Details                                    ││
│  │                         │                                             ││
│  │  ┌─────────────────┐    │  Status                                     ││
│  │  │                 │    │  ┌──────────────────────┐                   ││
│  │  │  [EMPTY SHELF]  │    │  │  ✗ OUT_OF_STOCK      │  🔴               ││
│  │  │                 │    │  └──────────────────────┘                   ││
│  │  └─────────────────┘    │                                             ││
│  │                         │  Shelf is empty - product out of stock      ││
│  │  Status                 │                                             ││
│  │  ┌──────────────────┐   │  ┌────────────────────────────────────┐    ││
│  │  │ ✗ OUT_OF_STOCK🔴 │   │  │ Confidence Score                   │    ││
│  │  └──────────────────┘   │  │                                    │    ││
│  │                         │  │       91.2%                        │    ││
│  │                         │  │  ██████████████████░░░░            │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ Product Detection                  │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ Expected:  Coke Can                │    ││
│  │                         │  │ Detected:  Empty Shelf             │    ││
│  │                         │  │ Shelf ID:  shelf_A1                │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ Graph Severity                     │    ││
│  │                         │  │                                    │    ││
│  │                         │  │  [ HIGH ]                          │    ││
│  │                         │  │                                    │    ││
│  │                         │  │  Stock needs immediate attention   │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  │                         │                                             ││
│  │                         │  ┌────────────────────────────────────┐    ││
│  │                         │  │ CLIP Analysis Details              │    ││
│  │                         │  │                                    │    ││
│  │                         │  │ "a photo of coke can"       3.1%   │    ││
│  │                         │  │ "an empty retail shelf"    91.2%   │    ││
│  │                         │  │ "a photo of pepsi can"      2.8%   │    ││
│  │                         │  │ "a photo of sprite bottle"  2.9%   │    ││
│  │                         │  └────────────────────────────────────┘    ││
│  └─────────────────────────┴─────────────────────────────────────────────┘│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Color Scheme

- **Background**: Gradient from blue-50 to indigo-100
- **Cards**: White with shadow
- **Status Badges**:
  - COMPLIANT: Green (#10B981)
  - MISPLACED: Yellow (#F59E0B)
  - OUT_OF_STOCK: Red (#EF4444)
- **Severity Badges**:
  - LOW: Yellow background with yellow-800 text
  - HIGH: Red background with red-800 text
  - NONE: Green background with green-800 text

## Interactive Elements

1. **Shelf Dropdown**: Shows all 6 shelves with expected products
2. **File Upload**: Click to browse, shows filename when selected
3. **Reset Button**: Clears current selection and results
4. **Analyze Button**: Triggers CLIP analysis (shows "Analyzing with CLIP..." while processing)

## Responsive Design

- Mobile: Single column layout
- Tablet: Grid with 2 columns for summary cards
- Desktop: Full 2-column layout for results (image + details side by side)
