import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupAPI } from '../services/api';
import { FiArrowLeft, FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const AddGroup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        teacherName: '',
        groupNumber: '',
        branch: '',
        projectStack: '',
        projectIdea: '',
        student1Name: '',
        rollNo1: '',
        student2Name: '',
        rollNo2: '',
        mobile1: '',
        mobile2: ''
    });

    const teachers = ['Tayyab Sir', 'Vinay Sir', 'Chanchal Sir'];
    const branches = ['IT', 'CSE-A', 'CSE-B'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        // Teacher validation
        if (!formData.teacherName) {
            setError('Please select a teacher');
            return false;
        }

        // Group number validation
        const groupNum = parseInt(formData.groupNumber);
        if (!groupNum || groupNum < 1 || groupNum > 6) {
            setError('Group number must be between 1 and 6');
            return false;
        }

        // Branch validation
        if (!formData.branch) {
            setError('Please select a branch');
            return false;
        }

        // Project details validation
        if (!formData.projectStack.trim()) {
            setError('Project stack is required');
            return false;
        }

        if (!formData.projectIdea.trim()) {
            setError('Project idea is required');
            return false;
        }

        // Student names validation
        if (!formData.student1Name.trim() || !formData.student2Name.trim()) {
            setError('Both student names are required');
            return false;
        }

        // Roll number validation
        const rollNoRegex = /^[0-9]{8}$/;
        if (!rollNoRegex.test(formData.rollNo1)) {
            setError('Roll Number 1 must be exactly 8 digits');
            return false;
        }

        if (!rollNoRegex.test(formData.rollNo2)) {
            setError('Roll Number 2 must be exactly 8 digits');
            return false;
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile1)) {
            setError('Mobile 1 must be exactly 10 digits');
            return false;
        }

        if (!mobileRegex.test(formData.mobile2)) {
            setError('Mobile 2 must be exactly 10 digits');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await groupAPI.create({
                ...formData,
                groupNumber: parseInt(formData.groupNumber)
            });

            setSuccess(true);

            setTimeout(() => {
                navigate(`/teacher/${encodeURIComponent(formData.teacherName)}`);
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create group');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-96"
            >
                <div className="card text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <FiCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Group Created Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Redirecting to teacher's page...
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link
                    to="/"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                    <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Add New Group
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a new project group for students
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card space-y-6">
                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3"
                    >
                        <FiAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </motion.div>
                )}

                {/* Teacher & Group Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="label">
                            Teacher <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="teacherName"
                            value={formData.teacherName}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map(teacher => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">
                            Group Number (1-6) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="groupNumber"
                            value={formData.groupNumber}
                            onChange={handleChange}
                            className="input"
                            min="1"
                            max="6"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">
                            Project Stack <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="projectStack"
                            value={formData.projectStack}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., MERN Stack, Python + Flask"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label">
                        Project Idea <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="projectIdea"
                        value={formData.projectIdea}
                        onChange={handleChange}
                        className="input min-h-[100px] resize-y"
                        placeholder="Describe the project idea..."
                        required
                    />
                </div>

                {/* Student 1 Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Student 1 Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="label">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="student1Name"
                                value={formData.student1Name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter student name"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">
                                Roll Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="rollNo1"
                                value={formData.rollNo1}
                                onChange={handleChange}
                                className="input"
                                placeholder="8 digit roll number"
                                maxLength="8"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile1"
                                value={formData.mobile1}
                                onChange={handleChange}
                                className="input"
                                placeholder="10 digit mobile number"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Student 2 Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Student 2 Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="label">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="student2Name"
                                value={formData.student2Name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter student name"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">
                                Roll Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="rollNo2"
                                value={formData.rollNo2}
                                onChange={handleChange}
                                className="input"
                                placeholder="8 digit roll number"
                                maxLength="8"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile2"
                                value={formData.mobile2}
                                onChange={handleChange}
                                className="input"
                                placeholder="10 digit mobile number"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        to="/"
                        className="btn-secondary"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FiSave />
                                Create Group
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddGroup;
