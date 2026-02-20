import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { groupAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { exportToCSV } from '../utils/helpers';
import {
    FiUsers,
    FiTrendingUp,
    FiAlertCircle,
    FiArrowRight,
    FiClock,
    FiDownload,
    FiSearch,
    FiX
} from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allGroups, setAllGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
        fetchAllGroups();
    }, []);

    useEffect(() => {
        // Close search results when clicking outside
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                handleSearch();
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const { data } = await groupAPI.getAll({ search: searchQuery });
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching groups:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const handleGroupClick = (groupId) => {
        navigate(`/group/${groupId}`);
        handleClearSearch();
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

            {/* Search Bar */}
            <div ref={searchRef} className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400 text-xl" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for students by name..."
                        className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <FiX className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl transition-colors" />
                        </button>
                    )}
                    {isSearching && (
                        <div className="absolute inset-y-0 right-12 flex items-center">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                    {showResults && searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-96 overflow-y-auto"
                        >
                            <div className="p-2">
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    Found {searchResults.length} {searchResults.length === 1 ? 'group' : 'groups'}
                                </div>
                                {searchResults.map((group) => (
                                    <motion.div
                                        key={group._id}
                                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                        onClick={() => handleGroupClick(group._id)}
                                        className="p-4 cursor-pointer rounded-lg transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                                                        {group.teacherName} - Group {group.groupNumber}
                                                    </span>
                                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                        {group.branch}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {group.student1Name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {group.rollNo1}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {group.student2Name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {group.rollNo2}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Project:</span> {group.projectIdea}
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${group.progress < 40
                                                                    ? 'bg-red-500'
                                                                    : group.progress < 70
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${group.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {group.progress}%
                                                    </span>
                                                </div>
                                            </div>
                                            <FiArrowRight className="text-gray-400 ml-4 flex-shrink-0" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-8"
                        >
                            <div className="text-center">
                                <FiSearch className="text-4xl text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    No groups found for "{searchQuery}"
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    Try searching with a different student name
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
