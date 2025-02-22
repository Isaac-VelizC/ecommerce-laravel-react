import React from "react";

interface FullScreenLoaderProps {
    show: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        </div>
    );
};

export default FullScreenLoader;
