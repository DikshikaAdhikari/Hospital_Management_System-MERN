# 🏥 Hospital Management System (HMS)

A full-stack **Hospital Management System (HMS)** designed to simplify and manage essential hospital operations through a secure backend API and a modern, responsive frontend.

The system supports multiple user roles including **Admin, Doctor, Receptionist, and Patient**, with role-based access control and JWT authentication.

---

## 🚀 Project Overview

The Hospital Management System provides a centralized platform for managing hospital activities such as:

* 🔐 User Registration & Authentication
* 👥 Role-Based Access Control
* 🏥 Department Management
* 👨‍⚕️ Doctor Management
* 🧑‍🤝‍🧑 Patient Management
* 👩‍💼 Receptionist Management
* 📅 Appointment Management
* 📊 Role-Based Dashboards
* 🔒 Secure JWT Authentication
* 🔗 RESTful API Integration

The project is divided into two main parts:

```text
Frontend → React.js
Backend  → Node.js + Express.js + PostgreSQL
```

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration
* User login
* JWT Access Token
* JWT Refresh Token
* Password hashing using bcrypt
* Protected routes
* Role-based authorization
* Secure API access

---

## 👥 User Roles

The system provides different access levels for:

| Role               | Responsibilities                                              |
| ------------------ | ------------------------------------------------------------- |
| 👑 Admin           | Manage users, doctors, patients, departments and appointments |
| 👨‍⚕️ Doctor       | View patients and manage appointments                         |
| 🧑‍💼 Receptionist | Manage patients and appointments                              |
| 🧑 Patient         | View information and manage appointments                      |

---

# 🏥 Hospital Modules

### Authentication

* Register User
* Login User
* JWT Authentication
* Refresh Token

### Department Management

* Create Department
* View Departments
* Update Department
* Delete Department

### Doctor Management

* Create Doctor
* View Doctors
* Update Doctor
* Delete Doctor

### Patient Management

* Register Patient
* View Patients
* Update Patient
* Delete Patient

### Receptionist Management

* Create Receptionist
* View Receptionists
* Update Receptionist
* Delete Receptionist

### Appointment Management

* Book Appointment
* View Appointments
* Update Appointment
* Cancel Appointment

---

# 🛠️ Technology Stack

## Frontend

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| ⚛️ React.js     | Frontend framework       |
| 🟨 JavaScript   | Programming language     |
| ⚡ Vite          | Development & build tool |
| 🌐 Axios        | API communication        |
| 🧭 React Router | Client-side routing      |
| 🎨 CSS          | Styling                  |

## Backend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| 🟢 Node.js       | Runtime environment   |
| 🚀 Express.js    | Backend framework     |
| 🐘 PostgreSQL    | Relational database   |
| 🔄 Sequelize     | ORM                   |
| 🔑 JWT           | Authentication        |
| 🔒 bcrypt        | Password hashing      |
| 🌱 dotenv        | Environment variables |
| 🍪 cookie-parser | Cookie handling       |
| 🔗 CORS          | Cross-origin requests |
| 📮 Postman       | API testing           |

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     User / Client   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                         Axios / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
                  ▼            ▼            ▼
             Middleware     Services      Routes
                  │
                  ▼
             ┌───────────────┐
             │   Sequelize  │
             │      ORM     │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │  PostgreSQL   │
             │   Database    │
             └───────────────┘
```

---

Hospital_Management_System/
│
├── config/                 # Database configuration
├── features/              # Backend features/modules
│   ├── auth/
│   ├── users/
│   ├── doctors/
│   ├── patients/
│   ├── receptionists/
│   ├── departments/
│   └── appointments/
│
├── middlewares/            # Authentication & authorization
├── models/                 # Database models
├── routes/                 # API routes
├── utils/                  # Utility functions
│
├── server.js               # Backend entry point
├── package.json            # Backend dependencies
├── .env                    # Backend environment variables
│
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md

# 🔄 Application Flow

```text
                         Landing Page
                              │
                              ▼
                     ┌────────────────┐
                     │ Login/Register │
                     └───────┬────────┘
                             │
                       JWT Authentication
                             │
              ┌──────────────┼──────────────┐
              │              │               │
              ▼              ▼               ▼
           Admin           Doctor        Receptionist
              │              │               │
              └──────────────┼───────────────┘
                             │
                             ▼
                          Patient
                             │
                             ▼
                    Hospital Services
                             │
                             ▼
                     Backend REST API
                             │
                             ▼
                       PostgreSQL
```

---

# 🔗 Frontend & Backend Integration

The React frontend communicates with the backend through REST APIs using Axios.

### Backend

```text
http://localhost:3900
```

### Frontend

```text
http://localhost:5173
```

### API Service

The frontend API configuration is located at:

```text
frontend/src/services/api.js
```

Example environment variable:

```env
VITE_API_URL=http://localhost:3900
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/DikshikaAdhikari/Hospital_Management_System.git
```

## 2. Navigate to the Project

```bash
cd Hospital_Management_System
```

---

# 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3900

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

Start the backend development server:

```bash
npm run dev
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3900
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔐 Authentication

The application uses **JWT-based authentication**.

Protected API requests use:

```text
Authorization: Bearer <access_token>
```

The system uses:

* Access Tokens
* Refresh Tokens
* Password hashing
* Protected routes
* Role-based authorization

---

# 🗄️ Database Relationships

The main database relationships include:

```text
User
 │
 ├──── Doctor
 │
 └──── Patient

Department
 │
 ├──── Many Doctors
 │
 └──── Many Appointments

Doctor
 │
 └──── Many Appointments

Patient
 │
 └──── Many Appointments
```

---

# 📚 API Endpoints

Some of the main API endpoints include:

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Doctors

```http
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### Patients

```http
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Departments

```http
GET    /api/departments
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Appointments

```http
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

---

# 🧪 Testing

### Backend API Testing

API endpoints are tested using:

* Postman
* Authentication testing
* Request validation
* Response validation
* Error handling

### Frontend Testing

The frontend is tested by verifying:

* Registration
* Login
* Protected routes
* Role-based navigation
* API integration
* Appointment functionality
* Error and loading states

---

# 🔒 Security

The project implements several security practices:

* 🔐 JWT Authentication
* 🔑 Password hashing with bcrypt
* 👥 Role-Based Authorization
* ✅ Request validation
* ⚠️ Centralized error handling
* 🌱 Environment variable management
* 🔗 CORS configuration
* 🛡️ Protected frontend routes

---

# 📈 Future Improvements

Planned improvements include:

* 🔔 Real-time appointment notifications
* 📧 Email notifications
* 💬 Doctor-patient communication
* 🩺 Electronic Medical Records
* 💊 Prescription Management
* 💳 Billing & Payment System
* 📊 Advanced Dashboard Analytics
* 📄 Swagger/OpenAPI Documentation
* 🐳 Docker Support
* 🧪 Unit & Integration Testing
* 📱 Improved mobile responsiveness
* 🌙 Dark Mode

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

### 4. Commit your changes

```bash
git commit -m "feat: add new feature"
```

### 5. Push the branch

```bash
git push origin feature/your-feature
```

### 6. Create a Pull Request

---

# 👩‍💻 Developer

**Dikshika Adhikari**

**Full-Stack Developer | React & Node.js Learner**

GitHub:
https://github.com/DikshikaAdhikari

This project was developed as a learning and development project to gain practical experience in:

**React.js • Node.js • Express.js • PostgreSQL • Sequelize • REST APIs • JWT • Git & GitHub**

---

# 🙏 Acknowledgement

Special thanks to my **mentor and instructor** for their guidance, feedback, and continuous support throughout the development of this project.

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

> **Building better healthcare experiences through technology. 🏥💙**

---

## 📌 Project Status

🚧 **Currently in Development**

The backend API and core frontend features are being developed and integrated progressively.
