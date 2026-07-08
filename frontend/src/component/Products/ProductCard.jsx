export default function ProductCard() {
  return (
    <>
      <div className="group bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col relative mt-5 p-4">
        <div className="absolute top-2 left-2 z-10">
          {/* <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold">
                  Hot Deal
                </span> */}
        </div>
        <div className="aspect-square bg-surface overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-sm"
            alt="A professional studio product photograph of high-end over-ear noise-canceling headphones in a matte black finish. The headphones are positioned against a clean, minimalist light gray background with soft, diffused cinematic lighting. The aesthetic is clean, technological, and high-performance, reflecting a premium gadget brand identity."
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.Ce8pViDAv_ZBPGfSJUQhGgHaFF%3Fr%3D0%26pid%3DApi&f=1&ipt=8f21ad9d25f8aebaa13e76a07a2dd04fce926c11f2d171fecdde9b997dc6a114&ipo=images"
          />
        </div>
        <div className="p-stack-md flex flex-col flex-1">
          <span className="text-label-sm text-outline font-bold uppercase tracking-wider">
            Cardboard
          </span>
          <h3 className="text-body-md font-bold text-on-surface line-clamp-2 mt-1 mb-2 h-12">
            การ์ดจอจากมิติอื่น RTX 9090 SUPER TI ULTRA
          </h3>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-headline-sm font-bold text-primary">
                1,200฿
              </span>
              <span className="text-body-sm text-outline line-through">
                12,900,000฿
              </span>
            </div>
          </div>
        </div>
        <button className="absolute bottom-4 right-4 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all active:scale-90">
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>
    </>
  );
}
