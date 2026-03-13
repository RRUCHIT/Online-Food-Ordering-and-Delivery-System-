
# FoodHub - Online Food Ordering System

A full-stack MERN (MongoDB, Express, React, Node.js) application for online food ordering and delivery.

## Features

- **Customer**: Browse restaurants, add items to cart, place orders, view order history, and submit complaints.
- **Admin**: Dashboard with revenue stats, active user count, and complaint management.
- **Restaurant**: Manage menus, handle incoming orders, and view sales history.

## Prerequisites

- Node.js installed
- MongoDB database (local or Atlas)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RRUCHIT/Online-Food-Ordering-and-Delivery-System-.git
cd Online-Food-Ordering-and-Delivery-System-
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder (see `.env.example` for the required variables).
- Update the `MONGO_URI` with your database connection string.

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ..
npm install
npm run dev
```

## Technologies Used

- **Frontend**: React, Tailwind CSS, Lucide icons, Sonner (for notifications).
- **Backend**: Node.js, Express, MongoDB with Mongoose, JWT (for authentication), bcryptjs.
  