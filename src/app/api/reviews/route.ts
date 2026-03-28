// app/api/reviews/route.ts
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET endpoint - fetch all reviews for a product
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        const { data: reviews, error } = await supabase
            .from("Review")
            .select(`
        *,
        user:userId (
          name,
          image
        )
      `)
            .eq("productId", productId)
            .order("createdAt", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ reviews, success: true });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews", success: false },
            { status: 500 }
        );
    }
}


// POST endpoint - create a new review
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rating, comment, productId, userId } = body;

        // Validate required fields
        if (!rating || !comment || !productId || !userId) {
            return NextResponse.json(
                { error: "Missing required fields", success: false },
                { status: 400 }
            );
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5", success: false },
                { status: 400 }
            );
        }

        // Start a transaction to ensure both operations succeed or fail together
        const { data: review, error: reviewError } = await supabase
            .from("Review")
            .insert([
                {
                    rating,
                    comment,
                    userId,
                    productId,
                },
            ])
            .select(`
        *,
        user:userId (
          name,
          image
        )
      `)
            .single();

        if (reviewError) throw reviewError;

        // Get all reviews for this product to calculate the new average
        const { data: allReviews, error: fetchError } = await supabase
            .from("Review")
            .select("rating")
            .eq("productId", productId);

        if (fetchError) throw fetchError;

        // Calculate new average rating
        const totalRatings = allReviews.length;
        const sumRatings = allReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        const averageRating = sumRatings / totalRatings;

        // Round to 2 decimal places for cleaner display
        const roundedAverage = Math.round(averageRating * 100) / 100;

        // Update the product with new reviews count and rating
        const { error: updateError } = await supabase
            .from("Product")
            .update({
                reviewsCount: totalRatings,
                rating: roundedAverage,
                updatedAt: new Date().toISOString(),
            })
            .eq("id", productId);

        if (updateError) throw updateError;

        return NextResponse.json({
            review,
            success: true,
            productStats: {
                reviewsCount: totalRatings,
                rating: roundedAverage
            }
        });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Failed to create review", success: false },
            { status: 500 }
        );
    }
}