# 🌾 AI Crop Disease Analyzer

AI-powered crop disease detection and analysis using OpenRouter API with FastAPI backend.

## Features

* 📸 **Image Upload**: Simple drag & drop interface for crop images
* 🔬 **Disease Detection**: AI-powered analysis using OpenRouter (GPT-4o-mini)
* 📊 **Detailed Analysis**: 
  - Disease type identification
  - Severity level (1-10 scale)
  - Affected area percentage (0-100%)
  - Crop type recognition
* 🚀 **FastAPI Backend**: Fast, modern API with automatic documentation
* 🌐 **Web Interface**: Built-in HTML upload page for testing
* ⚡ **Real-time Analysis**: Quick response with processing time metrics

## Quick Setup

### 1. Clone and Install
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure API Key
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your OpenRouter API key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run the Application
```bash
# Start the FastAPI server
python -m app.main
```

The application will be available at `http://localhost:3000`

## API Endpoints

### 🌐 Web Interface
- **GET** `/` - HTML upload interface for testing

### 🔬 Analysis API
- **POST** `/api/analyze` - Analyze crop image
  - **Body**: Multipart form with image file
  - **Response**: JSON with analysis results

### ⚕️ Health Check  
- **GET** `/api/health` - API health status

## API Response Format

```json
{
  "disease_type": "Late Blight",
  "severity_level": 7,
  "affected_area_percentage": 45.5,
  "crop_type": "Tomato",
  "filename": "tomato_leaf.jpg",
  "response_time_ms": 1250
}
```

## Supported Image Formats

- **Formats**: JPEG, PNG, GIF, WebP
- **Max Size**: 10MB (configurable via `MAX_FILE_SIZE_MB`)
- **Recommended**: Clear, well-lit crop images showing leaves or affected areas

## Disease Detection Capabilities

The AI can detect various crop diseases including:

- **Fungal Diseases**: Late Blight, Powdery Mildew, Rust, Anthracnose
- **Bacterial Diseases**: Bacterial Spot, Fire Blight, Crown Gall
- **Viral Diseases**: Mosaic Virus, Yellowing Virus, Leaf Curl
- **Nutritional Issues**: Nutrient deficiencies, pH problems
- **Pest Damage**: Insect damage, mite infestations

## Severity Scale

- **1-2**: Very mild symptoms, minimal impact
- **3-4**: Mild symptoms, early stage disease
- **5-6**: Moderate symptoms, noticeable damage
- **7-8**: Severe symptoms, significant crop impact
- **9-10**: Very severe, critical damage requiring immediate action

## Configuration

Environment variables in `.env`:

```env
# Required
OPENROUTER_API_KEY=your_api_key_here

# Optional
PORT=3000                    # Server port
MAX_FILE_SIZE_MB=10         # Maximum upload size
ALLOWED_ORIGINS=*           # CORS origins (comma-separated)
```

## Development

### Project Structure
```
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   └── services/
│       ├── __init__.py
│       └── crop_analyzer.py    # OpenRouter AI service
├── .env.example               # Environment template
├── .gitignore
├── README.md
└── requirements.txt
```

### Running in Development
```bash
# With auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 3000

# Access interactive API docs
# http://localhost:3000/docs
```

## API Integration

### cURL Example
```bash
curl -X POST "http://localhost:3000/api/analyze" \
  -F "file=@path/to/crop_image.jpg"
```

### Python Example
```python
import requests

url = "http://localhost:3000/api/analyze"
files = {"file": open("crop_image.jpg", "rb")}
response = requests.post(url, files=files)
result = response.json()

print(f"Disease: {result['disease_type']}")
print(f"Severity: {result['severity_level']}/10")
```

### JavaScript Example
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log('Analysis:', result);
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Successful analysis
- **400**: Invalid file format or size
- **500**: Server error or AI analysis failure

## Troubleshooting

### Common Issues

1. **"OpenRouter API key not configured"**
   - Make sure your `.env` file contains a valid `OPENROUTER_API_KEY`
   - Restart the server after updating the `.env` file

2. **"File too large"** 
   - Reduce image size or increase `MAX_FILE_SIZE_MB` in `.env`
   - Recommended: Resize images to under 2MB for faster processing

3. **"Analysis Failed"**
   - Check your OpenRouter API key and account credits
   - Ensure the uploaded file is a valid image format
   - Try with a clearer, well-lit crop image

### Getting OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and verify your email
3. Add credits to your account
4. Generate an API key in the dashboard
5. Add the key to your `.env` file

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **OpenRouter**: AI API service providing access to various LLMs
- **GPT-4o-mini**: Vision-language model for image analysis
- **uvicorn**: ASGI server for running FastAPI applications
- **httpx**: Async HTTP client for API requests
- **Pydantic**: Data validation and serialization 