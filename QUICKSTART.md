# ⚡ Quick Start Guide

Get the Faculty Project Tracker up and running in 5 minutes!

---

## 🏃‍♂️ Super Quick Start (TL;DR)

```bash
# 1. Start MongoDB
mongod

# 2. Backend Setup (Terminal 1)
cd backend
npm install
npm run seed
npm run dev

# 3. Frontend Setup (Terminal 2)
cd frontend
npm install
npm run dev

# 4. Open Browser
# Go to: http://localhost:3000
# Login: admin@tracker.com / admin123
```

---

## 📋 Quick Commands Reference

### Backend Commands
```bash
cd backend

npm install              # Install dependencies
npm run seed            # Seed database with sample data
npm run dev             # Start development server
npm start               # Start production server
```

### Frontend Commands
```bash
cd frontend

npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🔑 Default Credentials

```
Email: admin@tracker.com
Password: admin123
```

---

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/

---

## 📁 Quick File Reference

### Backend
```
backend/
├── .env                 ← Configure this!
├── server.js            ← Entry point
├── seed.js              ← Database seeder
├── models/              ← Database schemas
├── controllers/         ← Business logic
├── routes/              ← API endpoints
└── middleware/          ← Auth & error handling
```

### Frontend
```
frontend/
├── src/
│   ├── pages/           ← Main pages
│   ├── components/      ← Reusable components
│   ├── context/         ← Global state
│   ├── services/        ← API calls
│   └── utils/           ← Helper functions
```

---

## 🎯 Common Tasks

### Add a New Group
1. Login
2. Click "Add Group"
3. Fill the form
4. Submit

### Update Progress
1. Go to Dashboard
2. Click a teacher card
3. Click "View" on a group
4. Click edit icon in "Update Progress"
5. Adjust slider and add notes
6. Save

### Export Data
- Dashboard → "Export All Data"
- Teacher Page → "Export CSV"

### Toggle Dark Mode
- Click sun/moon icon in top navigation

---

## 🛠️ Environment Setup

### backend/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/faculty-tracker
JWT_SECRET=change_this_secret_key_in_production
ADMIN_EMAIL=admin@tracker.com
ADMIN_PASSWORD=admin123
```

---

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Start MongoDB: `mongod` |
| Port 5000 in use | Change PORT in backend/.env |
| Port 3000 in use | Close other React apps |
| Login fails | Run `npm run seed` in backend |
| Network error | Ensure backend is running |
| Blank screen | Check browser console for errors |

---

## 📊 Sample Data Included

After running `npm run seed`, you get:
- ✅ 1 Admin account
- ✅ 3 Teachers (Tayyab, Vinay, Chanchal)
- ✅ 6 Sample groups with varying progress

---

## 🎨 Features Overview

✅ Admin authentication with JWT  
✅ Dashboard with real-time stats  
✅ Teacher-wise group management  
✅ Progress tracking with history  
✅ Search & filter functionality  
✅ Export to CSV  
✅ Progress charts  
✅ Dark mode  
✅ Responsive design  
✅ Smooth animations  

---

## 🔄 Reset Database

```bash
cd backend
npm run seed
```

---

## 📱 Ports Used

- Frontend: **3000**
- Backend: **5000**
- MongoDB: **27017**

---

## 🎓 Teachers in System

1. **Tayyab Sir** - Max 6 groups
2. **Vinay Sir** - Max 6 groups
3. **Chanchal Sir** - Max 6 groups

---

## 🏷️ Branches Available

- **IT** - Information Technology
- **CSE-A** - Computer Science A
- **CSE-B** - Computer Science B

---

## 📈 Progress Status

- 🔴 **0-39%**: Low Progress
- 🟡 **40-69%**: In Progress
- 🟢 **70-100%**: On Track

---

## 💻 Tech Stack Quick View

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Routing | React Router |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

---

## 🔐 API Routes Quick Reference

### Public
```
POST /api/auth/login          # Login
```

### Protected (require token)
```
GET  /api/groups              # Get all groups
POST /api/groups              # Create group
GET  /api/groups/:id          # Get single group
PUT  /api/groups/:id          # Update group
DELETE /api/groups/:id        # Delete group
GET  /api/groups/stats/dashboard  # Dashboard stats
GET  /api/teachers            # Get all teachers
```

---

## 🎯 Key Validation Rules

- Group number: **1-6** only
- Max groups per teacher: **6**
- Mobile number: **10 digits**
- Progress: **0-100**%
- All form fields: **Required**

---

## 📝 Quick Tips

1. Keep both terminals (backend + frontend) open
2. Check console for errors
3. Use dark mode for night work
4. Export data regularly
5. Update progress weekly
6. Search by student name for quick access

---

## 🚀 Ready to Start?

1. ✅ MongoDB running?
2. ✅ Backend dependencies installed?
3. ✅ Database seeded?
4. ✅ Backend server running?
5. ✅ Frontend dependencies installed?
6. ✅ Frontend server running?

**If all ✅, open http://localhost:3000 and log in!**

---

For detailed setup instructions, see **SETUP.md**  
For full documentation, see **README.md**

---

**Happy tracking! 🎓📊**
