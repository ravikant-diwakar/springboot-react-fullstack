# Full Stack Application with React and Spring Boot

A complete full stack web application with React frontend and Spring Boot backend using MySQL database.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Developer Details](#developer-details)

## Overview

This project is a full stack web application that demonstrates the integration of a React frontend with a Spring Boot backend. The application provides user authentication, task management, and other features in a responsive and modern UI.

## Features

- User registration and login with JWT authentication
- Task management (create, read, update, delete)
- Task filtering by status (completed, active)
- Task prioritization
- Responsive design for mobile and desktop
- Form validation
- Error handling

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API requests
- React Toastify for notifications
- CSS for styling
- Vite as build tool

### Backend
- Spring Boot 3.2.5
- Spring Security with JWT authentication
- Spring Data JPA for database operations
- Hibernate as ORM
- MySQL database
- Maven for dependency management

## Project Structure

```
full-stack-application/
│
├── backend/                                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/fullstackbackend/
│   │   │   │   ├── config/                  # Configuration classes
│   │   │   │   ├── controller/              # REST controllers
│   │   │   │   ├── dto/                     # Data Transfer Objects
│   │   │   │   ├── exception/               # Exception handling
│   │   │   │   ├── model/                   # Entity models
│   │   │   │   ├── repository/              # Data repositories
│   │   │   │   ├── security/                # Security configuration
│   │   │   │   ├── service/                 # Business logic
│   │   │   │   └── FullstackBackendApplication.java  # Main class
│   │   │   └── resources/
│   │   │       └── application.properties   # Application properties
│   │   └── test/                            # Test classes
│   └── pom.xml                              # Maven dependencies
│
├── frontend/                               # React frontend
│   ├── public/                             # Public assets
│   ├── src/
│   │   ├── components/                     # React components
│   │   │   ├── auth/                       # Authentication components
│   │   │   ├── common/                     # Common UI components
│   │   │   ├── pages/                      # Page components
│   │   │   └── tasks/                      # Task-related components
│   │   ├── context/                        # React context providers
│   │   ├── services/                       # API service integration
│   │   ├── App.jsx                         # Main App component
│   │   ├── App.css                         # App-level styles
│   │   ├── index.css                       # Global styles
│   │   └── main.jsx                        # Entry point
│   ├── index.html                          # HTML template
│   ├── package.json                        # npm dependencies
│   └── vite.config.js                      # Vite configuration
│
└── README.md                  # Root README for the whole project
```

## Setup Instructions

### Prerequisites

Before setting up the project, make sure you have the following installed on your system:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Node.js (v16+) and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

3. **MySQL (v8.0+)**
   - Download from: https://dev.mysql.com/downloads/
   - Verify installation: `mysql --version`

4. **Maven**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -v`

### Database Setup

1. **Login to MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Create the database**
   ```sql
   CREATE DATABASE fullstack_db;
   ```

3. **Create a user and grant privileges** (optional but recommended)
   ```sql
   CREATE USER 'fullstack_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON fullstack_db.* TO 'fullstack_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd full-stack-application
   ```

2. **Configure database connection**
   - Open `backend/src/main/resources/application.properties`
   - Update the following properties with your database configuration:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/fullstack_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
     spring.datasource.username=root
     spring.datasource.password=your_password
     ```

3. **Build the application**
   ```bash
   cd backend
   mvn clean install
   ```

4. **Run the Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```
   The backend server will start on port 8080.

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   - Open `src/config.js`
   - Ensure the `API_BASE_URL` points to your backend server:
     ```javascript
     export const API_BASE_URL = 'http://localhost:8080';
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend development server will start on port 5173.

## Running the Application

After completing the setup instructions above:

1. Ensure the MySQL database is running
2. Ensure the Spring Boot backend is running on port 8080
3. Ensure the React frontend is running on port 5173
4. Open your browser and navigate to http://localhost:5173

## API Documentation

The API provides the following endpoints:

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user and retrieve JWT token

### Tasks
- `GET /api/tasks`: Get all tasks for the authenticated user
- `GET /api/tasks/{id}`: Get a specific task by ID
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/{id}`: Update an existing task
- `DELETE /api/tasks/{id}`: Delete a task
- `GET /api/tasks/completed`: Get all completed tasks
- `GET /api/tasks/pending`: Get all pending tasks

## Screenshots

(Screenshots would be added here in a real README)

## Developer Details

- **Name**: Ravikant Diwakar
- **Email**: diwakarr956@gmail.com
- **GitHub**: [github.com/ravikant-diwakar](https://github.com/ravikant-diwakar)
- **LinkedIn**: [linkedin.com/in/ravikantdiwakar](https://linkedin.com/in/ravikantdiwakar)