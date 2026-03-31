'use client';

import { Skeleton } from "@/src/components/ui/skeleton"
import { useState } from "react";

export default function LoadingDetails() {
  const [activeTab, setActiveTab] = useState<'chapters'>('chapters');    
  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Source Sans 3', sans-serif" }}>
      <section className="border-b" style={{ background: '#232F3E', borderColor: '#37475A' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="shrink-0 flex justify-center md:justify-start">
              <div className="relative">
                <Skeleton className="w-56 md:w-64" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />

                <div className="absolute -bottom-3 left-4 right-4 h-6 rounded-full bg-black/30 blur-xl" />
              </div>
            </div>

            <div className="flex-1">
              {/* Audio */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4" style={{ background: 'rgba(247, 148, 29, 0.2)', color: '#F7941D' }}>
                <Skeleton className="h-4 w-full" />
              </span>
              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
                <Skeleton className="h-7 w-1/2" />
              </h1>
              {/* By: Author */}
              <Skeleton className="h-4 w-1/4 mb-5" />
              {/* Narrator */}
              <Skeleton className="h-4 w-1/3 mb-4" />

              <div className="flex flex-wrap gap-6 mb-8">
                {/* Duration */}
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Duration</p>
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Release date */}
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Release Date</p>
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Language */}
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Language</p>
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Category */}
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Category</p>
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="disabled inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
                  style={{ background: '#F7941D', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </button>
                <button
                  className="disabled inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-all border"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Library
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: '#232F3E' }}>About this audiobook</h2>
              <Skeleton className="h-4 w-full leading-relaxed" style={{ color: '#444444' }} />
                <button
                  className="mt-3 text-sm font-semibold transition-colors"
                  style={{ color: '#F7941D' }}
                >
                  <Skeleton className="h-4 w-32" />
                </button>
            </div>

            <div>
              <div className="flex gap-6 mb-6 border-b" style={{ borderColor: '#E8E8E8' }}>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className="pb-4 px-1 text-sm font-semibold transition-colors relative"
                  style={{ color: activeTab === 'chapters' ? '#232F3E' : '#666666' }}
                >
                  Chapters
                  {activeTab === 'chapters' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F7941D' }} />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ background: '#FAFAF8' }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F5F5F5' }}>
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E' }}>You Might Also Like</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 rounded-lg"
                    style={{ background: '#FAFAF8' }}
                  >
                    <Skeleton className="w-16 rounded-md" style={{ aspectRatio: '2/3' }} />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
