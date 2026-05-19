# AI-Based Smart Complaint Management System

A full-stack MERN application for registering, tracking, and managing complaints with AI-powered analysis.

## Features

- **Complaint Registration** – Submit complaints with title, description, category, and location
- **Complaint Tracking** – View, filter by category, search by location, and update status
- **AI-Based Analysis** – Automatic priority detection, department recommendation, complaint summary, and auto-generated responses
- **Authentication & Security** – JWT-based auth with bcrypt password hashing
- **Role-Based Access** – User and Admin roles with protected routes

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite                     |
| Backend    | Node.js + Express.js                |
| Database   | MongoDB Atlas + Mongoose            |
| Auth       | JWT + bcrypt                        |
| AI Engine  | Rule-based NLP Classifier           |
| Deployment | Render (Frontend + Backend)         |

## API Endpoints

### Authentication
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/auth/register`| Register new user  |
| POST   | `/api/auth/login`   | Login user         |
| GET    | `/api/auth/me`      | Get user profile   |

### Complaints
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/complaints`                     | Add complaint            |
| GET    | `/api/complaints`                     | Get all complaints       |
| GET    | `/api/complaints/:id`                 | Get single complaint     |
| PUT    | `/api/complaints/:id`                 | Update complaint status  |
| DELETE | `/api/complaints/:id`                 | Delete complaint         |
| GET    | `/api/complaints/search?location=xyz` | Search by location       |

### AI Analysis
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| POST   | `/api/ai/analyze` | Analyze complaint    |

## MongoDB Schema

```javascript
const ComplaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  description: String,
  category: String,
  location: String,
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Medium" },
  aiAnalysis: {
    priority: String,
    department: String,
    summary: String,
    autoResponse: String,
    analyzedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Backend
```bash
cd backend
npm install
# Create .env file with MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

Deployed on **Render** using `render.yaml` Blueprint.

- **Frontend**: Static Site
- **Backend**: Web Service

## Test Cases

| Test Case              | Expected Output             |
|------------------------|-----------------------------|
| Add valid complaint    | Complaint stored successfully |
| Missing title field    | Validation error            |
| Invalid email          | Error message               |
| Filter by location     | Matching complaints displayed |
| Valid login            | Token generated             |
| Invalid password       | Unauthorized error          |
| Access without token   | Access denied               |
| Water leakage complaint| Water department suggestion |
| Electricity issue      | High priority alert         |

## Author

Built as a MERN Stack Case Study Project.
