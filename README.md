# 🏥 HOSPITAL MANAGEMENT SYSTEM

### 🚀 A Full-Stack Web Application for Smarter Hospital Management

A secure and responsive **Hospital Management System (HMS)** built to simplify hospital operations through modern frontend and backend technologies.

The system provides **role-based access** for Admins, Doctors, Receptionists, and Patients, with secure **JWT authentication**, RESTful APIs, and database integration.

---

## ✨ KEY FEATURES

* 🔐 **Secure Authentication** — JWT Access & Refresh Tokens
* 👥 **Role-Based Access Control** — Admin, Doctor, Receptionist & Patient
* 👨‍⚕️ **Doctor Management** — Create, view, update & delete doctors
* 🧑‍🤝‍🧑 **Patient Management** — Manage patient records
* 🏥 **Department Management** — Manage hospital departments
* 📅 **Appointment Management** — Book, manage & cancel appointments
* 📊 **Role-Based Dashboards** — Different workflows for each user
* 🔗 **RESTful APIs** — Frontend and backend integration
* 🔒 **Password Security** — bcrypt password hashing
* 📱 **Responsive UI** — Designed for modern devices

---

# 👥 USER ROLES

| Role                   | Main Responsibilities                                       |
| ---------------------- | ----------------------------------------------------------- |
| 👑 **Admin**           | Manage users, doctors, patients, departments & appointments |
| 👨‍⚕️ **Doctor**       | View patients & manage appointments                         |
| 🧑‍💼 **Receptionist** | Manage patients & appointments                              |
| 🧑 **Patient**         | Manage profile & appointments                               |

---

# 🛠️ TECH STACK

### 🎨 FRONTEND

`React.js` • `JavaScript` • `Vite` • `Axios` • `React Router` • `CSS`

### ⚙️ BACKEND

`Node.js` • `Express.js` • `Sequelize` • `REST API`

### 🗄️ DATABASE

`PostgreSQL` • `SQL`

### 🔐 SECURITY

`JWT` • `bcrypt` • `CORS` • `dotenv`

### 🧪 DEVELOPMENT TOOLS

`VS Code` • `Postman` • `Git` • `GitHub`

---

# 🏗️ SYSTEM ARCHITECTURE

```text
                    👤 USER
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │     + Vite      │
              └────────┬────────┘
                       │
                  Axios / REST
                       │
                       ▼
              ┌─────────────────┐
              │ Express + Node  │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Middleware     Routes      Services
          │
          ▼
      Sequelize
          │
          ▼
      PostgreSQL
```

---

# 📁 PROJECT STRUCTURE

```text
Hospital_Management_System/
│
├── config/
├── features/
│   ├── auth/
│   ├── users/
│   ├── doctors/
│   ├── patients/
│   ├── receptionists/
│   ├── departments/
│   └── appointments/
│
├── middlewares/
├── models/
├── routes/
├── utils/
├── server.js
├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔄 APPLICATION FLOW

```text
Landing Page
      │
      ▼
 Login / Register
      │
      ▼
 JWT Authentication
      │
      ▼
 ┌────┼───────────────┐
 │    │       │       │
 ▼    ▼       ▼       ▼
Admin Doctor Receptionist Patient
 │    │       │       │
 └────┴───────┴───────┘
          │
          ▼
    Hospital Services
          │
          ▼
      REST API
          │
          ▼
     PostgreSQL
```

---

# 🔐 AUTHENTICATION & SECURITY

The application implements secure authentication and authorization using:

* 🔑 JWT Access Tokens
* 🔄 JWT Refresh Tokens
* 🔒 bcrypt Password Hashing
* 🛡️ Protected Routes
* 👥 Role-Based Authorization
* 🌱 Environment Variables
* 🔗 CORS Configuration
* ⚠️ Request Validation
* 🚨 Error Handling

Protected API requests use:

```text
Authorization: Bearer <access_token>
```

---

# 📚 MAIN API ENDPOINTS

### 🔐 Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### 👨‍⚕️ Doctors

```http
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### 🧑‍🤝‍🧑 Patients

```http
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### 🏥 Departments

```http
GET    /api/departments
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### 📅 Appointments

```http
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

---

# ⚙️ SETUP & INSTALLATION

## 1️⃣ Clone Repository

```bash
git clone https://github.com/DikshikaAdhikari/Hospital_Management_System.git
```

```bash
cd Hospital_Management_System
```

---

## 2️⃣ Backend Setup

```bash
cd backend
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

Start the backend:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
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

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3900
```

---

# 🧪 TESTING

The project has been tested through:

* 📮 Postman API testing
* 🔐 Authentication testing
* 👥 Role-based access testing
* 🔗 Frontend–Backend API integration
* 📅 Appointment workflow testing
* ⚠️ Error & validation handling
* 🛡️ Protected route testing

---

# 🚀 FUTURE IMPROVEMENTS

* 🔔 Real-Time Notifications
* 📧 Email Notifications
* 💬 Doctor–Patient Communication
* 🩺 Electronic Medical Records
* 💊 Prescription Management
* 💳 Billing & Payment
* 📊 Advanced Analytics
* 📄 Swagger API Documentation
* 🐳 Docker Support
* 🧪 Automated Testing
* 🌙 Dark Mode
* 📱 Enhanced Mobile Experience

---

# 📈 DEVELOPMENT JOURNEY

This project helped me gain practical experience in:

**Frontend Development → REST APIs → Authentication → Database Design → Role-Based Authorization → Full-Stack Integration**

Along the way, I worked with real-world concepts such as API errors, authentication issues, database relationships, protected routes, validation, and frontend-backend communication.

---


# 👩‍💻 DEVELOPER

## **Dikshika Adhikari**

**BICTE Student | Full-Stack Developer in Progress**

Passionate about building modern web applications and continuously improving my skills in **JavaScript, React, Node.js, backend development, databases, and full-stack engineering.**

🔗 **GitHub:**
https://github.com/DikshikaAdhikari

---

# 🙏 ACKNOWLEDGEMENT

Special thanks to my **mentor and instructor** for their valuable guidance, feedback, and continuous support throughout the development of this project.

---

# ⭐ SUPPORT

If you found this project interesting, consider giving it a ⭐ on GitHub.

### 💙 BUILD • LEARN • DEBUG • IMPROVE

> **Turning ideas into practical software, one project at a time. 🚀**
