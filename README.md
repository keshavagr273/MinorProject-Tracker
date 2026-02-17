# 🎓 Faculty Project Tracker

A **production-quality admin dashboard** for managing and tracking student project groups under faculty supervision.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🔐 Authentication
- **Single Admin Login** with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Dashboard
- **Real-time Statistics**: Total groups, average progress, low progress alerts
- **Faculty Overview**: View all teachers with their group counts and average progress
- **Progress Tracking**: Visual progress bars and status badges
- **Stale Group Alerts**: Automatic detection of groups not updated in 7+ days

### 👨‍🏫 Faculty Management
- Track groups under **3 faculty members**:
  - Tayyab Sir
  - Vinay Sir
  - Chanchal Sir
- View detailed statistics per teacher
- Filter groups by branch (IT, CSE-A, CSE-B)
- Sort by progress or recent updates

### 📝 Group Management
- **Add New Groups**: Complete form with validation
- **Group Limits**: Maximum 6 groups per teacher
- **Progress Tracking**: 0-100% progress slider
- **Update Notes**: Track progress history with timestamped notes
- **Student Information**: Store 2 students per group with contact details
- **Project Details**: Tech stack, project idea, and branch information

### 🔍 Advanced Features
- **Search**: Find groups by student name, tech stack, or project idea
- **Filter & Sort**: Branch filtering and multiple sort options
- **Export to CSV**: Download group data for reports
- **Progress Charts**: Visual timeline of progress updates (Recharts)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### 🎨 UI/UX
- **Premium Design**: Inspired by Stripe, Notion, and Linear
- **Smooth Animations**: Framer Motion transitions and interactions
- **Soft Shadows & Rounded Cards**: Modern, clean aesthetic
- **Status Badges**: Color-coded progress indicators
  - 🔴 Red: < 40% (Low Progress)
  - 🟡 Yellow: 40-70% (In Progress)
  - 🟢 Green: > 70% (On Track)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Router** for navigation
- **Recharts** for data visualization
- **React Icons** for iconography

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** middleware
- **Express Validator** for input validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd minor
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
```bash
# Create .env file in backend folder
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/faculty-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@tracker.com
ADMIN_PASSWORD=admin123
```

4. **Seed the Database**
```bash
npm run seed
```

5. **Start Backend Server**
```bash
npm run dev
```

6. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
```

7. **Start Frontend**
```bash
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Default Login Credentials

```
Email: admin@tracker.com
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

---

## 📁 Project Structure

```
minor/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── groupController.js # Group CRUD operations
│   │   └── teacherController.js # Teacher operations
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── Admin.js           # Admin schema
│   │   ├── Group.js           # Group schema
│   │   └── Teacher.js         # Teacher schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── groupRoutes.js     # Group endpoints
│   │   └── teacherRoutes.js   # Teacher endpoints
│   ├── .env                   # Environment variables
│   ├── seed.js                # Database seeder
│   ├── server.js              # Express app entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout with nav
│   │   │   └── LoadingSpinner.jsx  # Loading component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   └── ThemeContext.jsx    # Dark mode management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── TeacherDetail.jsx   # Teacher groups view
│   │   │   ├── AddGroup.jsx        # Create group form
│   │   │   └── GroupDetail.jsx     # Group details & updates
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── utils/
│   │   │   └── helpers.js          # Utility functions
│   │   ├── App.jsx                 # App component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile (protected)

### Groups
- `GET /api/groups` - Get all groups (with filters)
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create new group (protected)
- `PUT /api/groups/:id` - Update group progress (protected)
- `DELETE /api/groups/:id` - Delete group (protected)
- `GET /api/groups/stats/dashboard` - Get dashboard statistics (protected)

### Teachers
- `GET /api/teachers` - Get all teachers (protected)
- `GET /api/teachers/:id` - Get single teacher (protected)

---

## 🎯 Usage Guide

### Adding a New Group
1. Click "Add Group" in the navigation
2. Select teacher (max 6 groups per teacher)
3. Enter group number (1-6)
4. Select branch (IT, CSE-A, CSE-B)
5. Enter project details (stack, idea)
6. Add both students with mobile numbers (10 digits)
7. Click "Create Group"

### Updating Progress
1. Navigate to a group's detail page
2. Click the edit icon in "Update Progress" section
3. Use the slider to set progress (0-100%)
4. Add notes about the progress made
5. Click "Save Update"
6. View progress history and timeline chart

### Exporting Data
- **Dashboard**: Click "Export All Data" to download all groups
- **Teacher Page**: Click "Export CSV" to download teacher's groups
- CSV includes: teacher, group, branch, stack, students, progress, notes

---

## 🎨 Design Features

### Color System
- **Primary**: Indigo/Blue (#6366F1)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Dark Mode
Toggle using the sun/moon icon in the navigation bar. Preference is saved to localStorage.

### Animations
- Page transitions with Framer Motion
- Card hover effects with lift animation
- Progress bar fill animations
- Smooth loading skeletons
- Stagger animations for list items

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes with middleware
- Input validation on frontend and backend
- CORS configuration
- Secure cookie handling
- Mobile number format validation
- Group number constraint validation

---

## 🚨 Validation Rules

### Group Creation
- Teacher selection is required
- Group number: 1-6 only
- Maximum 6 groups per teacher
- No duplicate group numbers per teacher
- Branch selection required
- Mobile numbers: exactly 10 digits
- All fields are mandatory

### Progress Updates
- Progress: 0-100%
- Notes are required for each update
- Updates are timestamped automatically

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🧪 Sample Data

The seed script creates:
- 1 admin account
- 3 teachers
- 6 sample groups with varying progress levels

Run `npm run seed` in the backend folder to populate the database.

---

## 🔄 Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```bash
npm run dev        # Start development server (port 3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

### CORS Issues
- Ensure backend is running on http://localhost:5000
- Check proxy configuration in vite.config.js

---

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Ensure MongoDB URI points to cloud database (MongoDB Atlas)
3. Deploy using platform CLI or Git

### Frontend (Vercel/Netlify)
1. Update API base URL in api.js
2. Run build command: `npm run build`
3. Deploy dist folder

---

## 📝 Future Enhancements

- [ ] Email notifications for low progress groups
- [ ] File upload for project documentation
- [ ] Multi-admin support with roles
- [ ] Activity logs and audit trail
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reports
- [ ] Batch operations for groups
- [ ] Project milestone tracking

---

## 👥 Credits

Developed as a comprehensive admin dashboard for faculty project tracking.

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using the MERN Stack**
