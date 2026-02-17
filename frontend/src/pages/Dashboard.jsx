import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { exportToCSV } from '../utils/helpers';
import {
    FiUsers,
    FiTrendingUp,
    FiAlertCircle,
    FiArrowRight,
    FiClock,
    FiDownload
} from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allGroups, setAllGroups] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchAllGroups();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await groupAPI.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllGroups = async () => {
        try {
            const { data } = await groupAPI.getAll();
            setAllGroups(data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Groups',
            value: stats?.totalGroups || 0,
            icon: FiUsers,
            color: 'bg-blue-500',
            lightBg: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: 'Average Progress',
            value: `${stats?.avgProgress || 0}%`,
            icon: FiTrendingUp,
            color: 'bg-green-500',
            lightBg: 'bg-green-50 dark:bg-green-900/30',
            textColor: 'text-green-600 dark:text-green-400'
        },
        {
            label: 'Low Progress Groups',
            value: stats?.lowProgressGroups || 0,
            icon: FiAlertCircle,
            color: 'bg-red-500',
            lightBg: 'bg-red-50 dark:bg-red-900/30',
            textColor: 'text-red-600 dark:text-red-400'
        },
        {
            label: 'Stale Groups (7+ days)',
            value: stats?.staleGroups || 0,
            icon: FiClock,
            color: 'bg-yellow-500',
            lightBg: 'bg-yellow-50 dark:bg-yellow-900/30',
            textColor: 'text-yellow-600 dark:text-yellow-400'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard Overview
                    </h1>
                    <button
                        onClick={() => exportToCSV(allGroups)}
                        className="btn-primary"
                        disabled={allGroups.length === 0}
                    >
                        <FiDownload />
                        Export All Data
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Monitor and track all project groups across faculty members
                </p>
            </div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="card"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.lightBg} p-3 rounded-xl`}>
                                    <Icon className={`text-2xl ${stat.textColor}`} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Teachers Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Faculty Members
                    </h2>
                    <Link
                        to="/add-group"
                        className="btn-primary text-sm"
                    >
                        Add New Group
                    </Link>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {stats?.teacherStats?.map((teacher, index) => (
                        <motion.div
                            key={teacher.name}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                            <Link
                                to={`/teacher/${encodeURIComponent(teacher.name)}`}
                                className="card block hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {teacher.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {teacher.count} {teacher.count === 1 ? 'Group' : 'Groups'}
                                        </p>
                                    </div>
                                    <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-xl">
                                        <FiUsers className="text-2xl text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Average Progress
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {teacher.avgProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${teacher.avgProgress}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className={`h-full rounded-full ${teacher.avgProgress < 40
                                                    ? 'bg-red-500'
                                                    : teacher.avgProgress < 70
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group">
                                    <span>View Groups</span>
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Quick Actions */}
            {stats?.lowProgressGroups > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                            <FiAlertCircle className="text-2xl text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                Attention Required
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                {stats.lowProgressGroups} {stats.lowProgressGroups === 1 ? 'group has' : 'groups have'} progress below 40%.
                                Consider checking on these projects.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
