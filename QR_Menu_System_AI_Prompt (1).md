# 🍽️ AI Build Prompt: QR Code Digital Restaurant Menu System
> Copy and paste this entire prompt into any AI coding assistant (Claude, Cursor, ChatGPT, Copilot, etc.)

---

## YOUR TASK

You are a senior full-stack JavaScript developer. Build a complete, fully functional **QR Code Digital Restaurant Menu System** from scratch using the MERN stack (MongoDB, Express.js, React.js, Node.js). This system eliminates the need for physical paper menus in restaurants. Customers simply scan a QR code at their table using their smartphone camera and are instantly directed to a beautiful, mobile-optimised digital menu where they can browse dishes and place orders. Restaurant owners manage everything through a secure admin dashboard.

Do NOT use TypeScript. Write everything in plain JavaScript. Do NOT skip any file. Generate complete, working code for every single file mentioned.

---

## TECH STACK (DO NOT DEVIATE)

| Layer             | Technology                          |
|-------------------|-------------------------------------|
| Frontend          | React JS (Create React App or Vite) |
| Routing           | React Router DOM v6                 |
| Styling           | Tailwind CSS                        |
| QR Code           | react-qr-code                       |
| HTTP Requests     | Axios                               |
| Backend           | Node.js + Express.js                |
| Database          | MongoDB with Mongoose               |
| Authentication    | JWT (jsonwebtoken) + bcryptjs       |
| Image Uploads     | Cloudinary + multer                 |
| Environment Vars  | dotenv                              |
| CORS              | cors middleware                     |
| Dev Server        | nodemon                             |

---

## PROJECT FOLDER STRUCTURE

Generate the following exact folder and file structure. Every file must contain complete, working code:

```
qr-menu-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection using Mongoose
│   │
│   ├── controllers/
│   │   ├── authController.js      # register, login logic
│   │   ├── menuController.js      # CRUD for menu items and categories
│   │   ├── orderController.js     # create order, get orders, update order status
│   │   └── tableController.js     # create tables, get QR code URLs per table
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification middleware
│   │   └── uploadMiddleware.js    # multer + cloudinary upload handler
│   │
│   ├── models/
│   │   ├── User.js                # restaurant owner account
│   │   ├── MenuItem.js            # individual dish
│   │   ├── Category.js            # menu category (e.g. Starters, Mains)
│   │   ├── Order.js               # customer order with items and table
│   │   └── Table.js               # restaurant table with QR code URL
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── tableRoutes.js
│   │
│   ├── utils/
│   │   └── cloudinary.js          # Cloudinary config and upload helper
│   │
│   ├── .env                       # environment variables (see below)
│   ├── .env.example               # example env file with placeholder keys
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with base URL + auth header
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MenuItemCard.jsx   # card shown to customer for each dish
│   │   │   ├── CategoryTabs.jsx   # horizontal tabs to filter by category
│   │   │   ├── CartDrawer.jsx     # slide-out cart for customer
│   │   │   ├── OrderCard.jsx      # order summary card in admin panel
│   │   │   ├── QRCodeCard.jsx     # displays QR code for a table
│   │   │   ├── ProtectedRoute.jsx # wraps admin routes, redirects if not logged in
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # login state, JWT token, user info
│   │   │   └── CartContext.jsx    # customer cart state (items, total, table number)
│   │   │
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   │   ├── MenuPage.jsx       # main customer-facing menu page
│   │   │   │   └── OrderSuccessPage.jsx # shown after order is placed
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── LoginPage.jsx          # admin login form
│   │   │       ├── DashboardPage.jsx      # overview: total orders, revenue, items
│   │   │       ├── MenuManagementPage.jsx # list, add, edit, delete menu items
│   │   │       ├── CategoryPage.jsx       # manage categories
│   │   │       ├── OrdersPage.jsx         # live orders with status updates
│   │   │       └── TablesPage.jsx         # manage tables and generate QR codes
│   │   │
│   │   ├── App.jsx                # all routes defined here
│   │   ├── main.jsx               # entry point
│   │   └── index.css              # Tailwind directives
│   │
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md                      # full setup and run instructions
```

---

## BACKEND — DETAILED REQUIREMENTS

### server.js
- Import express, cors, dotenv, and all route files
- Connect to MongoDB using the `db.js` config
- Use `express.json()` and `cors()` middleware
- Mount routes at:
  - `/api/auth` → authRoutes
  - `/api/menu` → menuRoutes
  - `/api/orders` → orderRoutes
  - `/api/tables` → tableRoutes
- Listen on `PORT` from `.env`, default to 5000
- Log "Server running on port X" and "MongoDB connected" on startup

### config/db.js
- Use `mongoose.connect()` with the `MONGO_URI` from `.env`
- Export as an async function called `connectDB`
- Handle and log connection errors

### Models

**User.js**
```
Fields: name (String, required), email (String, required, unique), 
password (String, required), restaurantName (String, required), 
createdAt (Date, default: Date.now)
Pre-save hook: hash password using bcryptjs with salt rounds of 10
Add a method: comparePassword(candidatePassword) → returns boolean
```

**Category.js**
```
Fields: name (String, required, unique), description (String), 
image (String), owner (ObjectId ref User, required), 
isActive (Boolean, default: true), createdAt (Date)
```

**MenuItem.js**
```
Fields: name (String, required), description (String, required), 
price (Number, required), image (String), 
category (ObjectId ref Category, required), 
owner (ObjectId ref User, required), 
isAvailable (Boolean, default: true), 
isPopular (Boolean, default: false),
preparationTime (Number, in minutes),
allergens ([String]),
createdAt (Date, default: Date.now)
```

**Table.js**
```
Fields: tableNumber (Number, required), 
label (String, e.g. "Window Table"), 
qrCodeUrl (String — the full URL to the menu page for this table),
owner (ObjectId ref User, required), 
isActive (Boolean, default: true), 
createdAt (Date)
```

**Order.js**
```
Fields: 
tableNumber (Number, required), 
tableId (ObjectId ref Table),
items: [{ menuItem (ObjectId ref MenuItem), name (String), price (Number), quantity (Number) }],
totalAmount (Number, required),
status (String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending'),
customerNote (String),
owner (ObjectId ref User, required),
createdAt (Date, default: Date.now)
```

### Controllers

**authController.js** — implement these functions:
- `register(req, res)`: validate input, check if email exists, create user, return JWT
- `login(req, res)`: find user by email, compare password, return JWT + user info (no password)
- `getMe(req, res)`: return current logged-in user from token (protected route)

**menuController.js** — implement:
- `getCategories(req, res)`: return all active categories for the logged-in owner
- `createCategory(req, res)`: create new category linked to owner
- `updateCategory(req, res)`: update by ID, only if owner matches
- `deleteCategory(req, res)`: delete by ID, only if owner matches
- `getMenuItems(req, res)`: return all menu items for the owner, populated with category name
- `getPublicMenu(req, res)`: PUBLIC route — takes `ownerId` as query param, returns all available menu items grouped by category. This is what the customer sees.
- `createMenuItem(req, res)`: create menu item with image upload via Cloudinary
- `updateMenuItem(req, res)`: update by ID
- `deleteMenuItem(req, res)`: delete by ID
- `toggleAvailability(req, res)`: toggle `isAvailable` boolean

**orderController.js** — implement:
- `createOrder(req, res)`: PUBLIC route — customer places order. Validate table exists, calculate total, save order linked to the restaurant owner
- `getOrders(req, res)`: return all orders for the owner sorted by newest first, populate menu item names
- `updateOrderStatus(req, res)`: update status by order ID (admin only)
- `getDashboardStats(req, res)`: return total orders today, total revenue today, total menu items, pending orders count

**tableController.js** — implement:
- `createTable(req, res)`: create table, generate `qrCodeUrl` as `${FRONTEND_URL}/menu?table=${tableNumber}&owner=${ownerId}`, save to DB
- `getTables(req, res)`: return all tables for the owner
- `updateTable(req, res)`: update table label or number
- `deleteTable(req, res)`: delete table

### Middleware

**authMiddleware.js**
- Verify `Authorization: Bearer <token>` header
- Decode JWT using `JWT_SECRET` from `.env`
- Attach `req.user` with the user's `_id` and `email`
- Return 401 if token missing or invalid

**uploadMiddleware.js**
- Use `multer` with memory storage (no disk writes)
- Export a `upload` middleware for single file (`image` field)
- Export an `uploadToCloudinary(buffer)` function that uploads to Cloudinary and returns the secure URL

### Routes

**authRoutes.js**: POST /register, POST /login, GET /me (protected)
**menuRoutes.js**: 
  - GET /public → getPublicMenu (no auth)
  - All others → protected with authMiddleware
  - GET, POST /categories
  - PUT, DELETE /categories/:id
  - GET, POST /items
  - PUT, DELETE /items/:id
  - PATCH /items/:id/toggle
**orderRoutes.js**: 
  - POST / → createOrder (public)
  - GET / → getOrders (protected)
  - PATCH /:id/status → updateOrderStatus (protected)
  - GET /stats → getDashboardStats (protected)
**tableRoutes.js**: All protected — GET /, POST /, PUT /:id, DELETE /:id

### .env file (provide .env.example with these keys)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
```

---

## FRONTEND — DETAILED REQUIREMENTS

### App.jsx — Define ALL routes
```
Public routes:
  /menu                     → MenuPage (customer menu, reads ?table=X&owner=Y from URL)
  /order-success            → OrderSuccessPage

Admin routes (all wrapped in ProtectedRoute):
  /admin/login              → LoginPage
  /admin/dashboard          → DashboardPage
  /admin/menu               → MenuManagementPage
  /admin/categories         → CategoryPage
  /admin/orders             → OrdersPage
  /admin/tables             → TablesPage

Default redirect: / → /admin/login
```

### AuthContext.jsx
- Store: `user`, `token`, `isAuthenticated`, `loading`
- Functions: `login(email, password)`, `logout()`, `register(...)`
- Persist token in `localStorage`
- On app load, check localStorage for token and validate it
- Wrap the entire app in this context

### CartContext.jsx
- Store: `items` (array), `tableNumber`, `ownerId`, `isCartOpen`
- Functions: `addItem(item)`, `removeItem(itemId)`, `updateQuantity(itemId, qty)`, `clearCart()`, `openCart()`, `closeCart()`
- Compute derived values: `totalItems`, `totalPrice`

### api/axios.js
- Create Axios instance with `baseURL: process.env.REACT_APP_API_URL`
- Add request interceptor that attaches `Authorization: Bearer <token>` from localStorage automatically

### CUSTOMER PAGES

**MenuPage.jsx** — This is the most important page. Build it beautifully and mobile-first.
- On mount, read `table` and `owner` from URL query params using `useSearchParams`
- Fetch public menu from `GET /api/menu/public?ownerId=<owner>`
- Display restaurant name at the top
- Show horizontal scrollable `CategoryTabs` to filter items by category
- Display `MenuItemCard` components in a responsive grid (2 columns on mobile)
- Show a floating cart button at the bottom with item count badge
- When cart button is clicked, open `CartDrawer`
- `CartDrawer`: shows all cart items, quantities, subtotal, a customer note textarea, and a "Place Order" button
- On "Place Order": POST to `/api/orders` with `{ tableNumber, ownerId, items, customerNote }`
- On success: navigate to `/order-success`
- Handle loading state (show skeleton cards) and error state

**MenuItemCard.jsx**
- Show dish image (with fallback placeholder if no image)
- Show dish name, description (truncated to 2 lines), price, preparation time
- Show "Popular" badge if `isPopular` is true
- Show "Unavailable" overlay if `isAvailable` is false
- Show an "Add to Cart" button — on click adds item to CartContext
- If item is already in cart, show quantity controls (+ / -)

**OrderSuccessPage.jsx**
- Show a success animation (CSS-only checkmark animation)
- Show order confirmation message and table number
- Show "Your order has been received!" message
- Button to go back to the menu

### ADMIN PAGES

**LoginPage.jsx**
- Clean, centred login form with restaurant name branding
- Email and password fields with validation
- Show error message on failed login
- Redirect to `/admin/dashboard` on success
- Link to registration for new restaurants

**DashboardPage.jsx**
- Fetch stats from `GET /api/orders/stats`
- Show 4 stat cards: Total Orders Today, Revenue Today (UGX), Menu Items, Pending Orders
- Show a list of the 5 most recent orders with status badges
- Auto-refresh stats every 30 seconds using `setInterval`

**MenuManagementPage.jsx**
- Table listing all menu items with columns: image thumbnail, name, category, price, available (toggle switch), popular (badge), actions
- "Add New Item" button opens a modal/form with fields: name, description, price, category (dropdown), image upload, preparationTime, allergens, isPopular checkbox
- Edit button opens same form pre-filled
- Delete button with confirmation dialog
- Toggle availability directly from the table using a switch

**CategoryPage.jsx**
- List of categories with name and item count
- Add / edit / delete categories
- Simple form: category name and description

**OrdersPage.jsx**
- This is the live orders board. Display orders as cards grouped by status.
- Each card shows: table number, ordered items with quantities, total amount, time elapsed since order was placed, customer note
- Status dropdown on each card to update: pending → confirmed → preparing → ready → completed
- Status badges with colours: pending=yellow, confirmed=blue, preparing=orange, ready=green, completed=gray, cancelled=red
- Auto-refresh orders every 15 seconds
- Play a subtle browser notification sound or show a browser notification when a new "pending" order arrives

**TablesPage.jsx**
- Grid of `QRCodeCard` components, one per table
- `QRCodeCard.jsx`: shows table number, label, and a rendered QR code using `react-qr-code` pointing to the `qrCodeUrl`
- "Print QR Code" button on each card that opens a print-optimised version of just that QR code
- "Add Table" button with a form: table number, optional label
- Delete table button

**DashboardPage Sidebar/Navbar layout**
- All admin pages share a consistent layout:
  - Left sidebar (desktop) with navigation links: Dashboard, Menu Items, Categories, Orders, Tables, Logout
  - Top navbar showing restaurant name and logged-in user
  - On mobile: hamburger menu that slides sidebar in
  - Active link highlighted in sidebar

---

## UI / UX DESIGN REQUIREMENTS

- The system must be **mobile-first**. The customer menu page must look and work perfectly on a smartphone screen.
- Use **Tailwind CSS** for all styling. Do not write custom CSS except for animations.
- Color scheme suggestion: use a warm food-themed palette — deep orange primary (`#E85D24`), cream background (`#FFF8F0`), dark charcoal text (`#1A1A1A`). Adapt for admin panel with a neutral dark sidebar.
- The customer menu page must feel like a real restaurant app — not a plain list. Use cards, images, smooth category tab animations.
- Admin dashboard should look clean and professional — similar to a POS system.
- All forms must have proper input validation with user-friendly error messages.
- All buttons must have loading states (spinner) while async operations run.
- All API errors must be caught and shown to the user in a toast notification or inline error message.

---

## SECURITY REQUIREMENTS

- Never store passwords in plain text. Always hash with bcryptjs.
- Never return the password field in any API response. Use `.select('-password')` in queries.
- All admin API routes must require a valid JWT. Reject with 401 if missing or expired.
- Validate all incoming request bodies on the backend. Return clear 400 errors for missing fields.
- Use environment variables for ALL secrets. Never hardcode API keys or secrets in code.
- Set CORS to only allow requests from the frontend URL.

---

## SEED DATA

Create a file `backend/seed.js` that:
1. Connects to MongoDB
2. Creates a test restaurant owner account:
   - name: "Test Restaurant"
   - restaurantName: "The Digital Diner"
   - email: "admin@digitaldiner.com"
   - password: "password123" (will be hashed automatically)
3. Creates 4 categories: Starters, Main Course, Desserts, Drinks
4. Creates 12 menu items spread across the categories with realistic names, descriptions, prices (in UGX — Ugandan Shillings), and `isAvailable: true`
5. Creates 5 tables (Table 1 through Table 5) with QR code URLs
6. Logs "Seed complete" when done

Run with: `node seed.js`

---

## README.md

Write a complete README.md that includes:
1. Project overview and features list
2. Prerequisites (Node.js, MongoDB Atlas account, Cloudinary account)
3. Step-by-step installation instructions for both backend and frontend
4. How to set up `.env` files with where to get each key
5. How to run the seed script
6. How to run the project in development
7. API endpoints reference table (method, path, auth required, description)
8. How to deploy (Vercel for frontend, Render for backend, MongoDB Atlas)
9. How to print and use QR codes in a real restaurant
10. Troubleshooting common errors

---

## PACKAGE.JSON FILES

**backend/package.json** must include these exact dependencies:
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

**frontend/package.json** must include:
```json
{
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "react-qr-code": "^2.0.12",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

---

## FINAL INSTRUCTIONS FOR THE AI

1. Generate **every single file** listed in the folder structure. Do not say "you can create this file yourself" — generate it completely.
2. Every React component must be a functional component using hooks. No class components.
3. Every async function must use `async/await` with proper `try/catch` error handling.
4. Every API call on the frontend must handle loading, success, and error states.
5. The `MenuPage.jsx` (customer view) must be fully functional without requiring the customer to log in.
6. Make the code clean, well-commented, and beginner-friendly with comments explaining what each section does.
7. After generating all files, provide a "Quick Start" section showing the exact terminal commands to install dependencies and run both servers.
8. The project must work end-to-end: a customer scanning the QR code must be able to browse the menu and place an order, and the restaurant owner must be able to log in and see that order appear in their dashboard.
