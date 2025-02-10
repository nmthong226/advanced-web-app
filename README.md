# Advanced Web App
- This is a full-stack web application with a frontend built using React, TypeScript, and Vite, and a backend built using Node.js, Express, and MongoDB.
- This repository is for Frontend management. For the backend, please follow this url: ```https://github.com/huyk21/be_awd.git```

- **Application target**: in the development process.

## Project Structure
```bash
advanced-web-app/
├── backend/               # Backend (Node.js, Express, MongoDB)
├── frontend
├──── public/            # Public assets (frontend)
├──── src/               # Frontend source code (React + TypeScript)
├──── .gitignore
├──── package.json       # Frontend dependencies and scripts
├──── README.md
├──── tsconfig.json      # TypeScript configuration
├──── vite.config.ts     # Vite configuration for frontend
├──── ...                # Other files for configuration
```

## Requirements
- Node.js (v14 or higher)
- MongoDB (local instance or cloud-based)
- React 16+

## Installation and Setup
- ### 1. Clone the Repository
~~~~
git clone [This project repository]
cd advanced-web-app
~~~~

- ### 2. Install Dependencies
- #### 2.1 Install frontend dependencies (in root folder):
```python
npm install
```

- #### 2.2 Install backend dependencies (in api folder)
```python
cd api
npm install
```


- ### 3. Configure Environment Variables
- #### 3.1 Create a .env file in the api folder for the backend and add your MongoDB connection string:
```bash
# Backend Environment Variables
MONGO_URI=YOUR_MONGO_URI
PORT=5000
```

- #### 3.2 Create a .env file in the api folder for the backend and add your MongoDB connection string:
```bash
VITE_API_BASE=YOUR_API_URL
VITE_PUSHER_KEY=YOUR_PUSHER_KEY
VITE_PUSHER_CLUSTER=YOUR_PUSHER_CLUSTER
```
