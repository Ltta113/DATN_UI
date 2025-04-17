'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function BookCategorySelection() {
    const categories = [
        { id: 1, name: 'Fiction & Novel' },
        { id: 2, name: 'Psychology' },
        { id: 3, name: 'Biography & Travelogue' },
        { id: 4, name: 'Management & Business' },
        { id: 5, name: 'Free' },
        { id: 6, name: 'Literature' },
        { id: 7, name: 'Lifestyle' },
        { id: 8, name: 'Social Sciences' },
        { id: 9, name: 'Religion & Philosophy' },
        { id: 10, name: 'Philosophy & Mysticism' },
        { id: 11, name: 'History' },
        { id: 12, name: 'Children & Youth' },
        { id: 13, name: 'Science' },
        { id: 14, name: 'Technology' },
        { id: 15, name: 'Educational' },
        { id: 16, name: 'Art' },
        { id: 17, name: 'Marketing' },
        { id: 18, name: 'Foreign Languages' },
        { id: 19, name: 'Finance & Investment' },
        { id: 20, name: 'Magazine' },
    ];

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const maxSelections = 3;

    const toggleCategory = (id: number) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
        } else {
            // Only add if we haven't reached the maximum selection
            if (selectedCategories.length < maxSelections) {
                setSelectedCategories([...selectedCategories, id]);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 relative">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Select Categories of Interest
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Select up to {maxSelections} categories
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            disabled={!selectedCategories.includes(category.id) && selectedCategories.length >= maxSelections}
                            className={`py-3 px-4 rounded-lg text-center transition-colors duration-200
                ${selectedCategories.includes(category.id)
                                    ? 'bg-blue-500 text-white'
                                    : selectedCategories.length >= maxSelections
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        className={`py-3 px-16 rounded-md text-center font-medium transition-colors duration-200
              ${selectedCategories.length > 0
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                            }`}
                    >
                        {selectedCategories.length > 0 ? "Let's Go" : "Skip"}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none">
                <Image
                    src="/book-stack.png"
                    alt="Stack of books"
                    width={256}
                    height={256}
                    priority
                />
            </div>
        </div>
    );
}