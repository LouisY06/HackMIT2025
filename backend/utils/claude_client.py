import anthropic
import base64
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class ClaudeClient:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        self.client = anthropic.Anthropic(api_key=self.api_key)
    
    def analyze_waste_image(self, image_base64: str) -> Dict[str, Any]:
        """
        Analyze waste image and return categorization and description
        """
        try:
            # Remove data URL prefix if present
            if image_base64.startswith('data:image'):
                image_base64 = image_base64.split(',')[1]
            
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": image_base64
                                }
                            },
                            {
                                "type": "text",
                                "text": """Analyze this waste image and provide:
1. Waste type category (food, recyclable, compost, electronic, hazardous, other)
2. Brief description of the items
3. Estimated weight in kg (if possible to estimate)
4. Handling instructions for volunteers
5. Environmental impact notes

Respond in JSON format:
{
    "waste_type": "category",
    "description": "brief description",
    "estimated_weight_kg": number,
    "handling_instructions": "instructions for volunteers",
    "environmental_impact": "impact notes"
}"""
                            }
                        ]
                    }
                ]
            )
            
            # Parse response
            content = response.content[0].text
            return self._parse_claude_response(content)
            
        except Exception as e:
            print(f"Claude API error: {e}")
            return self._get_fallback_response()
    
    def _parse_claude_response(self, content: str) -> Dict[str, Any]:
        """Parse Claude's response and extract JSON"""
        try:
            # Try to find JSON in the response
            import json
            import re
            
            # Look for JSON block
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # Fallback parsing
                return self._parse_text_response(content)
        except:
            return self._get_fallback_response()
    
    def _parse_text_response(self, content: str) -> Dict[str, Any]:
        """Parse text response when JSON parsing fails"""
        lines = content.split('\n')
        result = {
            "waste_type": "other",
            "description": content[:200],
            "estimated_weight_kg": 1.0,
            "handling_instructions": "Handle with care",
            "environmental_impact": "Standard waste processing"
        }
        
        for line in lines:
            line = line.strip().lower()
            if 'food' in line:
                result["waste_type"] = "food"
            elif 'recyclable' in line or 'plastic' in line or 'metal' in line:
                result["waste_type"] = "recyclable"
            elif 'compost' in line or 'organic' in line:
                result["waste_type"] = "compost"
            elif 'electronic' in line or 'battery' in line:
                result["waste_type"] = "electronic"
            elif 'hazardous' in line or 'chemical' in line:
                result["waste_type"] = "hazardous"
        
        return result
    
    def _get_fallback_response(self) -> Dict[str, Any]:
        """Fallback response when Claude API fails"""
        return {
            "waste_type": "other",
            "description": "Waste items requiring manual categorization",
            "estimated_weight_kg": 1.0,
            "handling_instructions": "Handle with care and follow standard safety procedures",
            "environmental_impact": "Standard waste processing - manual categorization required"
        }

# Global client instance
claude_client = None

def get_claude_client() -> ClaudeClient:
    """Get or create Claude client instance"""
    global claude_client
    if claude_client is None:
        claude_client = ClaudeClient()
    return claude_client
