# 🚀 Setup Guide - Faculty Project Tracker

This guide will help you set up and run the Faculty Project Tracker application on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Node.js** (v16.0.0 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v5.0 or higher)
   - **Option A - Local Installation**:
     - Download: https://www.mongodb.com/try/download/community
     - Verify installation: `mongod --version`
   - **Option B - MongoDB Atlas (Cloud)**:
     - Sign up: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get connection string

3. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

4. **Code Editor** (recommended)
   - VS Code: https://code.visualstudio.com/

---

## 📥 Step 1: Get the Code

### Option A: Clone Repository
```bash
git clone <repository-url>
cd minor
```

### Option B: Download ZIP
1. Download the project as ZIP
2. Extract to a folder
3. Open terminal in that folder

---

## 🗄️ Step 2: Setup MongoDB

### Option A: Local MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or run manually
mongod --dbpath /data/db
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://cloud.mongodb.com/
2. Log in / Sign up
3. Create a new cluster (free tier)
4. Go to "Database Access" → Create a database user
5. Go to "Network Access" → Add your IP (or allow all: 0.0.0.0/0)
6. Click "Connect" → "Connect your application"
7. Copy the connection string

---

## ⚙️ Step 3: Backend Setup

### 1. Navigate to Backend Folder
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- nodemon (dev dependency)

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

Edit the `.env` file with your settings:

```env
# Server Port
PORT=5000

# MongoDB Connection
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/faculty-tracker

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/faculty-tracker?retryWrites=true&w=majority

# JWT Secret (Change this!)
JWT_SECRET=your_random_secret_key_min_32_characters_long

# Admin Credentials
ADMIN_EMAIL=admin@tracker.com
ADMIN_PASSWORD=admin123
```

**⚠️ Important**: 
- Generate a strong JWT_SECRET for production
- Change default admin credentials after first login

### 4. Seed the Database

Populate the database with initial data:

```bash
npm run seed
```

You should see:
```
✅ MongoDB Connected
🗑️  Cleared existing data
✅ Admin created: admin@tracker.com
✅ Teachers created: 3
✅ Sample groups created: 6
🎉 Database seeded successfully!
```

### 5. Start Backend Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: localhost
```

Keep this terminal window open!

---

## 🎨 Step 4: Frontend Setup

Open a **NEW** terminal window/tab.

### 1. Navigate to Frontend Folder
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- react & react-dom
- react-router-dom
- axios
- framer-motion
- recharts
- react-icons
- date-fns
- vite
- tailwindcss
- postcss & autoprefixer

### 3. Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🎉 Step 5: Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the login page

### Default Login Credentials:
```
Email: admin@tracker.com
Password: admin123
```

---

## ✅ Verification Checklist

Make sure everything is working:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected (check backend terminal)
- [ ] Can access login page
- [ ] Can login with default credentials
- [ ] Dashboard loads with sample data
- [ ] Can view teacher details
- [ ] Can add new group
- [ ] Can update group progress
- [ ] Dark mode toggle works
- [ ] Export CSV works

---

## 🔍 Testing the Features

### 1. View Dashboard
- Should see 4 stats cards
- Should see 3 teacher cards
- Click on a teacher card

### 2. View Teacher Details
- Should see groups table
- Try filtering by branch
- Try sorting by progress
- Try searching for a student name
- Click "Export CSV"

### 3. Add a New Group
- Click "Add Group" in navigation
- Fill all fields
- Try invalid data (should show errors)
- Submit valid data
- Should redirect to teacher's page

### 4. View Group Details
- Click "View" on any group
- Should see full group information
- Click edit icon in "Update Progress"
- Adjust progress slider
- Add notes
- Save update
- Should see new entry in Update History

### 5. Test Dark Mode
- Click sun/moon icon in navigation
- Interface should switch themes
- Refresh page (preference should persist)

### 6. Export Data
- From Dashboard: "Export All Data"
- From Teacher page: "Export CSV"
- Should download CSV file

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas: Check network access and credentials

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```
Or change PORT in backend/.env

### Issue: "Port 3000 already in use"
**Solution:**
- Change port in frontend/vite.config.js
- Or kill the process using port 3000

### Issue: "Network Error" when logging in
**Solution:**
- Ensure backend is running
- Check backend terminal for errors
- Verify API URL in frontend (should use proxy)

### Issue: "JWT must be provided"
**Solution:**
- Clear browser localStorage
- Login again
- Check if JWT_SECRET is set in backend/.env

### Issue: "Failed to seed database"
**Solution:**
- Ensure MongoDB is running
- Drop the database and try again:
```bash
# In MongoDB shell
use faculty-tracker
db.dropDatabase()
```
Then run `npm run seed` again

### Issue: Dependencies not installing
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📊 Database Structure

After seeding, your database will have:

### Collections:
1. **admins** - 1 document (admin user)
2. **teachers** - 3 documents (Tayyab, Vinay, Chanchal)
3. **groups** - 6 documents (sample groups)

### Sample Groups:
- Tayyab Sir: 2 groups
- Vinay Sir: 2 groups
- Chanchal Sir: 2 groups

---

## 🔄 Resetting the Database

To start fresh:

```bash
cd backend
npm run seed
```

This will:
1. Clear all existing data
2. Create new admin
3. Create teachers
4. Create sample groups

---

## 🚀 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

Preview the build:
```bash
npm run preview
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000                              # Server port
MONGODB_URI=mongodb://...              # Database connection
JWT_SECRET=your_secret_key             # JWT signing key
ADMIN_EMAIL=admin@tracker.com          # Admin email
ADMIN_PASSWORD=admin123                # Admin password
```

### Frontend (if needed)
Currently uses proxy, but for production:
```env
VITE_API_URL=https://your-api-url.com
```

---

## 🛠️ Development Tools

### Recommended VS Code Extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- MongoDB for VS Code
- Thunder Client (for API testing)

### Testing APIs:
Use Thunder Client, Postman, or Insomnia to test backend endpoints.

Example requests:
```bash
# Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@tracker.com",
  "password": "admin123"
}

# Get Groups (requires token)
GET http://localhost:5000/api/groups
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 💡 Tips for Development

1. **Hot Reload**: Both frontend and backend support hot reload in dev mode
2. **Console Logs**: Check browser console and terminal for errors
3. **Network Tab**: Use browser DevTools to inspect API calls
4. **MongoDB Compass**: Use MongoDB Compass GUI to view database
5. **Git Branches**: Use branches for new features
6. **Code Format**: Use Prettier for consistent formatting

---

## 🎓 Next Steps

Now that you have the app running:

1. Explore all features
2. Try adding your own groups
3. Experiment with the dark mode
4. Check the progress charts
5. Test the CSV export
6. Modify the UI to your liking
7. Add new features!

---

## 🤝 Need Help?

If you encounter issues not covered here:

1. Check the main README.md
2. Review error messages carefully
3. Search for the error online
4. Check the GitHub issues
5. Ask for help with detailed error logs

---

**Happy Coding! 🚀**
