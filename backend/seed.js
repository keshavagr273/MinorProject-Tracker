import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import Teacher from './models/Teacher.js';
import Group from './models/Group.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Admin.deleteMany();
        await Teacher.deleteMany();
        await Group.deleteMany();

        console.log('🗑️  Cleared existing data');

        // Create admin
        const admin = await Admin.create({
            email: process.env.ADMIN_EMAIL || 'admin@tracker.com',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });

        console.log('✅ Admin created:', admin.email);

        // Create teachers
        const teachers = await Teacher.insertMany([
            { name: 'Tayyab Sir' },
            { name: 'Vinay Sir' },
            { name: 'Chanchal Sir' }
        ]);

        console.log('✅ Teachers created:', teachers.length);

        // Create sample groups
        const sampleGroups = [
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 1,
                branch: 'CSE-A',
                projectStack: 'MERN Stack',
                projectIdea: 'E-commerce Platform with AI-powered recommendations',
                student1Name: 'Rahul Sharma',
                rollNo1: '21010101',
                student2Name: 'Priya Patel',
                rollNo2: '21010102',
                mobile1: '9876543210',
                mobile2: '9876543211',
                progress: 75,
                notes: 'Backend APIs completed, working on frontend integration'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 2,
                branch: 'CSE-A',
                projectStack: 'React Native',
                projectIdea: 'Mobile app for campus event management',
                student1Name: 'Amit Kumar',
                rollNo1: '21010103',
                student2Name: 'Sneha Reddy',
                rollNo2: '21010104',
                mobile1: '9876543212',
                mobile2: '9876543213',
                progress: 45,
                notes: 'UI design completed, starting development'
            },
            {
                teacherName: 'Vinay Sir',
                groupNumber: 1,
                branch: 'IT',
                projectStack: 'Machine Learning',
                projectIdea: 'Student Performance Prediction System using ML',
                student1Name: 'Vikram Singh',
                rollNo1: '21020101',
                student2Name: 'Anjali Verma',
                rollNo2: '21020102',
                mobile1: '9876543214',
                mobile2: '9876543215',
                progress: 85,
                notes: 'Model training completed with 92% accuracy'
            },
            {
                teacherName: 'Vinay Sir',
                groupNumber: 2,
                branch: 'IT',
                projectStack: 'Python + Flask',
                projectIdea: 'Automated Attendance System with Face Recognition',
                student1Name: 'Arjun Mehta',
                rollNo1: '21020103',
                student2Name: 'Divya Shah',
                rollNo2: '21020104',
                mobile1: '9876543216',
                mobile2: '9876543217',
                progress: 30,
                notes: 'Face detection module in progress'
            },
            {
                teacherName: 'Chanchal Sir',
                groupNumber: 1,
                branch: 'CSE-B',
                projectStack: 'MERN Stack',
                projectIdea: 'Online Food Ordering System with Real-time Tracking',
                student1Name: 'Sanjay Gupta',
                rollNo1: '21030101',
                student2Name: 'Neha Joshi',
                rollNo2: '21030102',
                mobile1: '9876543218',
                mobile2: '9876543219',
                progress: 60,
                notes: 'Payment gateway integration completed'
            },
            {
                teacherName: 'Chanchal Sir',
                groupNumber: 2,
                branch: 'CSE-B',
                projectStack: 'Django + React',
                projectIdea: 'Hospital Management System with appointment scheduling',
                student1Name: 'Rohan Das',
                rollNo1: '21030103',
                student2Name: 'Kavya Nair',
                rollNo2: '21030104',
                mobile1: '9876543220',
                mobile2: '9876543221',
                progress: 20,
                notes: 'Database schema design completed'
            }
        ];

        const groups = await Group.insertMany(sampleGroups);
        console.log('✅ Sample groups created:', groups.length);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📧 Admin Login:');
        console.log('   Email:', admin.email);
        console.log('   Password:', process.env.ADMIN_PASSWORD || 'admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
