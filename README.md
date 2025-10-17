# online-secret-notes 📝

[![License](https://img.shields.io/badge/license-Unlicensed-red.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)]()
[![Node.js](https://img.shields.io/badge/runtime-Node.js-green.svg)]()
[![Express](https://img.shields.io/badge/framework-Express-blue.svg)]()
[![React](https://img.shields.io/badge/frontend-React-61DAFB.svg)]()
[![Vite](https://img.shields.io/badge/bundler-Vite-purple.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC.svg)]()
[![Docker](https://img.shields.io/badge/container-Docker-blue.svg)]()


## Description 🚀

The `online-secret-notes` project is a full-stack web application that allows users to securely store and manage their personal notes. It features a React-based frontend, a Node.js/Express backend, and a PostgreSQL database. The application provides user authentication, note categorization, and a rich text editor for creating and updating notes.

## Table of Contents 📍

1.  [Features](#features-%EF%B8%8F)
2.  [Tech Stack](#tech-stack-%E2%9A%92)
3.  [Installation](#installation-%E2%9A%A0%EF%B8%8F)
4.  [Usage](#usage-%F0%9F%9A%80)
5.  [Project Structure](#project-structure-%F0%9F%93%81)
6.  [API Reference](#api-reference-%F0%9F%93%96)
7.  [Contributing](#contributing-%F0%9F%A7%A1)
8.  [License](#license-%F0%9F%93%9C)
9. [Important Links](#important-links-%F0%9F%94%97)
10. [Footer](#footer-%E2%9C%8D)

## Features ✨

*   **User Authentication:** Secure signup, login, and logout functionality using bcryptjs and JSON Web Tokens (JWT).
*   **Note Management:** Create, read, update, and delete notes with categories.
*   **Category Management:** Add, get, and delete categories for notes.
*   **Rich Text Editing:** Utilizes a text editor (likely through the `content_container` field) for creating and formatting notes.
*   **Data Persistence:** Uses a PostgreSQL database to store user data, notes, and categories.
*   **Frontend Framework:** Developed with React, React Router, and Vite for a modern and responsive user interface.
*   **Backend Framework:** Developed with Node.js and Express for robust API and server-side logic.
*   **State Management:** Uses Zustand for managing the frontend application state.
*   **Styling:** Styled with Tailwind CSS and DaisyUI for a visually appealing and customizable design.

## Tech Stack 🛠️

*   **Frontend:**
    *   React ⚛️
    *   React Router DOM 🗺️
    *   Vite ⚡
    *   Tailwind CSS 💨
    *   DaisyUI 🌼
    *   Zustand 🧠
    *   Axios 📡
    *   Lucide React 💡
    *   React Hot Toast 🍞
*   **Backend:**
    *   Node.js 🟢
    *   Express 🚀
    *   PostgreSQL 🐘
    *   bcryptjs 🔒
    *   jsonwebtoken 🔑
    *   cookie-parser 🍪
    *   cors 🌐
    *   dotenv 🔑
    *   cloudinary ☁️
*   **Other:**
    *   Docker 🐳
    *   YAML ⚙️

## Installation 🛠️

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ford-HUB/online-secret-notes.git
    cd online-secret-notes
    ```

2.  **Backend Setup:**

    *   Navigate to the `backend` directory:

        ```bash
        cd backend
        ```

    *   Install dependencies:

        ```bash
        npm install
        ```

    *   Create a `.env` file in the `backend` directory and configure the following environment variables:

        ```
        POSTGRES_USER=<your_postgres_user>
        POSTGRES_PASSWORD=<your_postgres_password>
        POSTGRES_DATABASE=<your_postgres_database>
        DB_PORT=<your_db_port>
        SERVER_PORT=<your_server_port>
        VITE_FRONTEND_URL=http://localhost:5173
        MY_SECRET_KEY=<your_jwt_secret_key>
        ```

    *   Start the backend server:

        ```bash
        npm start
        # or for development
        npm run testing
        ```

3.  **Frontend Setup:**

    *   Navigate to the `frontend` directory:

        ```bash
        cd ../frontend
        ```

    *   Install dependencies:

        ```bash
        npm install
        ```

    *   Create a `.env` file in the `frontend` directory and configure the following environment variable:

        ```
        VITE_API_URL=http://localhost:8000/api
        ```

    *   Start the frontend development server:

        ```bash
        npm run dev
        ```

4.  **Docker Setup (Optional):**

    *   Ensure Docker and Docker Compose are installed.
    *   Create a `.env` file in the root directory with the necessary environment variables for the database and pgAdmin:

        ```
        POSTGRES_USER=<your_postgres_user>
        POSTGRES_PASSWORD=<your_postgres_password>
        POSTGRES_DATABASE=<your_postgres_database>
        DB_PORT=5432
        PGADMIN_DEFAULT_EMAIL=<your_pgadmin_email>
        PGADMIN_DEFAULT_PASSWORD=<your_pgadmin_password>
        PGADMIN_PORT=5050
        SERVER_PORT=8000
        ```

    *   Run Docker Compose to build and start the services:

        ```bash
        docker-compose up --build
        ```

## Usage 🚀

1.  **Access the Application:** Open your web browser and navigate to `http://localhost:5173` (or the appropriate port if configured differently).
2.  **Sign Up/Log In:** Create a new account or log in with existing credentials.
3.  **Create Notes:** Once logged in, you can create, edit, and delete notes. Use the text editor to format your notes.
4.  **Categorize Notes:** Organize your notes by assigning them to different categories.
5.  **Manage Profile:** Update your profile information, such as username.


### Use cases 💡

1.  **Personal Notes:** Keep your personal thoughts, ideas, and to-do lists secure and organized.
2.  **Project Management:** Track project tasks, deadlines, and notes in a categorized manner.
3.  **Secure Information Storage:** Store sensitive information, such as passwords or private keys, with encryption provided by bcrypt on the backend.

## Project Structure 🗂️

```
online-secret-notes/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app.js          # Express application setup
│   │   ├── server.js       # Server entry point
│   │   ├── config/
│   │   │   └── db.js       # Database connection configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/
│   │   │   └── verifyToken.js # Authentication Middleware
│   │   ├── routes/         # API routes
│   │   └── schemas/        # Validation schemas
│   └── ...
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Application pages
│   │   ├── api/            # API configuration
│   │   ├── assets/         # Static assets
│   │   ├── store/          # Zustand store
│   │   └── utils/          # Utility functions
│   └── ...
├── docker-compose.yml  # Docker Compose configuration
└── README.md
```

## API Reference 📚

The backend provides the following API endpoints:

*   `POST /api/auth/signup`: Registers a new user.
*   `POST /api/auth/login`: Logs in an existing user.
*   `POST /api/auth/logout`: Logs out the current user.
*   `GET /api/auth/checkAuth`: Checks if the user is authenticated.
*   `PUT /api/auth/update-profile`: Updates user profile information.
*   `POST /api/category/add-category`: Adds a new category.
*   `GET /api/category/get-categorys`: Retrieves all categories for a user.
*   `DELETE /api/category/delete-category/:cat_id/:note_id/content`: Deletes a category.
*   `POST /api/your-notes/add-note/:cat_id`: Adds a new note to a category.
*   `GET /api/your-notes/get-note/:cat_id`: Retrieves all notes for a category.
*   `GET /api/your-notes/get-all-notes`: Retrieves all notes for a user.
*   `PUT /api/your-notes/edit/:cat_id/:note_id/content`: Updates an existing note.
*   `DELETE /api/your-notes/delete/:note_id/content`: Deletes a note.

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## License 📝

This project is unlicensed.

## Important Links 🔗

*   **Repository:** [https://github.com/ford-HUB/online-secret-notes](https://github.com/ford-HUB/online-secret-notes)

## Footer 🏁

[online-secret-notes](https://github.com/ford-HUB/online-secret-notes) - [https://github.com/ford-HUB/online-secret-notes](https://github.com/ford-HUB/online-secret-notes) by [ford-HUB](https://github.com/ford-HUB). Feel free to fork, like, star, and open issues!
