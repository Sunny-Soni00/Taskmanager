# 📋 Task Manager

A modern, full-stack task management application built with React and FastAPI. Collaborate with your team, manage projects, and track tasks efficiently.

![Task Manager](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌐 Live Demo

**Frontend:** [https://sunny-soni00.github.io/Taskmanager/](https://sunny-soni00.github.io/Taskmanager/)  
**Backend API:** [https://taskmanager-backend-eyxx.onrender.com](https://taskmanager-backend-eyxx.onrender.com)

## ✨ Features

- 🔐 **User Authentication** - Secure login and signup
- 👥 **Team Collaboration** - Create teams and invite members
- 📁 **Project Management** - Organize work into projects
- ✅ **Task Tracking** - Create, assign, and track tasks with priorities
- 📊 **Kanban Board** - Visual task management
- 📅 **Calendar View** - Track deadlines
- 💬 **Team Chat** - Real-time messaging
- 🔔 **Notifications** - Stay updated with task changes
- 🌓 **Dark Mode** - Easy on the eyes
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd taskflow/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd taskflow/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

## 📂 Project Structure

```
Taskmanager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── taskflow/
│   ├── frontend/               # React frontend
│   │   ├── src/
│   │   │   ├── api/           # API calls
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Page components
│   │   │   ├── contexts/      # Context providers
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── constants/     # Constants & config
│   │   ├── package.json
│   │   └── vite.config.js
│   └── backend/                # FastAPI backend
│       ├── app/
│       │   ├── api/           # API routes
│       │   ├── models/        # Database models
│       │   ├── schemas/       # Pydantic schemas
│       │   ├── services/      # Business logic
│       │   └── core/          # Config
│       └── requirements.txt
└── README.md
```

## 🌍 Deployment

### Frontend (GitHub Pages)
- Automatically deployed via GitHub Actions
- Triggers on push to `main` branch
- Live at: https://sunny-soni00.github.io/Taskmanager/

### Backend (Render.com)
- Deployed on Render free tier
- Auto-deploys from GitHub repository
- Environment variables configured in Render dashboard

## 🔧 Configuration

### Frontend Environment
Update `src/constants/index.js`:
```javascript
export const API_BASE_URL = 'https://your-backend-url.com';
```

### Backend Environment
Set these environment variables:
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite+aiosqlite:///./taskflow.db
ALLOWED_ORIGINS=https://sunny-soni00.github.io
```

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x400?text=Home+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)

### Kanban Board
![Kanban](https://via.placeholder.com/800x400?text=Kanban+Board)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sunny Soni**
- GitHub: [@Sunny-Soni00](https://github.com/Sunny-Soni00)

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI team for the modern Python web framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

⭐ Star this repo if you find it helpful!
