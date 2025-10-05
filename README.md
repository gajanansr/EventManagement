# 🎉 Event Management & Resource Allocation Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.17-green.svg)
![Angular](https://img.shields.io/badge/Angular-13+-red.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)

**A full-stack platform for event planning, resource allocation, staff management, and client collaboration**

[Quick Start](#-quick-start) • [Features](#-features) • [API Docs](#-api-quick-reference) • [Full Documentation](./README_FULL.md)

</div>

---

## 📋 Overview

A comprehensive event management solution with role-based access control, real-time messaging, resource allocation, and booking management.

###Users
- 👨‍💼 **Event Planners**: Create events, manage resources, assign staff, handle bookings
- 👷 **Staff Members**: View assigned events, update status, communicate with planners
- 👥 **Clients**: Book events, track bookings, communicate with planners

---

## ✨ Key Features

🔐 **JWT Authentication** • 👤 **Role-Based Access** • 📅 **Event CRUD** • 📦 **Resource Management**  
🎯 **Resource Allocation** • 📝 **Booking System** • 💬 **Real-time Messaging** • 📊 **Dashboards**  
🎨 **Material Design** • 📱 **Responsive UI** • 🔒 **BCrypt Security** • ⚡ **RESTful APIs**

---

## 🛠️ Technology Stack

### Backend
- **Spring Boot 2.7.17** - Application framework
- **Spring Security** - Authentication & authorization
- **JPA/Hibernate** - ORM
- **MySQL 8.0** - Database
- **JWT** - Token-based auth
- **Maven** - Build tool

### Frontend
- **Angular 13+** - Frontend framework
- **TypeScript** - Language
- **RxJS** - Reactive programming
- **Bootstrap 5** - UI framework
- **Material Design** - Design system

---

## 🚀 Quick Start

### Prerequisites
```bash
Java 11+, Node.js 14+, MySQL 8.0+, Maven 3.8+
```

### Backend Setup
```bash
# Clone repository
git clone https://github.com/gajanansr/EventManagement.git
cd EventManagement/server

# Configure MySQL (create database 'event_management')
# Update server/src/main/resources/application.properties with your credentials

# Build and run
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup
```bash
cd client
npm install
npm start
```
Frontend runs on `http://localhost:4200`

---

## 🗄️ Database Schema

```
users (userId, username, password, email, role, phoneNumber, fullName, address)
  └── 1:N ──► events (eventID, title, description, dateTime, location, status, assignedStaffId)
                 └── 1:N ──► allocations (allocationID, eventID, resourceID, quantity)
                                └── N:1 ──► resources (resourceID, name, type, availability)

users (CLIENT) ──► bookings (bookingId, clientId, eventId, requirements, notes, status)
users/events ──► messages (messageId, eventId, senderId, content, timestamp, senderRole)
```

**Full ER Diagram**: See [README_FULL.md](./README_FULL.md#database-schema)

---

## 📡 API Quick Reference

### Authentication
```http
POST /api/user/register     # Register new user
POST /api/user/login         # Login and get JWT token
```

### Event Planner APIs
```http
POST   /api/planner/event                    # Create event
GET    /api/planner/events                   # Get all events
GET    /api/planner/event-details/{id}       # Get event details
DELETE /api/planner/event/{id}               # Delete event
POST   /api/planner/resource                 # Add resource
GET    /api/planner/resources                # Get all resources
POST   /api/planner/allocate-resources       # Allocate resource to event
GET    /api/planner/staff                    # Get all staff
POST   /api/planner/assign-staff             # Assign staff to event
POST   /api/planner/send-message             # Send message
GET    /api/planner/messages/{eventId}       # Get event messages
GET    /api/planner/bookings                 # Get all bookings
PUT    /api/planner/booking/{id}/status      # Update booking status
```

### Staff APIs
```http
GET  /api/staff/allEvents               # Get assigned events only
GET  /api/staff/event-details/{id}      # Get event details
PUT  /api/staff/update-setup/{id}       # Update event status
POST /api/staff/send-message            # Send message
GET  /api/staff/messages/{eventId}      # Get event messages
```

### Client APIs
```http
POST /api/client/create-booking              # Create booking
GET  /api/client/my-bookings                 # Get my bookings
GET  /api/client/my-booking/{id}             # Get booking by ID
GET  /api/client/allEvents                   # Get all events
POST /api/client/send-message                # Send message
GET  /api/client/messages/{eventId}          # Get event messages
```

### Profile APIs
```http
GET /api/profile      # Get user profile
PUT /api/profile      # Update profile
```

**Authorization**: All protected endpoints require `Authorization: Bearer <jwt_token>` header

**Complete API Documentation**: See [README_FULL.md](./README_FULL.md#complete-api-reference) for detailed request/response examples

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Angular Frontend (Client Layer)                            │
│  Components → Services → HTTP Requests + JWT                │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────▼────────────────────────────────────┐
│  Spring Boot Backend (Server Layer)                         │
│  Security Filter → Controllers → Services → Repositories    │
└────────────────────────┬────────────────────────────────────┘
                         │ JPA/Hibernate
┌────────────────────────▼────────────────────────────────────┐
│  MySQL Database (Data Layer)                                │
│  Tables: users, events, resources, allocations, bookings... │
└─────────────────────────────────────────────────────────────┘
```

**Detailed Architecture Diagrams**: See [README_FULL.md](./README_FULL.md#architecture-diagrams)

---

## 🔒 Security

- ✅ JWT-based authentication with 24-hour expiration
- ✅ BCrypt password hashing (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ SQL injection protection (JPA parameterized queries)
- ✅ Password validation (8-20 chars, uppercase, lowercase, number, special char)

---

## 📖 Usage Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"Test@123","role":"CLIENT"}'

# Login
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"Test@123"}'
```

### 2. Create Event (Planner)
```bash
curl -X POST http://localhost:8080/api/planner/event \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Tech Conference",
    "description":"Annual tech event",
    "dateTime":"2025-12-15T10:00:00",
    "location":"Convention Center",
    "status":"Active"
  }'
```

### 3. Create Booking (Client)
```bash
curl -X POST http://localhost:8080/api/client/create-booking \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId":1,
    "requirements":"Wheelchair access needed",
    "notes":"VIP table requested"
  }'
```

---

## 📁 Project Structure

```
EventManagement/
├── server/                          # Spring Boot Backend
│   ├── src/main/java/.../
│   │   ├── config/                  # Security & configurations
│   │   ├── controller/              # REST controllers
│   │   ├── dto/                     # Data transfer objects
│   │   ├── entity/                  # JPA entities
│   │   ├── jwt/                     # JWT utilities
│   │   ├── repository/              # JPA repositories
│   │   └── service/                 # Business logic
│   ├── src/main/resources/
│   │   └── application.properties   # App configuration
│   └── pom.xml                      # Maven dependencies
│
├── client/                          # Angular Frontend
│   ├── src/app/
│   │   ├── login/                   # Login component
│   │   ├── registration/            # Registration component
│   │   ├── dashbaord/               # Dashboard (role-specific)
│   │   ├── create-event/            # Event creation
│   │   ├── view-events/             # Event listing & messaging
│   │   ├── add-resource/            # Resource management
│   │   ├── resource-allocate/       # Resource allocation
│   │   ├── booking-details/         # Client bookings
│   │   └── app-routing.module.ts    # Routes
│   ├── src/services/
│   │   ├── auth.service.ts          # Authentication service
│   │   └── http.service.ts          # HTTP API service
│   ├── src/styles.scss              # Global styles
│   └── package.json                 # npm dependencies
│
├── README.md                        # This file
├── README_FULL.md                   # Complete documentation
└── .gitignore
```

---

## 🐛 Troubleshooting

**MySQL Connection Error**
```bash
# Check MySQL is running
sudo systemctl status mysql
# Verify credentials in application.properties
```

**Port 8080 Already in Use**
```bash
# Change port in application.properties
server.port=8081
```

**CORS Error**
```bash
# Verify SecurityConfig.java allows your frontend origin
# Check environment.ts has correct backend URL
```

**JWT Token Expired**
```bash
# Re-login to get new token (tokens expire after 24 hours)
# Adjust jwt.expiration in application.properties if needed
```

---

## 📚 Documentation

- **[README_FULL.md](./README_FULL.md)** - Complete technical documentation
  - Detailed architecture diagrams
  - Complete database schema with SQL
  - Full API reference with request/response examples
  - Performance metrics
  - Development best practices

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📧 Contact

- **Repository**: [github.com/gajanansr/EventManagement](https://github.com/gajanansr/EventManagement)
- **Issues**: [Report Bug / Request Feature](https://github.com/gajanansr/EventManagement/issues)

---

## 📄 License

MIT License - see LICENSE file for details

---

<div align="center">

**Built with ❤️ using Spring Boot & Angular**

⭐ Star this repo if you find it helpful!

[Back to Top](#-event-management--resource-allocation-platform)

</div>
