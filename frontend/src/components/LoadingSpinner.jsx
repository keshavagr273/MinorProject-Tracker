import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
    const sizeClass = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }[size];

    const spinner = (
        <motion.div
            className={`${sizeClass} border-4 border-primary-200 border-t-primary-600 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
