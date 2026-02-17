import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProgressBadge, formatDate, exportToCSV } from '../utils/helpers';
import {
    FiArrowLeft,
    FiFilter,
    FiSearch,
    FiEye,
    FiDownload
} from 'react-icons/fi';

const TeacherDetail = () => {
    const { teacherName } = useParams();
    const decodedTeacherName = decodeURIComponent(teacherName);
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [sortBy, setSortBy] = useState('groupNumber');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGroups();
    }, [decodedTeacherName]);

    useEffect(() => {
        filterAndSortGroups();
    }, [groups, selectedBranch, sortBy, searchTerm]);

    const fetchGroups = async () => {
        try {
            const { data } = await groupAPI.getAll({ teacherName: decodedTeacherName });
            setGroups(data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortGroups = () => {
        let filtered = [...groups];

        // Filter by branch
        if (selectedBranch !== 'all') {
            filtered = filtered.filter(group => group.branch === selectedBranch);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(group =>
                group.student1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.student2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.projectStack.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.projectIdea.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'groupNumber') {
                return a.groupNumber - b.groupNumber;
            } else if (sortBy === 'progress-asc') {
                return a.progress - b.progress;
            } else if (sortBy === 'progress-desc') {
                return b.progress - a.progress;
            } else if (sortBy === 'recent') {
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            }
            return 0;
        });

        setFilteredGroups(filtered);
    };

    const branches = ['IT', 'CSE-A', 'CSE-B'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const avgProgress = groups.length > 0
        ? Math.round(groups.reduce((sum, g) => sum + g.progress, 0) / groups.length)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                        <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {decodedTeacherName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {groups.length} {groups.length === 1 ? 'Group' : 'Groups'} · Average Progress: {avgProgress}%
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => exportToCSV(filteredGroups)}
                    className="btn-primary"
                    disabled={filteredGroups.length === 0}
                >
                    <FiDownload />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="label">
                            <FiSearch className="inline mr-2" />
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by student, stack, or idea..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>

                    {/* Branch Filter */}
                    <div>
                        <label className="label">
                            <FiFilter className="inline mr-2" />
                            Filter by Branch
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Branches</option>
                            {branches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="label">
                            Sort by
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input"
                        >
                            <option value="groupNumber">Group Number</option>
                            <option value="progress-asc">Progress (Low to High)</option>
                            <option value="progress-desc">Progress (High to Low)</option>
                            <option value="recent">Recently Updated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Groups Table */}
            <div className="card overflow-hidden p-0">
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No groups found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Group
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Branch
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Stack
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Students
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredGroups.map((group, index) => {
                                    const badge = getProgressBadge(group.progress);
                                    return (
                                        <motion.tr
                                            key={group._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                    Group {group.groupNumber}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Updated {formatDate(group.lastUpdated)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                                    {group.branch}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {group.projectStack}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {group.projectIdea}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {group.student1Name}
                                                </div>
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {group.student2Name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-32">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                            {group.progress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full ${badge.color} progress-bar`}
                                                            style={{ width: `${group.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${group.progress < 40
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                        : group.progress < 70
                                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    }`}>
                                                    {badge.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/group/${group._id}`}
                                                    className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                                                >
                                                    <FiEye />
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDetail;
