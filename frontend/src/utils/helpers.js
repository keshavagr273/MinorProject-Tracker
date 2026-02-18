export const getProgressColor = (progress) => {
    if (progress < 40) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (progress < 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-600 bg-green-100 dark:bg-green-900/30';
};

export const getProgressBadge = (progress) => {
    if (progress < 40) return { text: 'Low Progress', color: 'bg-red-500' };
    if (progress < 70) return { text: 'In Progress', color: 'bg-yellow-500' };
    return { text: 'On Track', color: 'bg-green-500' };
};

export const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const exportToCSV = (groups) => {
    const headers = [
        'Teacher',
        'Group',
        'Branch',
        'Stack',
        'Idea',
        'Student 1',
        'Roll No 1',
        'Mobile 1',
        'Student 2',
        'Roll No 2',
        'Mobile 2',
        'Progress',
        'Last Updated',
        'Notes'
    ];

    const rows = groups.map(group => [
        group.teacherName,
        group.groupNumber,
        group.branch,
        group.projectStack,
        group.projectIdea,
        group.student1Name,
        group.rollNo1,
        group.mobile1,
        group.student2Name,
        group.rollNo2,
        group.mobile2,
        group.progress,
        new Date(group.lastUpdated).toLocaleDateString(),
        group.notes
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty-project-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
};
