
# 🎨 Hospital Management System — Frontend

### 🚀 Modern React Interface for Hospital Management

The frontend of the **Hospital Management System** provides a modern and responsive interface for patients, doctors, receptionists, and administrators.

It communicates with the backend through **REST APIs using Axios** and provides role-based dashboards and protected navigation.

---

## ✨ Features

* 🔐 Login & Registration
* 👥 Role-Based Navigation
* 👑 Admin Dashboard
* 👨‍⚕️ Doctor Dashboard
* 🧑‍💼 Receptionist Dashboard
* 🧑 Patient Dashboard
* 📅 Appointment Management
* 👨‍⚕️ Doctor Selection
* 🏥 Department Management
* 🧑‍🤝‍🧑 Patient Management
* 🔒 Protected Routes
* 🔗 REST API Integration
* ⚡ Fast Vite Development
* 📱 Responsive Interface

---

## 🛠️ Tech Stack

| Technology          | Purpose                  |
| ------------------- | ------------------------ |
| ⚛️ **React.js**     | UI development           |
| 🟨 **JavaScript**   | Application logic        |
| ⚡ **Vite**          | Development & build tool |
| 🌐 **Axios**        | API communication        |
| 🧭 **React Router** | Client-side routing      |
| 🎨 **CSS**          | Styling                  |
| 🔗 **REST API**     | Backend communication    |

---

## 🏗️ Frontend Architecture

```text
                    React Application
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         Components     Pages       Services
              │                         │
              ▼                         ▼
       User Interface              Axios API
                                        │
                                        ▼
                                  Backend API
```

---

## 📁 Project Structure

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── appointments/
│   │   ├── dashboard/
│   │   └── ...
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
└── .env
```

---

## 🔄 Application Flow

```text
              Landing Page
                    │
                    ▼
             Login / Register
                    │
                    ▼
            JWT Authentication
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
       Doctor   Receptionist  Patient
          │         │         │
          └─────────┼─────────┘
                    │
                    ▼
             Role Dashboard
                    │
                    ▼
             Hospital Services
                    │
                    ▼
                Axios API
                    │
                    ▼
              Backend Server
```

---

## 🔐 Authentication

The frontend works with JWT-based authentication provided by the backend.

Protected routes ensure users can only access pages permitted for their role.

```text
Login
  │
  ▼
Receive Token
  │
  ▼
Store Authentication State
  │
  ▼
Protected Route
  │
  ▼
Role-Based Dashboard
```

---

## 🔗 Backend Integration

The frontend communicates with the backend using Axios.

### Backend API

```text
http://localhost:3900/api
```

### Frontend

```text
http://localhost:5173
```

### API Configuration

```text
src/services/api.js
```

Example:

```env
VITE_API_URL=http://localhost:3900/api
```

---

## ⚙️ Installation

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3900/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will normally run on:

```text
http://localhost:5173
```

---

## 🧪 Testing

The frontend is tested through:

* 🔐 Login & registration
* 👥 Role-based navigation
* 🛡️ Protected routes
* 📅 Appointment workflows
* 🔗 API integration
* ⚠️ Error handling
* ⏳ Loading states
* 📱 Responsive UI

---

## 🚀 Future Improvements

* 🌙 Dark Mode
* 📱 Enhanced mobile UI
* 🔔 Real-time notifications
* 📧 Email notifications
* 📊 Advanced dashboards
* 💬 Doctor–patient communication
* 🧪 Automated frontend testing

---

## 👩‍💻 Developer

**Dikshika Adhikari**

BICTE Student | Full-Stack Developer in Progress

> Creating clean, responsive and user-friendly interfaces with React. ⚛️🚀
