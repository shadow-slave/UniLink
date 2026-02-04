# UniLink

UniLink is a full-stack social media application designed to facilitate connections between students. Built using the MERN stack, it provides a platform for users to share updates, interact with peers through posts, and engage with content via likes and comments.

## 🚀 Features

* **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and Bcrypt.
* **Dynamic Dashboard**: Personalized user dashboard to view and manage content.
* **Post Management**: Users can create, view, and delete their own posts.
* **Interactive Feed**: A global feed (`PostFeed`) to discover posts from other users.
* **Engagement**: Features to Like and Comment on posts to foster community interaction.
* **Protected Routes**: Secure navigation ensuring only authenticated users access private pages.
* **Responsive Design**: Mobile-friendly interface built with React and custom CSS.

## 🛠️ Tech Stack

### Frontend
* **React.js** (v19)
* **React Router** (v7) for navigation
* **Axios** for API integration
* **CSS3** for styling

### Backend
* **Node.js** & **Express.js** for the REST API
* **MongoDB** & **Mongoose** for database management
* **JSON Web Token (JWT)** for secure authentication
* **Bcrypt** for password hashing
* **Cors** & **Dotenv** for configuration and security

## 📂 Project Structure

```text
UniLink/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets (favicons, images)
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar, Footer, PrivateRoute)
│   │   ├── pages/          # Application pages (Login, Register, Dashboard, etc.)
│   │   ├── services/       # API interaction services (authService, postService)
│   │   ├── styles/         # Component-specific CSS files
│   │   └── App.js          # Main component with routing logic
│   └── package.json        # Frontend dependencies
│
└── server/                 # Backend Node.js Application
    ├── controllers/        # Route logic (authController, postController)
    ├── middleware/         # Custom middleware (authMiddleware)
    ├── models/             # Database schemas (User, Post, Comment)
    ├── routes/             # API routes definitions
    ├── app.js              # Server entry point
    └── package.json        # Backend dependencies

```

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

* **Node.js** (v14+)
* **npm** or **yarn**
* **MongoDB** (Local instance or MongoDB Atlas URI)

### 1. Clone the Repository

```bash
git clone https://github.com/shadow-slave/unilink.git
cd unilink

```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install

```

**Environment Variables:**
Create a `.env` file in the `server` directory and add your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/unilink  # Or your Atlas connection string
JWT_SECRET=your_super_secret_key_here

```

Start the backend server:

```bash
npm run dev
# The server will run on http://localhost:5000

```

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install

```

Start the React development server:

```bash
npm start
# The application will open at http://localhost:3000

```

## 🔌 API Reference

### Authentication (`/api/auth`)

* `POST /register` - Register a new user account.
* `POST /login` - Authenticate a user and receive a token.

### Posts (`/api/posts`)

* `GET /` - Retrieve all posts for the feed.
* `POST /` - Create a new post (Requires Auth).
* `DELETE /:id` - Delete a post (Requires Auth).

*(Note: Additional endpoints for comments and likes are managed within the post routes)*

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the **ISC License**.
