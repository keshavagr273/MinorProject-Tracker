import mongoose from 'mongoose';

const progressUpdateSchema = new mongoose.Schema({
    progress: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    notes: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const groupSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: true,
        enum: ['Tayyab Sir', 'Vinay Sir', 'Chanchal Sir']
    },
    groupNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    branch: {
        type: String,
        required: true,
        enum: ['IT', 'CSE-A', 'CSE-B']
    },
    projectStack: {
        type: String,
        required: true
    },
    projectIdea: {
        type: String,
        required: true
    },
    student1Name: {
        type: String,
        required: true
    },
    student2Name: {
        type: String,
        required: true
    },
    mobile1: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    mobile2: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    progressHistory: [progressUpdateSchema]
}, {
    timestamps: true
});

// Compound index to ensure unique group number per teacher
groupSchema.index({ teacherName: 1, groupNumber: 1 }, { unique: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;
