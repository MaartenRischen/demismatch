import Navigation from "@/components/Navigation";

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero Header */}
      <header className="py-16 md:py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Writing
          </p>
          <h1
            className="text-3xl md:text-5xl text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Blog
          </h1>
          <p
            className="text-lg text-white/80"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Thoughts on evolutionary mismatch, technology, and reclaiming what makes us human.
          </p>
        </div>
      </header>

      {/* Loading State */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E0D8] p-6 md:p-8 rounded-xl animate-pulse"
              >
                {/* Category skeleton */}
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-[#E5E0D8] rounded" />
                  <div className="h-5 w-20 bg-[#E5E0D8] rounded" />
                </div>

                {/* Title skeleton */}
                <div className="h-7 w-3/4 bg-[#E5E0D8] rounded mb-3" />

                {/* Date skeleton */}
                <div className="h-4 w-32 bg-[#E5E0D8] rounded mb-4" />

                {/* Excerpt skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-[#E5E0D8] rounded" />
                  <div className="h-4 w-5/6 bg-[#E5E0D8] rounded" />
                </div>

                {/* Link skeleton */}
                <div className="h-5 w-32 bg-[#E5E0D8] rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
