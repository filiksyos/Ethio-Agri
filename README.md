# 🌾 EthioAgri - AI-Powered Agricultural Platform

https://github.com/user-attachments/assets/00a69701-155d-4863-8bc8-30f0ccdd89b9

An integrated agricultural platform that connects farmers with customers and provides AI-powered crop disease analysis. Built with modern technologies including Spring Boot, Next.js, and FastAPI.

## 🏗️ Project Architecture

This project consists of three main components:

### 1. **Frontend** - Next.js Web Application
- **Technology**: Next.js 13.5.1 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **Port**: `http://localhost:3000`
- **Features**:
  - User authentication (farmers and customers)
  - Farmer dashboard with crop analysis integration
  - Modern, responsive UI with dark/light theme support
  - Real-time crop disease analysis interface

### 2. **Spring Boot Backend** - User Management API
- **Technology**: Spring Boot 3.5.0 with Java 17
- **Database**: PostgreSQL
- **Port**: `http://localhost:8080` (default)
- **Features**:
  - User registration and authentication (JWT)
  - Farmer and customer management
  - RESTful API with OpenAPI documentation
  - Secure password handling

### 3. **AI Crop Analyzer Backend** - Disease Detection Service
- **Technology**: FastAPI with Python 3.8+
- **AI Service**: OpenRouter API (GPT-4o-mini)
- **Port**: `http://localhost:5000`
- **Features**:
  - AI-powered crop disease detection
  - Image upload and analysis
  - Disease severity assessment (1-10 scale)
  - Real-time processing with performance metrics

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+) and npm/pnpm
- **Java 17+** and Maven
- **Python 3.8+** and pip
- **PostgreSQL** database
- **OpenRouter API key** (for AI analysis)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Ethio Agri"
```

### 2. Setup AI Crop Analyzer Backend
```bash
cd "crop analyzer AI backend"

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OpenRouter API key:
# OPENROUTER_API_KEY=your_openrouter_api_key_here

# Start the AI service
python -m app.main
```

### 3. Setup Spring Boot Backend
```bash
cd "Spring boot backend"

# Configure database in application.properties
# Update with your PostgreSQL credentials

# Build and run
./mvnw spring-boot:run
# or on Windows:
mvnw.cmd spring-boot:run
```

### 4. Setup Frontend
```bash
cd "Frontend/project"

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Spring Boot API**: http://localhost:8080
- **AI Crop Analyzer**: http://localhost:5000
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 🔗 Component Integration

### User Flow
1. **Registration/Login**: Users register through the Next.js frontend
2. **Authentication**: Spring Boot backend handles user authentication with JWT
3. **Farmer Dashboard**: Authenticated farmers access the dashboard
4. **Crop Analysis**: Farmers upload images for AI-powered disease detection
5. **Results**: FastAPI backend processes images and returns analysis results

### API Integration
- Frontend communicates with Spring Boot for user management
- Frontend connects to FastAPI for crop analysis
- Both backends configured with CORS for seamless integration

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13.5.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hook Form
- **HTTP Client**: Fetch API

### Spring Boot Backend
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI

### AI Crop Analyzer
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI Service**: OpenRouter (GPT-4o-mini)
- **Image Processing**: Multi-format support (JPEG, PNG, GIF, WebP)
- **HTTP Client**: httpx

## 🌾 AI Crop Analysis Features

### Disease Detection Capabilities
- **Fungal Diseases**: Late Blight, Powdery Mildew, Rust, Anthracnose
- **Bacterial Diseases**: Bacterial Spot, Fire Blight, Crown Gall
- **Viral Diseases**: Mosaic Virus, Yellowing Virus, Leaf Curl
- **Nutritional Issues**: Nutrient deficiencies, pH problems
- **Pest Damage**: Insect damage, mite infestations

### Analysis Output
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

### Severity Scale
- **1-2**: Very mild symptoms, minimal impact
- **3-4**: Mild symptoms, early stage disease
- **5-6**: Moderate symptoms, noticeable damage
- **7-8**: Severe symptoms, significant crop impact
- **9-10**: Very severe, critical damage requiring immediate action

## 📁 Project Structure

```
Ethio Agri/
├── Frontend/
│   ├── project/                 # Next.js application
│   │   ├── app/                # App router pages
│   │   ├── components/         # UI components
│   │   ├── lib/               # Utilities and API clients
│   │   └── package.json       # Dependencies
│   └── SETUP_INSTRUCTIONS.md  # Integration guide
├── Spring boot backend/
│   ├── src/
│   │   └── main/java/com/example/test/
│   │       ├── Controller/    # REST controllers
│   │       ├── Model/         # JPA entities
│   │       ├── Service/       # Business logic
│   │       └── Repository/    # Data access
│   └── pom.xml               # Maven dependencies
├── crop analyzer AI backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   └── services/         # AI analysis service
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # AI service documentation
└── README.md               # This file
```

## 🔧 Development

### Frontend Development
```bash
cd "Frontend/project"
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd "Spring boot backend"
./mvnw spring-boot:run           # Run with auto-reload
./mvnw test                      # Run tests
```

### AI Service Development
```bash
cd "crop analyzer AI backend"
uvicorn app.main:app --reload    # Run with auto-reload
```

## 🌐 API Endpoints

### Spring Boot Backend (`localhost:8080`)
- `POST /api/farmers/signup` - Farmer registration
- `POST /api/farmers/login` - Farmer authentication
- `POST /api/customers/signup` - Customer registration
- `POST /api/customers/login` - Customer authentication

### AI Crop Analyzer (`localhost:5000`)
- `GET /` - Web upload interface
- `POST /api/analyze` - Crop image analysis
- `GET /api/health` - Service health check

## 🔒 Environment Configuration

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_CROP_ANALYZER_URL=http://localhost:5000
```

### Spring Boot (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ethioagri
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### AI Crop Analyzer (`.env`)
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
MAX_FILE_SIZE_MB=10
ALLOWED_ORIGINS=http://localhost:3000
```

## 🚨 Troubleshooting

### Common Issues

1. **Frontend can't connect to backends**
   - Ensure all services are running on correct ports
   - Check CORS configuration in backend services

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check database credentials in application.properties

3. **AI analysis fails**
   - Verify OpenRouter API key in .env file
   - Check API key has sufficient credits
   - Ensure image format is supported

4. **Authentication issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user exists in database

### Getting OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create account and verify email
3. Add credits to your account
4. Generate API key in dashboard
5. Add key to `.env` file in AI backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🏷️ Version History

- **v0.1.0**: Initial release with basic farmer/customer management
- **v0.2.0**: Added AI crop disease analysis integration
- **v0.3.0**: Enhanced UI with modern components and responsive design

## 👥 Team

Built for Ethiopian agricultural development with modern web technologies.

---

*For detailed setup instructions for each component, refer to the individual README files in each directory.* 
