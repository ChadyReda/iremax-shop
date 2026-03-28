import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/actions/product";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        // ✅ Validate input
        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json(
                { error: "Invalid request: ids must be an array" },
                { status: 400 }
            );
        }

        // ✅ Optional: prevent abuse (too many IDs)
        if (ids.length > 100) {
            return NextResponse.json(
                { error: "Too many product IDs" },
                { status: 400 }
            );
        }

        // ✅ Fetch products from DB
        const products = await getProductsByIds(ids);

        // ✅ Optional: preserve order (important for cart UX)
        const productsMap = new Map(products.map((p) => [p.id, p]));
        const orderedProducts = ids
            .map((id: string) => productsMap.get(id))
            .filter(Boolean);

        return NextResponse.json(orderedProducts);

    } catch (error) {
        console.error("API ERROR:", error);

        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}