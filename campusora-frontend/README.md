🎓 Project Title

CampusOra – Smart Room Finder for College Students

🎯 Problem Statement

Many students fail to get hostel accommodation due to limited seats or academic criteria. Finding nearby rooms manually is time-consuming, unsafe, and inefficient. CampusOra provides a centralized, trusted platform to connect students with verified room owners near colleges.

🧱 Tech Stack (MERN)
Frontend

React.js

React Router DOM

Axios

CSS (custom, responsive)

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

bcrypt

CORS

Database

MongoDB Atlas (Cloud)

👥 User Roles
1️⃣ Student

Register & login

Search rooms

Filter rooms (rent, distance, BHK)

View room details

Contact owner (call / email / WhatsApp)

2️⃣ Owner

Register & login

Add room details

Upload room images

Manage own listings

🗂️ Folder Structure
📁 Backend
backend/
 ├─ models/
 │   ├─ User.js
 │   └─ Room.js
 ├─ controllers/
 │   ├─ authController.js
 │   └─ roomController.js
 ├─ routes/
 │   ├─ authRoutes.js
 │   └─ roomRoutes.js
 ├─ middleware/
 │   └─ authMiddleware.js
 ├─ server.js
 ├─ .env
 └─ package.json

📁 Frontend
campusora-frontend/
 ├─ src/
 │   ├─ components/
 │   │   └─ Navbar.js
 │   ├─ pages/
 │   │   ├─ Login.js
 │   │   ├─ Register.js
 │   │   ├─ Rooms.js
 │   │   ├─ RoomDetails.js
 │   │   └─ AddRoom.js
 │   ├─ services/
 │   │   └─ api.js
 │   ├─ App.js
 │   ├─ index.js
 │   └─ index.css
 └─ package.json

🔐 Authentication Flow

User registers with role (student / owner)

Password hashed using bcrypt

Login returns:

{
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "student | owner"
  }
}


User stored in localStorage

Role-based routing:

Student → /rooms

Owner → /add-room

🔄 Routing Logic (Frontend)
Route	Access	Description
/	Public	Login
/register	Public	Register
/rooms	Student	Room listing
/room/:id	Student	Room details
/add-room	Owner	Add room
🏠 Core Features (Completed / Planned)
✅ Completed / In Progress

User registration & login

Role-based UI

MongoDB Atlas integration

CORS handling

Clean UI layout

🔜 Upcoming Core Features

Room listing (real DB data)

Filters (rent, distance, BHK)

Room detail page

Contact owner buttons

🤖 ML / DL Extensions (For Final Year Value)
1️⃣ Smart Room Recommendation (ML)

Input: user preferences (budget, distance)

Output: ranked room list

Technique: Content-based filtering

2️⃣ Price Prediction (ML)

Predict fair rent based on:

Distance

Area

BHK

Technique: Linear Regression

3️⃣ Fake / Spam Listing Detection

Detect duplicate or suspicious room listings

Technique: Classification (basic ML)

4️⃣ Distance Optimization

Rank rooms using geo-distance from college

Use Haversine formula

🧪 Testing Strategy

Manual UI testing

API testing using Postman

MongoDB data verification via Atlas

🧾 Future Enhancements

Google Maps integration

Chat system

Reviews & ratings

Admin dashboard

Email notifications

🏁 Final Year Project Value

Real-world problem

Full-stack MERN

Cloud database

Authentication & roles

ML extension (easy to explain in viva)