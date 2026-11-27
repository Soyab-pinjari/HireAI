🚀 HireAI Portal – AI-Powered Job Recruitment Platform

HireAI Portal is a full-stack job recruitment platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). It connects jobseekers with recruiters through an intuitive job portal while simplifying recruitment with AI-powered resume analysis.

The platform allows jobseekers to discover opportunities, apply for jobs, upload resumes, and receive AI-driven resume feedback. Recruiters can manage company profiles, publish job openings, review applicants, and manage candidate selection through an interactive dashboard.

✨ Features
👨‍💻 Jobseeker Features
User registration and login with JWT authentication.
Browse and search available job opportunities.
View detailed job descriptions.
Apply for jobs.
Upload and manage resumes.
Track job application status.
View application history.
AI-powered resume analysis using Google Gemini.
Get resume scores, strengths, weaknesses, and improvement suggestions.
Extract resume information from PDF files.
🏢 Recruiter Features
Recruiter registration and authentication.
Recruiter dashboard with hiring statistics.
Create, update, and manage job postings.
Manage company profiles.
View applicants for published jobs.
Review applicant resumes and profiles.
Update application statuses:
Pending
Reviewed
Shortlisted
Accepted
Rejected
Search and filter applicants.
View candidate details and resumes.
🤖 AI Integration
Google Gemini API integration.
Automated resume analysis.
Resume skill extraction.
Resume scoring.
Identification of strengths and weaknesses.
Personalized resume improvement suggestions.
Structured JSON responses for frontend integration.
🔐 Authentication & Security
JWT-based authentication.
Role-based access control.
Protected API routes.
Secure password handling.
Authenticated recruiter and jobseeker operations.
☁️ File Management
Resume uploads using Multer.
Cloudinary integration for file storage.
PDF text extraction.
Resume document retrieval.
🛠️ Tech Stack
Frontend
React.js
JavaScript
Tailwind CSS
Redux Toolkit
React Router DOM
Axios
Lucide React
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Multer
AI & Cloud Services
Google Gemini API
Cloudinary
PDF Parse
📂 Project Structure
text
HireAI-Portal/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── Redux/
│       ├── assets/
│       └── App.jsx
│
├── backend/
│   ├── Config/
│   │   ├── cloudinary.js
│   │   └── gemini.js
│   │
│   ├── Controller/
│   ├── Middleware/
│   ├── Modal/
│   ├── Routes/
│   ├── Utils/
│   ├── server.js
│   └── package.json
│
└── README.md


Note: Adjust folder names to match your actual repository structure.

⚙️ Installation & Setup
1. Clone the Repository
bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd HireAI-Portal

2. Backend Setup
bash
cd backend
npm install


Create a .env file inside the backend directory:

env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model


Start the backend server:

bash
npm run dev

3. Frontend Setup

Open another terminal:

bash
cd frontend
npm install


Create a .env file:

env
VITE_API_URL=http://localhost:5000


Start the frontend:

bash
npm run dev


Open the local development URL displayed by Vite in your browser.

🔑 API Configuration

The project uses the following external services:

Service	Purpose
MongoDB Atlas	Database
Cloudinary	Resume and file storage
Google Gemini	AI resume analysis

You need to configure your own API credentials before running the application.

MongoDB: https://www.mongodb.com/
Cloudinary: https://cloudinary.com/
Google AI Studio: https://aistudio.google.com/
📊 Application Workflow
Jobseeker Workflow
Register or log in.
Browse available jobs.
View job details.
Upload a resume.
Apply for suitable positions.
Analyze the resume using AI.
Review resume feedback and improvement suggestions.
Track application status.
Recruiter Workflow
Register or log in as a recruiter.
Complete the company profile.
Publish job openings.
View received applications.
Review candidate profiles and resumes.
Shortlist suitable applicants.
Accept or reject applications.
Monitor recruitment activities through the dashboard.
🔮 Future Enhancements
AI-powered job and candidate matching.
AI job description analysis.
ATS keyword optimization.
AI-generated interview questions.
Automated interview scheduling.
Email notifications for application updates.
Advanced recruiter analytics.
Resume comparison against job descriptions.
🔒 Environment Variables & Security
Never commit .env files.
Keep API keys and JWT secrets private.
Use .gitignore for environment files.
Validate uploaded files on the backend.
Protect sensitive user information.
Implement rate limits for AI endpoints.
👨‍💻 Developer

Soyeb Pinjari

Full Stack Web Developer | MERN Stack

GitHub: https://github.com/Soyab-pinjari
⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!

Built with ❤️ using the MERN Stack and Google Gemini AI.
