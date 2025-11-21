"""
Graph utilities for ShelfSmart
Provides helper functions for graph-based misplacement analysis
"""

from typing import Dict, List, Optional


def check_graph_severity(detected_item: str, expected_item: str, shelf_data: Dict) -> str:
    """
    Check severity of misplacement based on graph relationships.
    
    Args:
        detected_item: The product detected by CLIP
        expected_item: The product expected at this shelf location
        shelf_data: The shelf data containing neighbors list
    
    Returns:
        "LOW" if detected item is a neighbor (customer likely moved it)
        "HIGH" if detected item is not a neighbor (complete anomaly)
    """
    # If the detected item matches expected, no issue
    if detected_item == expected_item:
        return "NONE"
    
    # Get neighbors list from shelf data
    neighbors = shelf_data.get("neighbors", [])
    
    # Check if detected item is in the neighbors list
    if detected_item in neighbors:
        return "LOW"  # Customer likely moved it slightly
    else:
        return "HIGH"  # Complete anomaly


def get_all_product_names(graph_db: Dict) -> List[str]:
    """
    Extract all unique product names from the graph database.
    
    Args:
        graph_db: The complete graph database dictionary
    
    Returns:
        List of all unique product names (expected + neighbors)
    """
    products = set()
    
    for shelf_id, shelf_data in graph_db.items():
        # Add expected product
        expected = shelf_data.get("expected_product")
        if expected:
            products.add(expected)
        
        # Add all neighbors
        neighbors = shelf_data.get("neighbors", [])
        products.update(neighbors)
    
    return sorted(list(products))


def get_shelf_info(shelf_id: str, graph_db: Dict) -> Optional[Dict]:
    """
    Get shelf information from the graph database.
    
    Args:
        shelf_id: The shelf identifier (e.g., "shelf_A1")
        graph_db: The complete graph database dictionary
    
    Returns:
        Shelf data dictionary or None if not found
    """
    return graph_db.get(shelf_id)


def format_product_name(product_name: str) -> str:
    """
    Format product name for display (convert underscore to spaces and title case).
    
    Args:
        product_name: Product name with underscores (e.g., "coke_can")
    
    Returns:
        Formatted product name (e.g., "Coke Can")
    """
    return product_name.replace("_", " ").title()
