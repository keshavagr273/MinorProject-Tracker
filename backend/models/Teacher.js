import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Tayyab Sir', 'Vinay Sir', 'Chanchal Sir'],
        unique: true
    }
}, {
    timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
