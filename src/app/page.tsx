import { getProducts, getMainCategories, getCollections } from "@/lib/actions/product";
import { HomeContent } from "@/components/home/HomeContent";

export default async function HomePage() {
  const [
    mainCategories,
    collectionsData
  ] = await Promise.all([
     getMainCategories(),
     getCollections()
  ]);

  // Fetch products for each collection
  const collectionsWithProducts = await Promise.all(
    collectionsData.map(async (collection) => {
      const products = await getProducts({ collectionSlug: collection.slug, limit: 4 });
      return {
        ...collection,
        products
      };
    })
  );

  return <HomeContent 
    mainCategories={mainCategories}
    collections={collectionsWithProducts}
  />;
}


