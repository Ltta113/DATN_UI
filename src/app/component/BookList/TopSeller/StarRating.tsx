const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span key={`star-${rating}-${i}`} className="text-yellow-400 text-xl">
                    {i < rating ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
};

export default StarRating;