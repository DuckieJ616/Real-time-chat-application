# 📌 Online Chat Application

A real-time online chat application that allows users to send and receive messages instantly.  
This project demonstrates how to build a full-stack real-time communication system using **Go**, **WebSocket**, **PostgreSQL**, and **Next.js**.

---

## 🚀 Features

- **Real-time messaging** (instant updates without refreshing)  
- **Room-based chat system**  
- **JWT authentication stored in HttpOnly Cookie**  
- **Message history persistence**  
- **Responsive UI for desktop & mobile**  
- **WebSocket connection for live updates**  
- **Simple & modern UI built with Next.js**  

---

## 🛠 Tech Stack

### **Frontend**
- Next.js 14
- React 18
- TypeScript
- CSS / Tailwind (optional)

### **Backend**
- Go 1.22+
- chi Router
- gorilla/websocket

### **Database**
- PostgreSQL 16
- SQL migrations via Golang-Migrate

### **Infrastructure**
- Docker & Docker Compose

---

## 📂 Project Structure

```bash
repo/
├── server/                 # Go backend (API + WebSocket)
│   ├── cmd/api/main.go     # Entry point
│   ├── internal/           # Config, DB, auth, routes, WS hub
│   └── migrations/         # SQL migrations
├── web/                    # Next.js frontend
│   ├── src/app/            # App Router pages (login/chat)
│   ├── src/lib/            # API + WebSocket helpers
│   └── package.json
├── docker-compose.yml
├── Makefile
└── .env.example


