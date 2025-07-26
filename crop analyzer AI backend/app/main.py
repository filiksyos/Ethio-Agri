import os
import time
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

from app.services.crop_analyzer import CropAnalyzer

load_dotenv()

app = FastAPI(title="AI Crop Disease Analyzer")

# Get allowed origins from environment or use defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else [
    "http://localhost:3000",      # Next.js default port
    "http://localhost:5173",      # Vite default port
    "http://localhost:4173",      # Vite preview port
    "http://localhost:8080",      # Custom frontend port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:8080",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 10))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

class AnalysisResponse(BaseModel):
    disease_type: str
    severity_level: int
    affected_area_percentage: float
    crop_type: str
    filename: str
    response_time_ms: int

@app.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>🌾 AI Crop Disease Analyzer</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .upload-area {
                border: 2px dashed #28a745;
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                background-color: #f8fff8;
                transition: background-color 0.3s;
            }
            .upload-area:hover {
                background-color: #e8f5e8;
            }
            .upload-area.dragover {
                background-color: #d4edda;
                border-color: #155724;
            }
            input[type="file"] {
                margin: 10px 0;
            }
            button {
                background-color: #28a745;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 5px;
            }
            button:hover {
                background-color: #218838;
            }
            button:disabled {
                background-color: #6c757d;
                cursor: not-allowed;
            }
            .result {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            .result-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
            }
            .result-item {
                background: white;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #28a745;
            }
            .result-label {
                font-weight: bold;
                color: #495057;
                font-size: 14px;
                margin-bottom: 5px;
            }
            .result-value {
                font-size: 18px;
                color: #212529;
            }
            .severity-bar {
                width: 100%;
                height: 20px;
                background-color: #e9ecef;
                border-radius: 10px;
                overflow: hidden;
                margin-top: 5px;
            }
            .severity-fill {
                height: 100%;
                border-radius: 10px;
                transition: width 0.3s ease;
            }
            .loading {
                text-align: center;
                color: #6c757d;
            }
            .error {
                color: #dc3545;
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .image-preview {
                max-width: 300px;
                max-height: 300px;
                border-radius: 8px;
                margin: 10px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌾 AI Crop Disease Analyzer</h1>
            <p>Upload a crop image to analyze for diseases, severity, and crop type identification.</p>
            
            <div class="upload-area" id="uploadArea">
                <div>
                    <h3>📸 Upload Crop Image</h3>
                    <p>Drag and drop an image here or click to select</p>
                    <input type="file" id="imageFile" accept="image/*" style="display: none;">
                    <button onclick="document.getElementById('imageFile').click()">
                        📁 Choose Image
                    </button>
                </div>
                <div id="preview"></div>
            </div>
            
            <button id="analyzeBtn" onclick="analyzeCrop()" disabled>
                🔬 Analyze Crop
            </button>
            
            <div id="result"></div>
        </div>

        <script>
            const uploadArea = document.getElementById('uploadArea');
            const imageFile = document.getElementById('imageFile');
            const analyzeBtn = document.getElementById('analyzeBtn');
            const resultDiv = document.getElementById('result');
            const previewDiv = document.getElementById('preview');
            
            let selectedFile = null;
            
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileSelect(files[0]);
                }
            });
            
            imageFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                }
            });
            
            function handleFileSelect(file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                
                if (file.size > MAX_FILE_SIZE_PLACEHOLDER * 1024 * 1024) {
                    alert('File size must be less than MAX_FILE_SIZE_PLACEHOLDERMB');
                    return;
                }
                
                selectedFile = file;
                analyzeBtn.disabled = false;
                
                // Show image preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewDiv.innerHTML = '<img src="' + e.target.result + '" alt="Preview" class="image-preview">';
                };
                reader.readAsDataURL(file);
            }
            
            async function analyzeCrop() {
                if (!selectedFile) {
                    alert('Please select an image first');
                    return;
                }
                
                analyzeBtn.disabled = true;
                analyzeBtn.textContent = '🔄 Analyzing...';
                resultDiv.innerHTML = '<div class="loading">🔬 Analyzing crop image for diseases...</div>';
                
                const formData = new FormData();
                formData.append('file', selectedFile);
                
                try {
                    const response = await fetch('/api/analyze', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Analysis failed');
                    }
                    
                    const data = await response.json();
                    displayResults(data);
                } catch (error) {
                    resultDiv.innerHTML = '<div class="error">❌ Error: ' + error.message + '</div>';
                } finally {
                    analyzeBtn.disabled = false;
                    analyzeBtn.textContent = '🔬 Analyze Crop';
                }
            }
            
            function displayResults(data) {
                const severityColor = getSeverityColor(data.severity_level);
                const severityWidth = (data.severity_level / 10) * 100;
                
                const html = `
                    <div class="result">
                        <h3>📊 Analysis Results</h3>
                        <div class="result-grid">
                            <div class="result-item">
                                <div class="result-label">🦠 Disease Type</div>
                                <div class="result-value">${data.disease_type}</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">🌱 Crop Type</div>
                                <div class="result-value">${data.crop_type}</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">⚠️ Severity Level</div>
                                <div class="result-value">${data.severity_level}/10</div>
                                <div class="severity-bar">
                                    <div class="severity-fill" style="width: ${severityWidth}%; background-color: ${severityColor}"></div>
                                </div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">📏 Affected Area</div>
                                <div class="result-value">${data.affected_area_percentage}%</div>
                            </div>
                        </div>
                        <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">
                            📄 File: ${data.filename} | ⏱️ Analysis time: ${data.response_time_ms}ms
                        </p>
                    </div>
                `;
                
                resultDiv.innerHTML = html;
            }
            
            function getSeverityColor(severity) {
                if (severity <= 2) return '#28a745'; // Green - healthy/mild
                if (severity <= 4) return '#ffc107'; // Yellow - moderate
                if (severity <= 7) return '#fd7e14'; // Orange - concerning
                return '#dc3545'; // Red - severe
            }
        </script>
    </body>
    </html>
    """
    
    # Replace placeholder with actual value
    html_content = html_content.replace("MAX_FILE_SIZE_PLACEHOLDER", str(MAX_FILE_SIZE_MB))
    html_content = html_content.replace("MAX_FILE_SIZE_PLACEHOLDERMB", str(MAX_FILE_SIZE_MB) + "MB")
    return html_content

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_crop(file: UploadFile = File(...)):
    start_time = time.time()
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read file content
    file_content = await file.read()
    
    # Check file size
    if len(file_content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File size must be less than {MAX_FILE_SIZE_MB}MB")
    
    # Get API key from environment
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    
    if not openrouter_api_key:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    
    try:
        # Initialize crop analyzer
        analyzer = CropAnalyzer(openrouter_api_key)
        
        # Analyze the crop image
        analysis_result = await analyzer.analyze_crop_image(file_content, file.filename)
        
        response_time_ms = int((time.time() - start_time) * 1000)
        
        return AnalysisResponse(
            disease_type=analysis_result["disease_type"],
            severity_level=analysis_result["severity_level"],
            affected_area_percentage=analysis_result["affected_area_percentage"],
            crop_type=analysis_result["crop_type"],
            filename=file.filename,
            response_time_ms=response_time_ms
        )
        
    except HTTPException:
        raise
    except Exception as e:
        response_time_ms = int((time.time() - start_time) * 1000)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "AI Crop Disease Analyzer API is running",
        "openrouter_configured": os.getenv("OPENROUTER_API_KEY") is not None,
        "max_file_size_mb": MAX_FILE_SIZE_MB
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port) 