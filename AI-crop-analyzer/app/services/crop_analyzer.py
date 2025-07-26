import httpx
import base64
import json
import re
from typing import Dict, Any, Optional
from fastapi import HTTPException

class CropAnalyzer:
    def __init__(self, openrouter_api_key: str):
        self.api_key = openrouter_api_key
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
    async def analyze_crop_image(self, image_data: bytes, filename: str) -> Dict[str, Any]:
        """
        Analyze crop image for disease detection using OpenRouter AI
        Returns dict with disease_type, severity_level, affected_area_percentage, crop_type
        """
        
        if not self.api_key or self.api_key == "":
            raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
        
        try:
            # Convert image to base64
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Analyze with AI
            return await self._analyze_with_ai(base64_image, filename)
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing crop image: {str(e)}")
    
    async def _analyze_with_ai(self, base64_image: str, filename: str) -> Dict[str, Any]:
        """Use OpenRouter AI for crop disease analysis"""
        
        system_prompt = """You are an expert agricultural pathologist specializing in crop disease detection and analysis.

Your task is to analyze crop images and provide detailed disease assessment information in XML format.

Analyze the uploaded crop image and return your findings in this exact XML structure:

<analysis>
    <disease_type>disease_name_or_healthy</disease_type>
    <severity_level>1-10</severity_level>
    <affected_area_percentage>0-100</affected_area_percentage>
    <crop_type>crop_name</crop_type>
</analysis>

Guidelines:

1. **Disease Type**: Identify the specific disease (e.g., "Late Blight", "Powdery Mildew", "Rust", "Bacterial Spot", "Mosaic Virus") or "Healthy" if no disease is detected. Be specific with disease names.

2. **Severity Level**: Rate disease severity on a scale of 1-10:
   - 1-2: Very mild symptoms, minimal impact
   - 3-4: Mild symptoms, early stage
   - 5-6: Moderate symptoms, noticeable damage
   - 7-8: Severe symptoms, significant damage
   - 9-10: Very severe, critical damage
   - Use 1 if the plant appears healthy

3. **Affected Area Percentage**: Estimate what percentage of the visible plant area shows disease symptoms (0-100%). Use 0 if healthy.

4. **Crop Type**: Identify the crop species (e.g., "Tomato", "Wheat", "Corn", "Potato", "Rice", "Soybean", "Apple", etc.)

Focus on:
- Leaf spots, discoloration, wilting
- Fungal growth, mold, or unusual textures
- Deformed growth patterns
- Insect damage vs disease symptoms
- Overall plant health indicators

Return ONLY the XML structure, no additional text or explanations."""

        user_prompt = f"Please analyze this crop image for disease detection. Filename: {filename}"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Crop Disease Analyzer"
        }
        
        data = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {
                    "role": "user", 
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "temperature": 0.1,
            "max_tokens": 300
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(self.base_url, headers=headers, json=data)
                response.raise_for_status()
                
                result = response.json()
                ai_response = result["choices"][0]["message"]["content"].strip()
                
                # Parse XML response
                try:
                    parsed_result = self._parse_xml_response(ai_response)
                    return self._validate_and_format_result(parsed_result)
                except Exception as e:
                    print(f"AI returned unparseable response: {ai_response}")
                    print(f"Parse error: {e}")
                    # Return fallback response
                    return self._create_fallback_response()
                    
            except httpx.HTTPStatusError as e:
                print(f"OpenRouter API HTTP error: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=500, detail=f"OpenRouter API error: {e.response.status_code}")
            except Exception as e:
                print(f"OpenRouter API error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    def _parse_xml_response(self, xml_response: str) -> Dict[str, Any]:
        """Parse XML response into structured data"""
        
        # Extract each field using regex
        disease_type_match = re.search(r'<disease_type>(.*?)</disease_type>', xml_response, re.DOTALL)
        severity_match = re.search(r'<severity_level>(.*?)</severity_level>', xml_response, re.DOTALL)
        affected_area_match = re.search(r'<affected_area_percentage>(.*?)</affected_area_percentage>', xml_response, re.DOTALL)
        crop_type_match = re.search(r'<crop_type>(.*?)</crop_type>', xml_response, re.DOTALL)
        
        return {
            "disease_type": disease_type_match.group(1).strip() if disease_type_match else "Unknown",
            "severity_level": severity_match.group(1).strip() if severity_match else "1",
            "affected_area_percentage": affected_area_match.group(1).strip() if affected_area_match else "0",
            "crop_type": crop_type_match.group(1).strip() if crop_type_match else "Unknown"
        }
    
    def _validate_and_format_result(self, parsed_result: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and format the analysis result"""
        
        # Validate and convert severity level (1-10)
        try:
            severity = int(parsed_result.get("severity_level", 1))
            severity = max(1, min(10, severity))  # Clamp between 1-10
        except (ValueError, TypeError):
            severity = 1
        
        # Validate and convert affected area percentage (0-100)
        try:
            affected_area = float(parsed_result.get("affected_area_percentage", 0))
            affected_area = max(0, min(100, affected_area))  # Clamp between 0-100
        except (ValueError, TypeError):
            affected_area = 0
        
        # Clean up text fields
        disease_type = parsed_result.get("disease_type", "Unknown").strip()
        crop_type = parsed_result.get("crop_type", "Unknown").strip()
        
        # If severity is 1 and affected area is 0, likely healthy
        if severity <= 2 and affected_area == 0 and disease_type.lower() not in ["healthy", "none"]:
            disease_type = "Healthy"
        
        return {
            "disease_type": disease_type,
            "severity_level": severity,
            "affected_area_percentage": affected_area,
            "crop_type": crop_type
        }
    
    def _create_fallback_response(self) -> Dict[str, Any]:
        """Create a fallback response when AI analysis fails"""
        return {
            "disease_type": "Analysis Failed",
            "severity_level": 1,
            "affected_area_percentage": 0,
            "crop_type": "Unknown"
        } 