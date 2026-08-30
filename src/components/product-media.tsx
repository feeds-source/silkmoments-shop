import type { Product } from "@/lib/catalog";

export function ProductMedia({
  product,
  className = "h-52 md:h-72",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-elevated ${className}`}>
      <img src={product.image} alt="" className="ken absolute inset-0 h-full w-full object-cover" />
      {product.video && (
        <video
          className="motion-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={product.image}
          aria-hidden
        >
          <source src={product.video} type="video/mp4" />
        </video>
      )}
      {product.tag && (
        <span className="absolute left-3 top-3 bg-blush px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg">
          {product.tag}
        </span>
      )}
    </div>
  );
}
