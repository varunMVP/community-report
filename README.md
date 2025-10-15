# Civic Issue Reporting System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application that allows citizens to report civic issues (like potholes, broken streetlights, garbage, etc.) and enables admins to manage and update issue statuses.

---

## **Project Features**

### User Features:
- Sign up and log in securely.
- Report community issues with optional images.
- View all reported issues.
- Delete own reported issues.
- Dashboard to track the status of submitted issues.

### Admin Features:
- View all issues from all users.
- Update issue status (Open, In Progress, Resolved, Closed).
- Delete any issue.
- Statistics dashboard (total issues, status breakdown).

### Security:
- Passwords are hashed using **bcrypt**.
- JWT token authentication for protected routes.
- Role-based authorization (user vs admin).

---
Install dependencies:

npm install


Create a .env file with:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the server:

npm start


The backend runs on http://localhost:5000.

Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the React development server:

npm start


The frontend runs on http://localhost:3000.

API Endpoints
Authentication

POST /api/auth/signup - Register new user

POST /api/auth/login - Login user

Issues

POST /api/issues - Create a new issue

GET /api/issues - Get all issues

GET /api/issues/my-issues - Get issues reported by the logged-in user

PATCH /api/issues/:id/status - Update issue status (admin only)

DELETE /api/issues/:id - Delete issue

Technologies Used

Backend: Node.js, Express, MongoDB, Mongoose, bcrypt, JSON Web Token (JWT), Multer

Frontend: React, React Router DOM, Axios

Deployment & Tools: GitHub, VS Code, Postman, npm

Screenshots / Demo

(Add screenshots or GIFs of your frontend and dashboard here if available)

Contributing

Fork the repository

Create a new branch (git checkout -b feature/feature-name)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature/feature-name)

Create a Pull Request

License

This project is licensed under the MIT License.

Author

Varun Nagachowdary
Email: varunthecm@gmail.com

GitHub: https://github.com/varunMVP
## **Folder Structure**

