// components/ProductReviews.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useReviews } from "@/store/useReviews";
import toast from "react-hot-toast";

export function ProductReviews({ product }: { product: Product }) {
  const { data: session } = useSession();
  const { reviews, loading, error, refetch } = useReviews(product.id);

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWriteReview = async () => {
    if (!session) {
      toast.error("Please sign in to write a review", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating for this product", {
        duration: 4000,
      });
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review", {
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          productId: product.id,
          userId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Reset form
      setRating(0);
      setComment("");
      setIsWriteReviewOpen(false);

      // Refresh reviews
      await refetch();

      toast.success("Review submitted! Thank you for your feedback.", {
        duration: 4000,
        icon: "⭐",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review", {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load reviews: {error}</p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Public Sentiment</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        <Button
          onClick={() => setIsWriteReviewOpen(true)}
          className="bg-black hover:bg-black/90 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-lg"
        >
          Write Review
        </Button>
      </div>

      {/* Write Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Write a Review</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWriteReviewOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-black uppercase tracking-widest block mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-black uppercase tracking-widest block mb-3">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full p-3 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsWriteReviewOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWriteReview}
                disabled={isSubmitting}
                className="flex-1 bg-black hover:bg-black/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="p-8 bg-white border border-border/40 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-border/40">
                    {review.user?.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {review.user?.name || 'Anonymous User'}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-medium">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border border-dashed border-border/60">
          <MessageSquare className="w-12 h-12 text-muted-foreground/20 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">
            Be the first to provide feedback on this gear.
          </p>
        </div>
      )}
    </div>
  );
}