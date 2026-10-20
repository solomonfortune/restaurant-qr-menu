# QR Menu System

A full-stack QR code-based digital menu and ordering platform for restaurants. Customers scan a table QR code to view a digital menu, place orders, and track order status, while restaurant staff manage menu items, categories, tables, and incoming orders from an admin dashboard.

This project is built with React on the frontend, Node.js/Express on the backend, and MongoDB for persistent data storage.

## Overview

The application is designed for restaurants that want a modern contactless dining experience without requiring customers to download an app.

- Customers can browse restaurant menus by table
- Orders can be placed directly from a browser
- Admin users can log in to manage the restaurant catalog
- QR codes can be generated for each dining table
- Order statuses can be reviewed and updated by staff

## Features

### Customer Experience
- QR-based table menu access
- Customer-facing digital menu with categories and pricing
- Add-to-cart and order placement flow
- Order confirmation page
- Table-aware menu access via query parameters

### Admin Experience
- Secure admin login using JWT authentication
- Dashboard overview for statistics and activity
- Menu item management
- Category management
- Table management with QR code generation
- Order tracking and status updates
- Cloudinary-ready image support for menu items

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- QR code rendering support
- React Scripts

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs password hashing
- Cloudinary for media uploads
- CORS and dotenv support

### Database
- MongoDB

## Repository Structure

```text
restaurant-qr-menu/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── build/
├── .gitignore
├── README.md
├── package-lock.json
└── .github/
```

## Application Flow

### Customer side
Customers access the menu through a QR link such as:

```text
http://localhost:3000/menu?table=1&owner=<restaurant-owner-id>
```

This is generated from the table record and points the customer to the menu page for that specific table.

### Admin side
Admin users log in at:

```text
http://localhost:3000/admin/login
```

After authentication, staff can manage:
- Dashboard overview
- Menu items
- Categories
- Table QR codes
- Orders

## Default Routes

### Frontend routes
- `/` → redirects to `/admin/login`
- `/menu` → customer menu page
- `/order-success` → order confirmation page
- `/admin/login` → admin login
- `/admin/register` → admin registration
- `/admin/dashboard` → admin overview
- `/admin/menu` → menu management
- `/admin/categories` → category management
- `/admin/orders` → order list and updates
- `/admin/tables` → table management and QR generation

### Backend API routes

#### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

#### Menu
- `GET /api/menu/public`
- `GET /api/menu/categories` (protected)
- `POST /api/menu/categories` (protected)
- `PUT /api/menu/categories/:id` (protected)
- `DELETE /api/menu/categories/:id` (protected)
- `GET /api/menu/items` (protected)
- `POST /api/menu/items` (protected)
- `PUT /api/menu/items/:id` (protected)
- `DELETE /api/menu/items/:id` (protected)
- `PATCH /api/menu/items/:id/toggle` (protected)

#### Orders
- `POST /api/orders`
- `GET /api/orders` (protected)
- `PATCH /api/orders/:id/status` (protected)
- `GET /api/orders/stats` (protected)

#### Tables
- `GET /api/tables` (protected)
- `POST /api/tables` (protected)
- `PUT /api/tables/:id` (protected)
- `DELETE /api/tables/:id` (protected)

## Environment Configuration

### Backend
Create a `backend/.env` file based on `backend/.env.example`:

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

The project includes a default example file:

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

### Frontend
Create a `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/solomonfortune/restaurant-qr-menu.git
cd restaurant-qr-menu
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

### 4. Start MongoDB
Make sure your MongoDB instance is running and the connection string in `backend/.env` is valid.

### 5. Seed the database
From the `backend` directory:

```bash
npm run seed
```

This script creates sample restaurant data, including an admin account.

### 6. Start the backend

```bash
cd backend
npm run dev
```

The API runs by default on:

```text
http://localhost:5000
```

### 7. Start the frontend
Open a new terminal and run:

```bash
cd frontend
npm start
```

The React app runs by default on:

```text
http://localhost:3000
```

## Default Admin Credentials

After running the seed script, use the following login:

- Email: `admin@digitaldiner.com`
- Password: `password123`

## Available Scripts

### Backend scripts
```bash
npm start
```
Runs the app in production mode.

```bash
npm run dev
```
Runs the server with nodemon for live reload during development.

```bash
npm run seed
```
Seeds the database with demo restaurant data and an admin user.

### Frontend scripts
```bash
npm start
```
Starts the React development server.

```bash
npm run build
```
Builds the production bundle for deployment.

```bash
npm test
```
Runs project tests if configured.

## Notes

- The frontend expects the API at `http://localhost:5000/api` unless overridden by `REACT_APP_API_URL`.
- QR codes are generated using `FRONTEND_URL` and should point to the frontend URL where customers will access the menu.
- Cloudinary support is optional but required for menu-image uploads to function properly.
- This project is designed around a restaurant owner/admin model, where one admin manages menu items, categories, tables, and orders.

## Potential Future Enhancements

- Real-time order updates with WebSockets
- Payment integration
- Role-based staff accounts
- Printable kitchen tickets
- Sales analytics and dashboard reporting
- Multi-restaurant support

## License

This project is currently distributed without a formal license file. If you plan to publish or reuse it publicly, consider adding an appropriate open-source license such as MIT.

## Contributing

Contributions are welcome. For local development:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## Contact

For questions or collaboration, use the repository's GitHub issue tracker or contact the project owner through the repository profile.
