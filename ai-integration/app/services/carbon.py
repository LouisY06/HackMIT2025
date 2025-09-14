from typing import List
from ..models import MetricsDaily, Item

def make_co2e_table(rows: List[MetricsDaily]) -> str:
    """Generate a CO2e impact table for the LLM."""
    if not rows:
        return "No CO2e data available"
    
    table_lines = ["CO2e Impact Summary:", "=" * 50]
    total_co2e = 0
    
    for row in rows:
        total_co2e += row.co2e_kg
        table_lines.append(f"{row.date} - Store {row.store_id} - Item {row.item_id}: {row.co2e_kg:.2f} kg CO2e")
    
    table_lines.append(f"\nTotal CO2e prevented: {total_co2e:.2f} kg")
    return "\n".join(table_lines)

def calculate_co2e_factor(item_category: str) -> float:
    """Calculate CO2e factor per kg for different food categories."""
    factors = {
        "meat": 27.0,      # High impact
        "dairy": 3.2,      # Medium-high
        "produce": 2.0,    # Medium
        "grains": 1.4,     # Low-medium
        "bread": 1.0,      # Low
        "prepared": 3.5,   # Medium-high
    }
    return factors.get(item_category.lower(), 2.0)  # Default factor
