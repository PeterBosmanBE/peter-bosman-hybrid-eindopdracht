'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/src/server/orpc/client';
import Image from 'next/image';
import './details.css';
import LoadingDetails from './loading';
import NotFound from './not-found';

type PageParams = { id: string };

function formatDate(value: string | null) {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Details({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [isInLibrary, setIsInLibrary] = useState(false);
  const detailQuery = useQuery(orpc.content.detail.queryOptions({ input: { id } }));

  if (detailQuery.isPending) {
    return <LoadingDetails />;
  }

  if (detailQuery.isError || (detailQuery.isFetched && !detailQuery.data)) {
    return <NotFound />;
  }
  
  const content = detailQuery.data.content;
  const relatedContent = detailQuery.data.related ?? [];

  const listItems =
    content.type === 'audiobook'
      ? content.chapters.map((item) => ({ title: item.title, duration: item.duration, subtitle: null }))
      : content.episodes.map((item) => ({ title: item.title, duration: item.duration, subtitle: formatDate(item.date) }));

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Source Sans 3', sans-serif" }}>
      <section className="border-b" style={{ background: '#232F3E', borderColor: '#37475A' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="shrink-0 flex justify-center md:justify-start">
              <div className="relative">
                <Image
                  src={content.cover}
                  alt={content.title}
                  width={100}
                  height={150}
                  className="w-56 md:w-64 rounded-lg shadow-2xl"
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
                <div className="absolute -bottom-3 left-4 right-4 h-6 rounded-full bg-black/30 blur-xl" />
              </div>
            </div>

            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4" style={{ background: 'rgba(247, 148, 29, 0.2)', color: '#F7941D' }}>
                {content.type}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">{content.title}</h1>
              <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>By {content.author}</p>
              {content.narrator && (
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Narrated by {content.narrator}</p>
              )}

              <div className="flex flex-wrap gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Duration</p>
                  <p className="text-white font-semibold">{content.duration}</p>
                </div>
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Release Date</p>
                  <p className="text-white font-semibold">{formatDate(content.releaseDate)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Language</p>
                  <p className="text-white font-semibold">{content.language}</p>
                </div>
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Category</p>
                  <p className="text-white font-semibold">{content.category}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/audiobook/${id}/listen`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
                  style={{ background: '#F7941D', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Sample
                </Link>
                <button
                  onClick={() => setIsInLibrary(!isInLibrary)}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-all border ${isInLibrary ? 'bg-white/10' : ''}`}
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                >
                  {isInLibrary ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      In Library
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Library
                    </>
                  )}
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
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: '#232F3E' }}>About this {content.type}</h2>
              <p className="leading-relaxed" style={{ color: '#444444' }}>
                {showFullDescription ? content.description : `${content.description.slice(0, 300)}${content.description.length > 300 ? '...' : ''}`}
              </p>
              {content.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-sm font-semibold transition-colors"
                  style={{ color: '#F7941D' }}
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            <div>
              <div className="flex gap-6 mb-6 border-b" style={{ borderColor: '#E8E8E8' }}>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className="pb-4 px-1 text-sm font-semibold transition-colors relative"
                  style={{ color: activeTab === 'chapters' ? '#232F3E' : '#666666' }}
                >
                  {content.type === 'audiobook' ? 'Chapters' : 'Episodes'}
                  {activeTab === 'chapters' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F7941D' }} />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="pb-4 px-1 text-sm font-semibold transition-colors relative"
                  style={{ color: activeTab === 'reviews' ? '#232F3E' : '#666666' }}
                >
                  Reviews
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F7941D' }} />
                  )}
                </button>
              </div>

              {activeTab === 'chapters' && (
                <div className="space-y-2">
                  {listItems.length === 0 ? (
                    <div className="p-4 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', color: '#666666' }}>
                      No {content.type === 'audiobook' ? 'chapters' : 'episodes'} yet.
                    </div>
                  ) : (
                    listItems.map((item, index) => (
                      <Link
                        key={`${item.title}-${index}`}
                        href={`/listen/${id}`}
                        className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-white group"
                        style={{ background: '#FAFAF8' }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: '#F5F5F5' }}>
                            <span className="text-sm font-semibold" style={{ color: '#666666' }}>{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold group-hover:text-orange-500 transition-colors" style={{ color: '#232F3E' }}>{item.title}</p>
                            <p className="text-sm" style={{ color: '#666666' }}>
                              {item.duration}{item.subtitle ? ` • ${item.subtitle}` : ''}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#F7941D' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#444444' }}>
                      Reviews are not connected to the database yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E' }}>You Might Also Like</h3>
              <div className="space-y-4">
                {relatedContent.map((item) => (
                  <Link
                    key={item.id}
                    href={item.type === 'audiobook' ? `/audiobook/${item.id}` : `/details/${item.id}`}
                    className="flex gap-4 p-3 rounded-lg transition-colors hover:bg-white book-card"
                  >
                    <Image src={item.cover} alt={item.title} fill className="w-16 rounded-md" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold truncate" style={{ color: '#232F3E' }}>{item.title}</h4>
                      <p className="text-sm truncate" style={{ color: '#666666' }}>{item.author}</p>
                      <p className="text-xs mt-1" style={{ color: '#999999' }}>{item.duration}</p>
                    </div>
                  </Link>
                ))}

                {relatedContent.length === 0 && (
                  <div className="p-4 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', color: '#666666' }}>
                    No related content available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
