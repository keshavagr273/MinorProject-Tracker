import Group from '../models/Group.js';

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
export const getGroups = async (req, res) => {
    try {
        const { teacherName, branch, search } = req.query;

        let query = {};

        if (teacherName) {
            query.teacherName = teacherName;
        }

        if (branch) {
            query.branch = branch;
        }

        // Search by student name
        if (search) {
            query.$or = [
                { student1Name: { $regex: search, $options: 'i' } },
                { student2Name: { $regex: search, $options: 'i' } }
            ];
        }

        const groups = await Group.find(query).sort({ teacherName: 1, groupNumber: 1 });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (req, res) => {
    try {
        const {
            teacherName,
            groupNumber,
            branch,
            projectStack,
            projectIdea,
            student1Name,
            student2Name,
            mobile1,
            mobile2
        } = req.body;

        // Validate mobile numbers
        if (!/^[0-9]{10}$/.test(mobile1) || !/^[0-9]{10}$/.test(mobile2)) {
            return res.status(400).json({ message: 'Mobile numbers must be 10 digits' });
        }

        // Check if group number already exists for this teacher
        const existingGroup = await Group.findOne({ teacherName, groupNumber });
        if (existingGroup) {
            return res.status(400).json({
                message: `Group ${groupNumber} already exists for ${teacherName}`
            });
        }

        // Count existing groups for this teacher
        const groupCount = await Group.countDocuments({ teacherName });
        if (groupCount >= 6) {
            return res.status(400).json({
                message: `${teacherName} already has maximum 6 groups`
            });
        }

        const group = await Group.create({
            teacherName,
            groupNumber,
            branch,
            projectStack,
            projectIdea,
            student1Name,
            student2Name,
            mobile1,
            mobile2,
            progress: 0,
            lastUpdated: new Date(),
            notes: 'Group created'
        });

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update group progress
// @route   PUT /api/groups/:id
// @access  Private
export const updateGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const { progress, notes } = req.body;

        // Add to progress history
        if (progress !== undefined && notes) {
            group.progressHistory.push({
                progress,
                notes,
                updatedAt: new Date()
            });
        }

        // Update current progress and notes
        if (progress !== undefined) {
            group.progress = progress;
        }
        if (notes) {
            group.notes = notes;
        }
        group.lastUpdated = new Date();

        const updatedGroup = await group.save();
        res.json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        await group.deleteOne();
        res.json({ message: 'Group removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/groups/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const groups = await Group.find({});

        const totalGroups = groups.length;
        const avgProgress = totalGroups > 0
            ? groups.reduce((sum, group) => sum + group.progress, 0) / totalGroups
            : 0;

        const lowProgressGroups = groups.filter(group => group.progress < 40).length;

        // Groups not updated in 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const staleGroups = groups.filter(group => group.lastUpdated < sevenDaysAgo).length;

        // Teacher stats
        const teacherStats = {
            'Tayyab Sir': { count: 0, avgProgress: 0, groups: [] },
            'Vinay Sir': { count: 0, avgProgress: 0, groups: [] },
            'Chanchal Sir': { count: 0, avgProgress: 0, groups: [] }
        };

        groups.forEach(group => {
            teacherStats[group.teacherName].count++;
            teacherStats[group.teacherName].groups.push(group);
        });

        // Calculate avg progress for each teacher
        Object.keys(teacherStats).forEach(teacher => {
            const teacherGroups = teacherStats[teacher].groups;
            if (teacherGroups.length > 0) {
                teacherStats[teacher].avgProgress =
                    teacherGroups.reduce((sum, g) => sum + g.progress, 0) / teacherGroups.length;
            }
        });

        res.json({
            totalGroups,
            avgProgress: Math.round(avgProgress),
            lowProgressGroups,
            staleGroups,
            teacherStats: Object.keys(teacherStats).map(teacher => ({
                name: teacher,
                count: teacherStats[teacher].count,
                avgProgress: Math.round(teacherStats[teacher].avgProgress)
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
