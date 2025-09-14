from typing import List
from ..models import MetricsDaily, Item

def make_dollar_table(rows: List[MetricsDaily]) -> str:
    """Generate a dollar loss table for the LLM."""
    if not rows:
        return "No financial data available"
    
    table_lines = ["Financial Impact Summary:", "=" * 50]
    total_loss = 0
    
    for row in rows:
        total_loss += row.dollar_loss
        table_lines.append(f"{row.date} - Store {row.store_id} - Item {row.item_id}: ${row.dollar_loss:.2f}")
    
    table_lines.append(f"\nTotal dollar loss: ${total_loss:.2f}")
    return "\n".join(table_lines)

def calculate_retail_value(item_category: str, kg: float) -> float:
    """Calculate retail value per kg for different food categories."""
    values = {
        "meat": 12.0,      # $/kg
        "dairy": 6.0,      # $/kg
        "produce": 4.0,    # $/kg
        "grains": 3.0,     # $/kg
        "bread": 2.5,      # $/kg
        "prepared": 8.0,   # $/kg
    }
    base_value = values.get(item_category.lower(), 4.0)  # Default value
    return base_value * kg
