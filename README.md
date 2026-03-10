# Temple Darshan Booking System

A full-stack web application that allows devotees to book darshan slots for temples, manage bookings, and download QR-based tickets.
The platform also includes an **admin dashboard** for temple management, user management, and revenue analytics.

This project demonstrates a **modern full-stack architecture** using React, Node.js, Express, MongoDB, and JWT authentication.

---

# Project Overview

The Temple Darshan Booking System simplifies the process of visiting temples by allowing users to reserve darshan slots online.

Devotees can:

* Browse temples
* View available darshan slots
* Book a slot for a specific date
* Add devotee details
* Receive a ticket with QR code
* Download the ticket for entry verification

Administrators can manage temples, users, bookings, and platform statistics from a centralized dashboard.

---

# Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Bootstrap
* Context API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cookie-based authentication
* QR code generation

---

# System Architecture

Frontend (React)
→ API Requests (Axios)
→ Backend (Express REST API)
→ Database (MongoDB)

Authentication Flow:
User Login → JWT generated → stored in cookies → used for protected routes.

---

# Key Features

## User Features

### Authentication

* User registration
* Login with JWT authentication
* Cookie-based session handling

### Temple Discovery

Users can browse temples and view:

* Temple description
* Location
* Available darshan slots

### Slot Booking

Users can:

* Select a darshan slot
* Choose visit date
* Enter devotee details
* Confirm booking

### Ticket Generation

After booking confirmation:

* A QR-based ticket is generated
* Users can download the ticket
* The QR code can be scanned at temple entry

### Booking Management

Each booking includes:

* Slot information
* Devotee details
* Visit date
* Ticket with QR code

---

# Admin Features

Administrators have access to a dashboard where they can manage the platform.

## Admin Dashboard

Displays platform statistics:

* Total users
* Total temples
* Total bookings
* Total revenue

## Temple Management

Admin can:

* Create new temples
* Update temple information
* Delete temples
* Upload temple images

## User Management

Admin can:

* View all users
* Update user roles
* Promote users to organizer/admin

## Booking Monitoring

Admin can:

* View all bookings
* Monitor booking status
* Track temple revenue

## Revenue Analytics

Revenue is calculated temple-wise for better insights into booking performance.

---

# Booking Workflow

1. User logs into the system
2. User selects a temple
3. Available darshan slots are displayed
4. User selects a slot
5. User fills devotee details
6. Booking is created
7. QR-based ticket is generated
8. User downloads the ticket

---

# API Endpoints (Example)

## Authentication

POST /api/v1/auth/register
POST /api/v1/auth/login

## Temples

GET /api/v1/temples
POST /api/v1/temples
PATCH /api/v1/temples/:id
DELETE /api/v1/temples/:id

## Slots

GET /api/v1/slots
POST /api/v1/slots

## Bookings

POST /api/v1/bookings
GET /api/v1/bookings/:id/ticket

## Admin

GET /api/v1/admin/dashboard
GET /api/v1/admin/users
PATCH /api/v1/admin/users/update-role/:id
GET /api/v1/admin/bookings
GET /api/v1/admin/temple-revenue

---

# Folder Structure

Frontend

src/
components/
pages/
api/
context/
App.jsx

Backend

controllers/
routes/
models/
middleware/
utils/
server.js

---

# Installation

Clone the repository:

git clone https://github.com/Santosh-kumar-sah/DarshanEaseMandir/tree/TempleBooking

Install dependencies:

Frontend
npm install

Backend
npm install

Run the backend server:

npm run dev

Run the frontend:

npm run dev

---

# Screens in the Application

Home Page
Temple Details Page
Slot Booking Page
Devotee Entry Form
Ticket Download Page
Admin Dashboard
Temple Management
User Management

---

# Security Features

* JWT authentication
* Cookie-based sessions
* Role-based authorization
* Protected API routes
* Input validation

---

# Future Improvements

Several advanced features can be implemented to enhance the platform.

## Payment Integration

Add online payment options using:

* Stripe
* Razorpay
* PayPal

## Organizer Dashboard

Allow temple organizers to:

* Create darshan slots
* Manage temple schedules
* Track bookings

## Live Slot Availability

Use WebSockets to update seat availability in real time.

## Email Notifications

Send booking confirmations via email.

## SMS Alerts

Notify devotees about their darshan schedule.





## Analytics Dashboard

Provide detailed analytics such as:

* Daily bookings
* Revenue trends
* Visitor statistics



## Multi-language Support

Support multiple Indian languages.

---

# Contribution

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Submit a pull request

---





---

# Author

Santosh
Full Stack Web Developer
