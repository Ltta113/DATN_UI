import React from 'react';

interface ViewAllHeaderProps {
    title: string;
    actionText?: string;
    onAction?: () => void;
}

export const ViewAllHeader = ({
    title,
    actionText = "Xem tất cả",
    onAction
}: ViewAllHeaderProps) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
                className="text-blue-500 flex items-center cursor-pointer hover:text-blue-700"
                onClick={onAction}
            >
                {actionText} <span className="ml-2">→</span>
            </button>
        </div>
    );
};