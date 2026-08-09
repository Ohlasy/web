import type { Short } from "@/src/data/shorts";

export type ShortsBoxProps = {
  shorts: Short[];
};

export const ShortsBox = ({ shorts }: ShortsBoxProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-7 -mb-4 scroll-px-4">
      {shorts.map((video) => (
        <div
          key={video.id}
          className="snap-start shrink-0 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
        >
          <div className="relative w-full aspect-[9/16] overflow-hidden rounded-lg bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${video.id}`}
              title="YouTube Short"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
};
