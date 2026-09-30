'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from '@/components/ui/overlay';
import { track } from '@/lib/analytics';

export function PropertyGallery({
  images,
  name,
}: {
  images: Array<{ url: string; alt: string }>;
  name: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const cover = images[0];
  const rest = images.slice(1, 5);

  function open(i: number) {
    setIndex(i);
    track('property_gallery_opened', { property: name, index: i });
  }

  return (
    <>
      <div className="grid gap-2 lg:grid-cols-4 lg:grid-rows-2">
        <button
          type="button"
          onClick={() => open(0)}
          className="group relative aspect-[4/3] overflow-hidden bg-slate-100 lg:col-span-2 lg:row-span-2 lg:aspect-auto"
          aria-label="Open photo gallery"
        >
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          ) : null}
          <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/85 px-3.5 py-2 font-label text-[9px] tracking-[0.22em] text-white">
            VIEW ALL {images.length} PHOTOS
          </span>
        </button>

        {rest.map((image, i) => (
          <button
            key={image.url}
            type="button"
            onClick={() => open(i + 1)}
            className="group relative hidden aspect-[4/3] overflow-hidden bg-slate-100 lg:block"
            aria-label={`Open photo ${i + 2} of ${images.length}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
            {i === rest.length - 1 && images.length > 5 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 font-display text-3xl text-white">
                +{images.length - 5}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
        name={name}
      />
    </>
  );
}
