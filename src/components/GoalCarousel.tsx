"use client";

type GoalCarouselProps = {
  images: Array<{ src: string; alt?: string }>;
  /** Seconds for one full loop */
  durationSec?: number;
  /** Fixed height of the carousel viewport */
  heightClassName?: string;
};

export default function GoalCarousel({
  images,
  durationSec = 90,
  heightClassName = "h-96",
}: GoalCarouselProps) {
  const safeImages = images.filter(i => !!i?.src);
  const loopImages = [...safeImages, ...safeImages];

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
        heightClassName,
      ].join(" ")}
      style={{ ["--duration" as any]: `${durationSec}s` }}
      aria-label="Auto-scrolling image carousel"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-50 to-transparent z-10" />

      <div className="absolute inset-0 flex items-center">
        <div className="goalCarouselTrack flex items-center gap-4 pr-4 will-change-transform">
          {loopImages.map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="goalCarouselTile h-[90%] w-[320px] shrink-0 rounded-md overflow-hidden bg-white shadow-sm border border-gray-100"
            >
              <img
                src={img.src}
                alt={img.alt || ""}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .goalCarouselTrack {
          animation: goalCarouselScroll var(--duration) linear infinite;
        }
        @keyframes goalCarouselScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .goalCarouselTrack {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}


