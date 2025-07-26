# EthioAgri with AI Crop Analyzer - Setup Instructions

## Overview
Your Next.js frontend is now connected to the AI crop analyzer backend. Farmers can analyze crop images for disease detection through a dedicated interface.

## Prerequisites
- Node.js and npm/pnpm installed
- Python 3.8+ installed
- OpenRouter API key (for the AI crop analyzer)

## Backend Setup (AI Crop Analyzer)

1. **Navigate to the backend directory:**
   ```bash
   cd "AI crop analyzer"
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=5000
   MAX_FILE_SIZE_MB=10
   ```

5. **Start the backend server:**
   ```bash
   python -m app.main
   ```
   The backend will run on `http://localhost:5000`

## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Check environment variables:**
   The `.env.local` file should already contain:
   ```
   NEXT_PUBLIC_CROP_ANALYZER_URL=http://localhost:5000
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   The frontend will run on `http://localhost:3000`

## Testing the Integration

1. **Access the application:**
   - Go to `http://localhost:3000`
   - Click "Login" or "Sign Up"
   - Choose "I'm a Farmer" and complete the signup/login

2. **Use the crop analyzer:**
   - You'll be redirected to the Farmer Dashboard at `/farmers`
   - Click "Analyze Crop" button in the header OR
   - Click the "Analyze Crop" card in the dashboard OR
   - Click "Analyze Now" in the AI Crop Analysis section

3. **Upload and analyze:**
   - Upload a crop image (drag & drop or click to browse)
   - Click "Analyze Crop"
   - View the AI analysis results including:
     - Disease type
     - Severity level (1-10)
     - Affected area percentage
     - Crop type identification

## API Endpoints Available

- **Backend Health Check:** `GET http://localhost:5000/api/health`
- **Crop Analysis:** `POST http://localhost:5000/api/analyze`
- **Web Interface:** `GET http://localhost:5000/`

## Troubleshooting

### Backend Issues:
- **"OpenRouter API key not configured"**: Add your API key to the `.env` file
- **Port conflicts**: The backend now uses port 5000 instead of 3000
- **CORS errors**: The backend is configured to allow requests from `localhost:3000`

### Frontend Issues:
- **"Unable to connect to crop analyzer service"**: Ensure the backend is running on port 5000
- **File upload errors**: Check file size (max 10MB) and format (images only)

### Getting OpenRouter API Key:
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and verify email
3. Add credits to your account
4. Generate an API key in the dashboard
5. Add the key to your backend `.env` file

## Features Implemented

✅ **Backend Integration:**
- Changed backend port from 3000 to 5000
- Updated CORS to allow Next.js frontend
- Environment variable configuration

✅ **Frontend Integration:**
- Created API client service (`/lib/crop-analyzer.ts`)
- Added dedicated analysis page (`/farmers/analyze`)
- Updated farmer dashboard with analysis links
- Implemented drag & drop file upload
- Added error handling and loading states
- Real-time results display

✅ **User Experience:**
- Farmer authentication flow
- Intuitive upload interface with preview
- Comprehensive analysis results
- Mobile-responsive design
- Progress indicators and error messages

## File Structure Changes

```
project/
├── .env.local (new)
├── .env.example (new)
├── lib/crop-analyzer.ts (new)
├── app/farmers/
│   ├── page.tsx (updated - farmer dashboard)
│   └── analyze/
│       └── page.tsx (new - analysis page)

AI crop analyzer/
├── .env.example (updated port)
└── app/main.py (updated port and CORS)
```

The integration is now complete! Farmers can log in and use AI-powered crop analysis directly through the EthioAgri platform. 