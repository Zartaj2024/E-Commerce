import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center md:px-8">
        <h1 className="max-w-lg font-heading text-4xl leading-tight text-ink md:text-5xl">
          Thread, held to the light.
        </h1>
        <p className="mt-4 max-w-md font-body text-base leading-relaxed text-charcoal">
          Hand-embroidered pieces, and custom work made to your fabric, thread,
          and story.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded bg-mahogany px-6 py-3 font-body text-sm text-kora transition-opacity hover:opacity-90"
        >
          Shop the collection
        </Link>
      </section>
    </div>
  );
}
