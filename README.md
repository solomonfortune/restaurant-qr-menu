# QR Menu System

A full-stack QR code digital restaurant menu and ordering platform built with the MERN stack. Restaurant owners can manage menu categories, dishes, tables, and incoming orders from an admin dashboard, while customers scan a table QR code to browse the menu and place orders directly from their phones.

## Overview

Traditional paper menus are slow to update, expensive to reprint, and awkward to maintain. This project replaces them with QR-powered digital menus that are mobile-friendly, easier to manage, and better suited for modern restaurant operations.

With this system:

- Customers scan a QR code at their table
- The QR code opens a menu page tied to that table and restaurant
- Customers browse dishes, add items to cart, and submit orders
- Restaurant owners receive and manage those orders in a live admin dashboard

## Demo Credentials

After seeding the database, use these demo admin credentials:

- Email: `admin@digitaldiner.com`
- Password: `password123`

## Features

### Customer Experience

- Scan-to-open QR menu flow
- Mobile-first digital restaurant menu
- Category-based browsing
- Dish cards with pricing, preparation time, popularity badges, and availability states
- Cart drawer with quantity controls
- Customer order notes
- Order success confirmation page

### Admin Experience

- Owner registration and login with JWT authentication
- Dashboard with daily stats and recent orders
- Category management
- Menu item management with image upload support
- Availability toggle for menu items
- Live order board with status updates
- Table management and QR code generation
- QR code printing support

### Backend Capabilities

- REST API built with Express
- MongoDB data modeling with Mongoose
- Password hashing with bcryptjs
- JWT-based route protection
- Cloudinary-ready image uploads via multer
- Seed script for demo restaurant data

## Tech Stack

### Frontend

- React
- React Router DOM v6
- Tailwind CSS
- Axios
- react-qr-code
- react-scripts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs
- multer
- Cloudinary
- cors
- dotenv
- nodemon

## Project Structure

```text
qr-menu-system/
+-- backend/
¦   +-- config/
¦   +-- controllers/
¦   +-- middleware/
¦   +-- models/
¦   +-- routes/
¦   +-- utils/
¦   +-- .env
¦   +-- .env.example
¦   +-- package.json
¦   +-- seed.js
¦   +-- server.js
+-- frontend/
¦   +-- public/
¦   +-- src/
¦   ¦   +-- api/
¦   ¦   +-- components/
¦   ¦   +-- context/
¦   ¦   +-- pages/
¦   ¦   +-- App.jsx
¦   ¦   +-- index.css
¦   ¦   +-- index.js
¦   ¦   +-- main.jsx
¦   +-- .env
¦   +-- package.json
¦   +-- postcss.config.js
¦   +-- tailwind.config.js
+-- README.md
```

## Screens and Modules

### Admin Pages

- `LoginPage`: owner login and registration flow
- `DashboardPage`: orders today, revenue, menu item count, pending orders, recent orders
- `CategoryPage`: create, edit, and delete categories
- `MenuManagementPage`: add, update, delete, and toggle menu items
- `OrdersPage`: live order board grouped by status
- `TablesPage`: create tables and generate QR codes

### Customer Pages

- `MenuPage`: public menu linked to a restaurant and table number
- `OrderSuccessPage`: confirmation screen after placing an order

## How It Works

### Admin Flow

1. Restaurant owner creates an account or logs in
2. Owner creates categories such as Starters, Drinks, and Desserts
3. Owner adds menu items under those categories
4. Owner creates restaurant tables
5. The system generates QR codes for each table
6. Owner prints and places the QR codes on tables

### Customer Flow

1. Customer scans a table QR code
2. Customer lands on the public menu page for that restaurant
3. Customer browses dishes by category
4. Customer adds items to cart
5. Customer places an order with an optional note
6. Owner sees the order in the admin dashboard

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image uploads
- Git

## Environment Variables

### Backend

Create `backend/.env` using `backend/.env.example` as a guide:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
```

### Backend Variable Notes

- `PORT`: API server port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign auth tokens
- `JWT_EXPIRE`: token expiry duration
- `CLOUDINARY_*`: Cloudinary credentials used for dish image uploads
- `FRONTEND_URL`: URL used when generating QR code links

### Frontend

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend Variable Notes

- `REACT_APP_API_URL`: base URL for the backend API

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/qr-menu-system.git
cd qr-menu-system
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Database Seeding

To create demo data:

```bash
cd backend
npm run seed
```

This creates:

- 1 demo restaurant owner
- 4 menu categories
- 12 sample menu items
- 5 sample tables with QR links

## Running the Project

You need two terminals: one for the backend and one for the frontend.

### Start the backend

```bash
cd backend
npm run dev
```

Expected API URL:

- `http://localhost:5000`

### Start the frontend

```bash
cd frontend
npm start
```

Expected app URL:

- `http://localhost:3000`

### Frontend Script Notes

The project currently includes two frontend run modes:

- `npm start`: builds the frontend and serves the production build locally on port `3000`
- `npm run dev`: runs the CRA development server

`npm start` is the more reliable option in this environment.

## Quick Start

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

## API Reference

### Auth

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register a restaurant owner |
| POST | `/api/auth/login` | No | Login a restaurant owner |
| GET | `/api/auth/me` | Yes | Get current logged-in owner |

### Categories and Menu

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| GET | `/api/menu/public?ownerId=<ownerId>` | No | Get public menu for customers |
| GET | `/api/menu/categories` | Yes | Get owner categories |
| POST | `/api/menu/categories` | Yes | Create category |
| PUT | `/api/menu/categories/:id` | Yes | Update category |
| DELETE | `/api/menu/categories/:id` | Yes | Delete category |
| GET | `/api/menu/items` | Yes | Get owner menu items |
| POST | `/api/menu/items` | Yes | Create menu item |
| PUT | `/api/menu/items/:id` | Yes | Update menu item |
| DELETE | `/api/menu/items/:id` | Yes | Delete menu item |
| PATCH | `/api/menu/items/:id/toggle` | Yes | Toggle menu item availability |

### Orders

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | `/api/orders` | No | Create customer order |
| GET | `/api/orders` | Yes | Get all owner orders |
| GET | `/api/orders/stats` | Yes | Get dashboard statistics |
| PATCH | `/api/orders/:id/status` | Yes | Update order status |

### Tables

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| GET | `/api/tables` | Yes | Get restaurant tables |
| POST | `/api/tables` | Yes | Create table and QR URL |
| PUT | `/api/tables/:id` | Yes | Update table |
| DELETE | `/api/tables/:id` | Yes | Delete table |

## Sample QR Code URL Format

Each table QR code points to a public menu URL like:

```text
http://localhost:3000/menu?table=1&owner=<ownerId>
```

For phone testing on the same Wi-Fi network, replace `localhost` with your machine's LAN IP in `backend/.env`:

```env
FRONTEND_URL=http://YOUR_LOCAL_IP:3000
```

Example:

```env
FRONTEND_URL=http://172.16.27.133:3000
```

Then restart the backend and regenerate the table QR codes.

## Deployment Guide

### Frontend Deployment

You can deploy the frontend to:

- Vercel
- Netlify
- Render Static Site

Recommended settings:

- Build command: `npm run build`
- Output directory: `build`
- Environment variable: `REACT_APP_API_URL=<your deployed backend URL>/api`

### Backend Deployment

You can deploy the backend to:

- Render
- Railway
- Cyclic
- Any Node.js-compatible VPS or cloud platform

Recommended settings:

- Start command: `npm start`
- Add all backend environment variables in the deployment dashboard
- Make sure MongoDB Atlas network access allows your backend host

### Database Deployment

- Use MongoDB Atlas for production
- Create a production database user
- Restrict IP/network access where possible
- Store all credentials in environment variables only

## Security Notes

- Passwords are hashed with bcryptjs before storage
- JWT is used to protect admin-only routes
- Admin routes require a valid bearer token
- Secrets are loaded from environment variables
- Passwords are excluded from API responses
- CORS is restricted using the configured frontend URL

## Current Limitations

This project is functional, but there are a few things you may want to improve before production use:

- No payment gateway integration yet
- No kitchen display screen or waiter-specific role
- No order history filtering by date range
- No image optimization pipeline beyond Cloudinary upload
- No automated test suite yet
- Browser notifications depend on client permission settings

## Troubleshooting

### Frontend does not open on `localhost:3000`

- Make sure you ran `npm start` inside `frontend`
- Wait until you see `Accepting connections at http://localhost:3000`
- If port `3000` is busy, stop the other process using it

### QR code scans but nothing opens on phone

- Do not use `localhost` in QR code URLs for phone testing
- Set `FRONTEND_URL` in `backend/.env` to your computer's LAN IP
- Ensure your phone and computer are on the same network
- Restart the backend and recreate the table QR code after changing `FRONTEND_URL`

### Public menu loads but shows no items

- Confirm categories exist
- Confirm menu items exist
- Confirm menu items are marked available
- Confirm the QR code owner ID belongs to a real restaurant user

### Login fails

- Check MongoDB connection
- Confirm the user exists in the database
- Re-run `npm run seed` if you want the demo account back

### Image upload fails

- Verify your Cloudinary credentials
- Make sure all three Cloudinary environment variables are set

### CORS errors appear in the browser

- Check that `FRONTEND_URL` in backend matches the actual frontend URL exactly
- Restart the backend after changing environment variables

## Future Improvements

- Add waiter and kitchen staff roles
- Add payment integration
- Add order search and analytics filters
- Add restaurant branding customization
- Add multi-branch restaurant support
- Add printable receipts and kitchen tickets
- Add automated testing and CI/CD

## Prompt Review Notes

This project started from a generated build prompt and a few implementation adjustments were made during development:

- The prompt requested `react-scripts` but also referenced `src/main.jsx`; this project includes both `src/index.js` and `src/main.jsx`
- Tailwind support was added alongside the required Tailwind config files
- Category uniqueness was implemented per restaurant owner rather than globally across all restaurants
- The frontend run script was adjusted for this Windows environment so local startup is more reliable

## Contributing

If you want to extend this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Open a pull request

## License

This project is currently unlicensed. You can replace this section with your preferred license, for example MIT.

## Author

Built as a full-stack QR menu and restaurant ordering system using JavaScript, React, Node.js, Express, and MongoDB.
