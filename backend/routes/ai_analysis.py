from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import base64
from models import get_db, Package
from utils.dependencies import require_store
from utils.claude_client import get_claude_client

router = APIRouter(prefix="/ai", tags=["ai-analysis"])

class ImageAnalysisResponse(BaseModel):
    waste_type: str
    description: str
    estimated_weight_kg: float
    handling_instructions: str
    environmental_impact: str

class PackageAnalysisRequest(BaseModel):
    package_id: int
    analysis_data: ImageAnalysisResponse

@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_waste_image(
    file: UploadFile = File(...),
    current_user = Depends(require_store)
):
    """Analyze waste image using Claude AI"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    try:
        # Read and encode image
        image_data = await file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Analyze with Claude
        claude = get_claude_client()
        analysis = claude.analyze_waste_image(image_base64)
        
        return ImageAnalysisResponse(**analysis)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image analysis failed: {str(e)}"
        )

@router.post("/update-package-analysis")
async def update_package_with_analysis(
    request: PackageAnalysisRequest,
    current_user = Depends(require_store),
    db: Session = Depends(get_db)
):
    """Update package with AI analysis results"""
    # Get package
    package = db.query(Package).filter(Package.id == request.package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    
    # Update package with analysis
    analysis = request.analysis_data
    package.waste_type = analysis.waste_type
    package.description = analysis.description
    package.weight_estimate = analysis.estimated_weight_kg
    package.label = f"{analysis.waste_type.title()} - {analysis.description[:50]}"
    
    db.commit()
    
    return {
        "message": "Package updated with AI analysis",
        "package_id": package.id,
        "waste_type": package.waste_type,
        "description": package.description
    }

@router.get("/fallback-categories")
async def get_fallback_categories():
    """Get fallback waste categories when AI is unavailable"""
    return {
        "categories": [
            {
                "id": "food",
                "name": "Food Waste",
                "description": "Organic food items, leftovers, expired food"
            },
            {
                "id": "recyclable",
                "name": "Recyclable Materials",
                "description": "Plastic, metal, paper, glass that can be recycled"
            },
            {
                "id": "compost",
                "name": "Compostable",
                "description": "Organic materials suitable for composting"
            },
            {
                "id": "electronic",
                "name": "Electronic Waste",
                "description": "Electronics, batteries, electronic components"
            },
            {
                "id": "hazardous",
                "name": "Hazardous Materials",
                "description": "Chemicals, toxic substances, medical waste"
            },
            {
                "id": "other",
                "name": "Other",
                "description": "Items that don't fit other categories"
            }
        ]
    }
