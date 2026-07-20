import { useEffect, useState } from "react";
import { FiStar, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
} from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

/* ── Star renderer ── */
const Stars = ({ rating, size = 16, interactive = false, onRate }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={size}
                    fill={(interactive ? hovered || rating : rating) >= star ? "#f59e0b" : "none"}
                    stroke={(interactive ? hovered || rating : rating) >= star ? "#f59e0b" : "#d1d5db"}
                    className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onRate && onRate(star)}
                />
            ))}
        </div>
    );
};

/* ── Single review card ── */
const ReviewCard = ({ review, currentUserId, onDeleted, onUpdated }) => {
    const [editing, setEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editText, setEditText] = useState(review.review_text || "");
    const [saving, setSaving] = useState(false);

    const isOwner = currentUserId && review.user_id === currentUserId;

    const handleDelete = async () => {
        if (!window.confirm("Delete your review?")) return;
        try {
            await deleteReview(review.review_id);
            toast.success("Review deleted");
            onDeleted(review.review_id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateReview(review.review_id, { rating: editRating, review_text: editText });
            toast.success("Review updated");
            onUpdated({ ...review, rating: editRating, review_text: editText });
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                        {review.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{review.customer_name}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.review_date).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {isOwner && !editing && (
                    <div className="flex gap-1.5">
                        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition">
                            <FiEdit2 size={14} />
                        </button>
                        <button onClick={handleDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-3">
                {editing ? (
                    <div className="space-y-3">
                        <Stars rating={editRating} size={20} interactive onRate={setEditRating} />
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition disabled:opacity-60">
                                <FiCheck size={12} /> Save
                            </button>
                            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
                                <FiX size={12} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Stars rating={review.rating} size={15} />
                        {review.review_text && (
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.review_text}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

/* ── Main component ── */
const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({ total_reviews: 0, average_rating: null });
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [newText, setNewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const hasReviewed = reviews.some((r) => r.user_id === user?.user_id);

    const fetchReviews = async () => {
        try {
            const data = await getProductReviews(productId);
            setReviews(data.data);
            setSummary(data.summary);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newRating === 0) return toast.error("Please select a star rating");
        setSubmitting(true);
        try {
            await createReview(productId, { rating: newRating, review_text: newText });
            toast.success("Review submitted!");
            setNewRating(0);
            setNewText("");
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleted = (reviewId) => {
        setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
        setSummary((prev) => ({ ...prev, total_reviews: prev.total_reviews - 1 }));
    };

    const handleUpdated = (updated) => {
        setReviews((prev) => prev.map((r) => (r.review_id === updated.review_id ? updated : r)));
    };

    // Rating bar breakdown
    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    const [showAllReviews, setShowAllReviews] = useState(false);

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

    return (
        <div className="mt-12">
            <hr className="border-gray-100 mb-8" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {/* Summary bar */}
            {!loading && summary.total_reviews > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 bg-gray-50 rounded-2xl p-6 mb-8">
                    {/* Big rating */}
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-5xl font-bold text-gray-900">
                            {Number(summary.average_rating).toFixed(1)}
                        </span>
                        <Stars rating={Math.round(summary.average_rating)} size={18} />
                        <span className="text-sm text-gray-400 mt-1">
                            {summary.total_reviews} {summary.total_reviews === 1 ? "review" : "reviews"}
                        </span>
                    </div>
                    {/* Bars */}
                    <div className="flex-1 space-y-1.5">
                        {ratingCounts.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-2 text-sm">
                                <span className="w-4 text-right text-gray-500">{star}</span>
                                <FiStar size={12} fill="#f59e0b" stroke="#f59e0b" />
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full"
                                        style={{
                                            width: summary.total_reviews
                                                ? `${(count / summary.total_reviews) * 100}%`
                                                : "0%",
                                        }}
                                    />
                                </div>
                                <span className="w-5 text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Write a review */}
            {user && !hasReviewed && (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-8">
                    <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
                    <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1.5">Your Rating</p>
                        <Stars rating={newRating} size={24} interactive onRate={setNewRating} />
                    </div>
                    <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Share your experience with this product... (optional)"
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none mb-3"
                    />
                    <button
                        type="submit"
                        disabled={submitting || newRating === 0}
                        className="px-5 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}

            {!user && (
                <p className="text-sm text-gray-400 mb-6 italic">Login to leave a review.</p>
            )}

            {/* Review list */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="space-y-4">
                    {displayedReviews.map((review) => (
                        <ReviewCard
                            key={review.review_id}
                            review={review}
                            currentUserId={user?.user_id}
                            onDeleted={handleDeleted}
                            onUpdated={handleUpdated}
                        />
                    ))}
                    
                    {reviews.length > 4 && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="px-6 py-2 rounded-xl border border-teal-200 text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-colors"
                            >
                                {showAllReviews ? "Show less" : `See all ${reviews.length} reviews`}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { Stars };
export default ProductReviews;
