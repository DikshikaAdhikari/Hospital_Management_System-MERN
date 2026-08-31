# ⚙️ Hospital Management System — Backend

### 🚀 Secure REST API for Hospital Management

The backend of the **Hospital Management System** provides a secure and scalable REST API for managing users, doctors, patients, departments, receptionists, and appointments.

It implements **JWT authentication, role-based authorization, password hashing, database relationships, and protected API routes**.

---

## ✨ Features

* 🔐 User Registration & Login
* 🔑 JWT Access & Refresh Tokens
* 👥 Role-Based Authorization
* 👑 Admin Management
* 👨‍⚕️ Doctor Management
* 🧑‍🤝‍🧑 Patient Management
* 🧑‍💼 Receptionist Management
* 🏥 Department Management
* 📅 Appointment Management
* 🔒 Protected API Routes
* 🔑 Password Hashing with bcrypt
* ✅ Request Validation
* ⚠️ Error Handling
* 🔗 RESTful API Architecture

---

## 🛠️ Tech Stack

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| 🟢 **Node.js**    | JavaScript runtime        |
| 🚀 **Express.js** | REST API framework        |
| 🐘 **PostgreSQL** | Relational database       |
| 🔄 **Sequelize**  | ORM                       |
| 🔐 **JWT**        | Authentication            |
| 🔒 **bcrypt**     | Password hashing          |
| 🌱 **dotenv**     | Environment configuration |
| 🔗 **CORS**       | Cross-origin requests     |
| 📮 **Postman**    | API testing               |

---

## 🏗️ Architecture

```text
Client
  │
  │ HTTP / REST API
  ▼
Express.js
  │
  ├── Routes
  ├── Controllers
  ├── Services
  ├── Middleware
  │     ├── Authentication
  │     └── Authorization
  │
  ▼
Sequelize ORM
  │
  ▼
PostgreSQL
```

---

## 📁 Project Structure

```text
Backend/
│
├── config/
│   └── Database configuration
│
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
│   ├── Authentication
│   └── Authorization
│
├── models/
├── routes/
├── utils/
│
├── server.js
├── package.json
├── package-lock.json
└── .env
```

---

## 🔐 Authentication

The API uses JWT-based authentication.

### Authentication Flow

```text
Login / Register
       │
       ▼
   Validate User
       │
       ▼
 Generate JWT
       │
       ▼
 Access Protected API
       │
       ▼
 Role Authorization
```

Protected requests use:

```http
Authorization: Bearer <access_token>
```

---

## 👥 User Roles

| Role                   | Access                  |
| ---------------------- | ----------------------- |
| 👑 **Admin**           | Full system management  |
| 👨‍⚕️ **Doctor**       | Patients & appointments |
| 🧑‍💼 **Receptionist** | Patients & appointments |
| 🧑 **Patient**         | Profile & appointments  |

---

## 📚 Main API Routes

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

## ⚙️ Installation

### 1. Navigate to Backend

```bash
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

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

### 4. Start Development Server

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3900
```

---

## 🧪 API Testing

The API can be tested using **Postman**.

Testing includes:

* Authentication
* Authorization
* CRUD operations
* Protected routes
* Appointment workflows
* Validation
* Error responses

---

## 🔒 Security

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Protected routes
* Environment variables
* CORS configuration
* Request validation
* Centralized error handling

---

## 🚀 Future Improvements

* 📄 Swagger / OpenAPI documentation
* 🧪 Unit & integration testing
* 🐳 Docker support
* 🔔 Real-time notifications
* 📧 Email notifications
* 📊 Advanced analytics

---

## 👩‍💻 Developer

**Dikshika Adhikari**

BICTE Student | Full-Stack Developer in Progress

> Building secure and practical backend systems with Node.js, Express & PostgreSQL. 🚀
