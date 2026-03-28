// hooks/useReviews.ts
import { useState, useEffect } from "react";

interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    productId: string;
    createdAt: string;
    user?: {
        name: string;
        image: string;
    };
}

export function useReviews(productId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reviews?productId=${productId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reviews");
            }

            setReviews(data.reviews);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    return { reviews, loading, error, refetch: fetchReviews };
}