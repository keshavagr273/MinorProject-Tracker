import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProgressBadge, formatDate } from '../utils/helpers';
import {
    FiArrowLeft,
    FiEdit3,
    FiPhone,
    FiCode,
    FiLayers,
    FiUsers,
    FiCalendar,
    FiCheckCircle,
    FiAlertCircle,
    FiTrash2
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateData, setUpdateData] = useState({
        progress: 0,
        notes: ''
    });

    useEffect(() => {
        fetchGroup();
    }, [id]);

    const fetchGroup = async () => {
        try {
            const { data } = await groupAPI.getById(id);
            setGroup(data);
            setUpdateData({
                progress: data.progress,
                notes: ''
            });
        } catch (error) {
            console.error('Error fetching group:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            await groupAPI.update(id, updateData);
            await fetchGroup();
            setShowUpdateForm(false);
            setUpdateData({ progress: group.progress, notes: '' });
        } catch (error) {
            console.error('Error updating group:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            try {
                await groupAPI.delete(id);
                navigate(`/teacher/${encodeURIComponent(group.teacherName)}`);
            } catch (error) {
                console.error('Error deleting group:', error);
                alert('Failed to delete group');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Group not found</p>
                <Link to="/" className="btn-primary mt-4 inline-flex">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const badge = getProgressBadge(group.progress);

    // Prepare chart data
    const chartData = group.progressHistory?.map((item, index) => ({
        name: `Update ${index + 1}`,
        progress: item.progress,
        date: new Date(item.updatedAt).toLocaleDateString()
    })) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to={`/teacher/${encodeURIComponent(group.teacherName)}`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                        <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Group {group.groupNumber} - {group.teacherName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {group.branch} · Last updated {formatDate(group.lastUpdated)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200"
                >
                    <FiTrash2 />
                    <span>Delete Group</span>
                </button>
            </div>

            {/* Progress Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {group.progress}%
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Overall Progress</p>
                    </div>
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${group.progress < 40
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : group.progress < 70
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                        {badge.text}
                    </span>
                </div>
                <div className="w-full bg-white dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${group.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${badge.color}`}
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Project Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <FiCode className="text-primary-600 dark:text-primary-400 text-xl mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tech Stack</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{group.projectStack}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FiLayers className="text-primary-600 dark:text-primary-400 text-xl mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Project Idea</p>
                                    <p className="text-gray-900 dark:text-white">{group.projectIdea}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FiCalendar className="text-primary-600 dark:text-primary-400 text-xl mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Latest Notes</p>
                                    <p className="text-gray-900 dark:text-white">{group.notes || 'No notes yet'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress History */}
                    {chartData.length > 0 && (
                        <div className="card">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Progress Timeline
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#6B7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#6B7280"
                                        style={{ fontSize: '12px' }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#F3F4F6'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="progress"
                                        stroke="#6366F1"
                                        strokeWidth={3}
                                        dot={{ fill: '#6366F1', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Update History */}
                    {group.progressHistory && group.progressHistory.length > 0 && (
                        <div className="card">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Update History
                            </h3>
                            <div className="space-y-4">
                                {[...group.progressHistory].reverse().map((update, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                    >
                                        <div className={`p-2 rounded-lg ${update.progress < 40
                                            ? 'bg-red-100 dark:bg-red-900/30'
                                            : update.progress < 70
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                                : 'bg-green-100 dark:bg-green-900/30'
                                            }`}>
                                            <FiCheckCircle className={
                                                update.progress < 40
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : update.progress < 70
                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                        : 'text-green-600 dark:text-green-400'
                                            } />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    Progress: {update.progress}%
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(update.updatedAt)}
                                                </p>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                {update.notes}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Students Info */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiUsers className="mr-2" />
                            Students
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {group.student1Name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Roll No: {group.rollNo1}
                                </p>
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                                    <FiPhone className="text-xs" />
                                    <a href={`tel:${group.mobile1}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                                        {group.mobile1}
                                    </a>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {group.student2Name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Roll No: {group.rollNo2}
                                </p>
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                                    <FiPhone className="text-xs" />
                                    <a href={`tel:${group.mobile2}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                                        {group.mobile2}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Progress Form */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Update Progress
                            </h3>
                            {!showUpdateForm && (
                                <button
                                    onClick={() => setShowUpdateForm(true)}
                                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                >
                                    <FiEdit3 className="text-xl" />
                                </button>
                            )}
                        </div>

                        {showUpdateForm ? (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="label">
                                        Progress: {updateData.progress}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={updateData.progress}
                                        onChange={(e) => setUpdateData({ ...updateData, progress: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">
                                        Notes <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={updateData.notes}
                                        onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                                        className="input min-h-[100px] resize-y"
                                        placeholder="What progress has been made?"
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUpdateForm(false);
                                            setUpdateData({ progress: group.progress, notes: '' });
                                        }}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating || !updateData.notes.trim()}
                                        className="btn-primary flex-1"
                                    >
                                        {updating ? 'Saving...' : 'Save Update'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Click the edit icon to update progress and add notes.
                            </p>
                        )}
                    </div>

                    {/* Warning if stale */}
                    {(() => {
                        const daysSinceUpdate = Math.floor(
                            (new Date() - new Date(group.lastUpdated)) / (1000 * 60 * 60 * 24)
                        );
                        if (daysSinceUpdate >= 7) {
                            return (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-xl mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Update Needed
                                            </p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                This group hasn't been updated in {daysSinceUpdate} days.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
