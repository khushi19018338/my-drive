📁 My Drive – Google Drive Clone

A simple cloud storage web app where users can register, log in, upload files, view them, download, and delete them — similar to Google Drive.

🚀 Features

User authentication (Login / Register)

Upload files to Supabase Storage

View all uploaded files

Download files

Delete files

Protected pages using JWT

Clean UI using EJS + TailwindCSS

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Storage: Supabase Storage

Frontend: EJS, TailwindCSS

Auth: JWT + Cookies

Uploads: Multer (memory storage)

⚙️ Setup Instructions
1️⃣ Install dependencies
npm install

2️⃣ Create a .env file
PORT=3000
MONGO_URI=mongodb://localhost:27017/drive_clone

SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=sb_secret_your_supabase_service_role_key

JWT_SECRET=yoursecret

3️⃣ Start the project

Development:

npm run dev


Production:

npm start

📁 Folder Structure (short)
routes/       → All routes
models/       → MongoDB models
views/        → EJS UI pages
middleware/   → Auth middleware
config/       → DB and Supabase setup

⭐ If you like this project, give it a star on GitHub!

