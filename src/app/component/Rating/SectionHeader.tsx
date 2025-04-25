import React from 'react';

interface SectionHeaderProps {
    title: string;
    highlightedCount?: number;
    subtitle?: string;
}

export const SectionHeader = ({
    title,
    highlightedCount,
    subtitle
}: SectionHeaderProps) => {
    return (
        <div className="mb-6">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                {highlightedCount !== undefined && (
                    <span className="text-amber-500 text-xl font-bold">({highlightedCount})</span>
                )}
                {subtitle && <span className="text-gray-500">• {subtitle}</span>}
            </div>
        </div>
    );
};