# ShopSphere

ShopSphere is a full-stack e-commerce web application built with a modern technology stack. It provides a seamless shopping experience for users, featuring product browsing, category filtering, a shopping cart, a wishlist, secure checkout, order management, and user authentication.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Product Catalog**: Browse a wide range of products with detailed views.
- **Categories**: Filter products by different categories.
- **Shopping Cart**: Add, remove, and update quantities of products in the cart.
- **Wishlist**: Save favorite products for later purchase.
- **Checkout Process**: Step-by-step checkout including address selection and simulated payment processing.
- **Order Management**: View order history, track order status, and manage active orders.
- **Reviews & Ratings**: Read and write product reviews.
- **User Profile**: Manage personal details and multiple delivery addresses.
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library for building component-based interfaces.
- **Vite**: Next-generation frontend tooling for fast development and building.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI styling.
- **React Router DOM**: Client-side routing for seamless navigation.
- **Axios**: Promise-based HTTP client for API requests.
- **React Hot Toast**: Beautiful notifications and alerts.
- **React Icons**: Comprehensive icon library.

### Backend
- **Node.js & Express.js 5**: Fast, unopinionated, minimalist web framework.
- **MySQL**: Relational database for robust data storage.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcryptjs**: Password hashing for secure user data.
- **CORS & Dotenv**: Middleware for security and environment configuration.

## 📂 Project Structure

```
ShopSphere/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route logic and request handling
│   │   ├── middleware/       # Custom middleware (auth, etc.)
│   │   ├── routes/           # API route definitions
│   │   └── app.js            # Express app setup
│   ├── server.js             # Entry point for backend
│   └── package.json
│
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context for state management
│   │   ├── pages/            # Page components (Home, Cart, Profile, etc.)
│   │   ├── services/         # API integration methods (axios calls)
│   │   ├── App.jsx           # Main application layout and routes
│   │   └── main.jsx          # React entry point
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) installed and running locally.

### 1. Clone the repository
```bash
git clone <repository-url>
cd ShopSphere
```

### 2. Setup the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure your environment variables:
```env
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
```

Ensure your MySQL database (`ecommerce_db`) is created and running. Start the backend server:
```bash
# Start in development mode (with nodemon)
npm run dev

# Or start in production mode
npm start
```

### 3. Setup the Frontend
Open a new terminal window, navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Explore the App
The frontend will typically run at `http://localhost:5173/` (or similar, check terminal output).
The backend API will run at `http://localhost:5000/`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is licensed under the ISC License.
