import { getProducts, getCategories } from "@/lib/actions/product";
import { CategoryContent } from "@/components/category/CategoryContent";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const search = searchParams.search;

  // Ideally, we search by category slug
  // For now, in a real DB, we'd lookup categoryId by slug
  const allCategories = await getCategories();
  const category = allCategories.find(c => c.slug === slug);

  const initialProducts = await getProducts({ 
    search, 
    ...(category && { categoryId: category.id }) 
  });
  
  return (
    <CategoryContent 
      initialProducts={initialProducts as any} 
      categories={allCategories as any}
      currentSlug={slug}
    />
  );
}
