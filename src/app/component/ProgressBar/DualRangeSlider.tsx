/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useEffect } from 'react';

type Props = {
    min: number;
    max: number;
    step?: number;
    onChange?: (values: { min: number; max: number }) => void;
    defaultMin?: number;
    defaultMax?: number;
};

const DualRangeSlider = ({
    min,
    max,
    step = 10000,
    onChange,
    defaultMin,
    defaultMax,
}: Props) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const [minVal, setMinVal] = useState(defaultMin && defaultMin >= min ? defaultMin : min);
    const [maxVal, setMaxVal] = useState(defaultMax && defaultMax <= max ? defaultMax : max);
    const [dragging, setDragging] = useState<null | 'min' | 'max'>(null);

    useEffect(() => {
        if (onChange) onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

    const formatCurrency = (value: number): string =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);

    const handleMouseMove = (e: MouseEvent) => {
        if (!trackRef.current || !dragging) return;
        const { left, width } = trackRef.current.getBoundingClientRect();
        let percent = (e.clientX - left) / width;
        percent = Math.min(Math.max(percent, 0), 1);
        const value = Math.round((min + percent * (max - min)) / step) * step;

        if (dragging === 'min') {
            if (value < maxVal) setMinVal(Math.max(min, value));
        } else if (dragging === 'max') {
            if (value > minVal) setMaxVal(Math.min(max, value));
        }
    };

    const stopDragging = () => setDragging(null);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', stopDragging);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopDragging);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopDragging);
        };
    }, [dragging]);

    return (
        <div className="w-full max-w-xl mx-auto p-3 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 font-semibold text-gray-800 text-lg">Khoảng giá</h3>

            <div ref={trackRef} className="relative h-4 bg-gray-300 rounded mb-8 cursor-pointer">
                {/* Track filled */}
                <div
                    className="absolute h-full bg-orange-500 rounded"
                    style={{
                        left: `${getPercent(minVal)}%`,
                        width: `${getPercent(maxVal) - getPercent(minVal)}%`,
                    }}
                />
                {/* Min thumb */}
                <div
                    onMouseDown={() => setDragging('min')}
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-pointer"
                    style={{ left: `calc(${getPercent(minVal)}% - 10px)` }}
                />
                {/* Max thumb */}
                <div
                    onMouseDown={() => setDragging('max')}
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-pointer"
                    style={{ left: `calc(${getPercent(maxVal)}% - 10px)` }}
                />
            </div>

            <div className="text-sm text-gray-700 bg-orange-50 border border-orange-200 p-3 rounded">
                Giá từ{' '}
                <span className="font-bold text-orange-600">{formatCurrency(minVal)}</span>{' '}
                đến{' '}
                <span className="font-bold text-orange-600">{formatCurrency(maxVal)}</span>
            </div>
        </div>
    );
};

export default DualRangeSlider;
