# uni-framework-project

Project Overview
The project consists of two main parts: a backend built with Express.js and Mongoose, and a frontend developed using the React framework. Communication between the client and server is handled via authorization tokens, with localStorage used to temporarily store user data, such as selected product sets, throughout the session — for example, during the checkout process. Users can select product bundles for purchase; this data is stored and later associated with their account once registration or login is completed successfully.

File Structure and Components
Backend (server directory)
The backend is managed through Express.js with Mongoose for MongoDB interaction. It consists of several modules, each responsible for a specific aspect of the application’s functionality:

middleware/auth.js
Handles user authentication by verifying token validity. If valid, the user is passed along to the next middleware; otherwise, the request is rejected.

models/order.js
Defines the schema and structure for storing order-related data.

models/set.js
Represents the product sets available on the site, including their attributes and pricing.

models/user.js
Manages user registration, including the user schema, token generation, and data validation logic.

routes/
This directory contains all route handlers, organized by functionality, ensuring smooth navigation and interaction within the site:

auth.js
Handles user login and registration. It checks if an email already exists in the system and validates passwords. Upon successful authentication, a token is generated, and the user is logged in.

orders.js
Manages CRUD operations for orders and includes validation mechanisms.

sets.js
Provides routing for accessing product sets and includes logic for price conversion.

user.js
Ensures user security by hashing passwords using bcrypt during account creation.

db.js
Manages the database connection, providing status feedback on successful or failed connections.

index.js
The main entry point of the server. It initializes all routes and establishes connections to both localhost and the MongoDB database.

Frontend (client directory)
The frontend is built with React and encapsulates all user-facing functionality, offering a seamless and interactive experience. It includes six main views:

Home

Login

Signup

Main 

OrdersPage

Combined

Each view follows a consistent structure:

index.jsx
Contains the core components and logic for the respective page.

style.module.jsx
Manages the styling and layout of the page using CSS Modules.

App.js
Serves as the central configuration file for routing. All available routes and their corresponding views are defined here, enabling navigation across the application.

This modular and organized approach ensures maintainability, scalability, and a smooth user experience throughout the application lifecycle.
