# Ichgramm – Fullstack Social Media Application

Fullstack web application inspired by Instagram with real-time features, authentication, image uploads and client-server communication.

## 📌 Description

Ichgramm is a social media web application where users can register, log in, create posts with images, interact with content and receive real-time updates via WebSockets.

The project focuses on **frontend–backend interaction**, **real-time communication**, and a clean fullstack architecture.

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* React Router
* Redux Toolkit
* React Hook Form
* Tailwind CSS
* Axios
* Socket.io-client
* Vite

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Socket.io
* JWT Authentication
* Cloudinary (image storage)
* Multer & Sharp (image upload & processing)
* Nodemailer

### Dev & Infrastructure

* Docker & Docker Compose
* Concurrently
* Git
* Environment variables (.env)

## 🚀 Features

* User registration and authentication (JWT)
* Create posts with image upload
* Image processing and cloud storage (Cloudinary)
* Real-time updates using WebSockets
* Client-server event handling
* Protected routes and role-based logic
* Responsive UI

## 🧑‍💻 My Role

* Developed frontend application with React and TypeScript
* Implemented real-time communication using Socket.io
* Built REST APIs and WebSocket events on the backend
* Integrated authentication and authorization (JWT)
* Implemented image upload pipeline with Cloudinary
* Set up Docker-based development environment

## 📁 Project Structure

```
root/
│
├── frontend/        → React + Vite application
├── backend/         → Express.js server
├── docker-compose.yml
└── package.json     → Root scripts for concurrent startup
```

## ▶️ Run locally

### 1. Clone repository

```bash
git clone https://github.com/YevheniiKushnir/IchGramm.git
cd IchGramm
```

### 2. Install dependencies

```bash
npm run init
```

### 3. Start frontend & backend

```bash
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend: [http://localhost:3000](http://localhost:3000)

> Note: Environment variables are required for Cloudinary, MongoDB and JWT.

## 📎 Notes

* Project runs locally using Docker or npm scripts
* Focus was on fullstack architecture and real-time communication
* No public deployment available

## 📄 License

MIT
