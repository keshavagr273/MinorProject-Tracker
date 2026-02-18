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
                branch: 'IT',
                projectStack: 'AI/ML',
                projectIdea: 'AI-powered real-time misinformation detection using NLP and deep learning',
                student1Name: 'Keshav Agrawal',
                rollNo1: '12312014',
                student2Name: 'Kapil Tanwar',
                rollNo2: '12312005',
                mobile1: '8922844467',
                mobile2: '7056794889',
                progress: 0,
                notes: 'Project initialized'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 2,
                branch: 'IT',
                projectStack: 'Trust Management in IoT',
                projectIdea: 'A scalable and lightweight trust evaluation framework for IOT',
                student1Name: 'Tushar Gupta',
                rollNo1: '12312021',
                student2Name: 'Nitish Kumar Choubey',
                rollNo2: '12312031',
                mobile1: '7078980601',
                mobile2: '6299530370',
                progress: 0,
                notes: 'Project initialized'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 3,
                branch: 'CSE-A',
                projectStack: 'AI/ML + Research Paper',
                projectIdea: 'Some Research Topic',
                student1Name: 'Jay Agrawal',
                rollNo1: '12311024',
                student2Name: 'Madhav Garg',
                rollNo2: '12311078',
                mobile1: '7534887015',
                mobile2: '7455836631',
                progress: 0,
                notes: 'Project initialized'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 4,
                branch: 'CSE-B',
                projectStack: 'AI/ML + Research Paper',
                projectIdea: 'AI Humanizer',
                student1Name: 'Neeraj',
                rollNo1: '12311079',
                student2Name: 'Prerak Yadav',
                rollNo2: '12311067',
                mobile1: '8607910154',
                mobile2: '7818092580',
                progress: 0,
                notes: 'Project initialized'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 5,
                branch: 'CSE-A',
                projectStack: 'Internship Portal',
                projectIdea: 'An Intelligent Internship and Opportunity Portal for Students and Recruiters with Role-Based Dashboards and Real-Time Application Tracking',
                student1Name: 'Swati',
                rollNo1: '12311060',
                student2Name: 'Krishnakant Lohar',
                rollNo2: '12311064',
                mobile1: '7087434103',
                mobile2: '8619996311',
                progress: 0,
                notes: 'Project initialized'
            },
            {
                teacherName: 'Tayyab Sir',
                groupNumber: 6,
                branch: 'CSE-B',
                projectStack: 'AI Humanizer',
                projectIdea: 'AI Humanizer',
                student1Name: 'Kshitij',
                rollNo1: '12311099',
                student2Name: 'Bhuvan Sharma',
                rollNo2: '22311004',
                mobile1: '7755880082',
                mobile2: '8837639379',
                progress: 0,
                notes: 'Project initialized'
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
