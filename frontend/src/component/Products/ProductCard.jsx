export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="group bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col relative mt-5 p-4 max-w-2xs">
      {/* <div className="absolute top-2 left-2 z-10">
        {product.badge && (
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold">
            {product.badge}
          </span>
        )}
      </div> */}
      <div className="aspect-square bg-surface overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-sm"
          alt={product.name}
          //   src={product.image}
        />
      </div>
      <div className="p-stack-md flex flex-col flex-1">
        <span className="text-label-sm text-outline font-bold uppercase tracking-wider">
          {product.brand}
        </span>
        <h3 className="text-body-md font-bold text-on-surface line-clamp-2 mt-1 mb-2 h-12">
          {product.name}
        </h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-headline-sm font-bold text-primary">
              {product.price.toLocaleString()}฿
            </span>
          </div>
        </div>
      </div>
      <button className="absolute bottom-4 right-4 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all active:scale-90">
        <span className="material-symbols-outlined">add_shopping_cart</span>
      </button>
    </div>
  );
}
