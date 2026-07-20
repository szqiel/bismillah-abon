import { inventory } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category as string | undefined;

  const filteredInventory = categoryParam 
    ? inventory.filter(item => item.category === categoryParam)
    : inventory;

  return (
    <div className="px-margin-desktop py-xl bg-surface min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg border-b-2 border-on-tertiary-fixed pb-sm">
        <h1 className="font-display-xl text-[48px] md:text-display-lg uppercase leading-none text-on-surface">
          Gear Catalog
        </h1>
        {categoryParam && (
          <span className="font-label-caps text-label-caps text-primary uppercase mt-sm md:mt-0">
            Category: {categoryParam}
          </span>
        )}
      </div>

      {filteredInventory.length === 0 ? (
        <div className="text-center py-xl font-body-lg text-on-surface-variant">
          No gear found in this category.
        </div>
      ) : (
        <div className="grid-technical">
          {filteredInventory.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
