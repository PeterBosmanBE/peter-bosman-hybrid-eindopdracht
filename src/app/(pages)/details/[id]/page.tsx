'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/src/components/header';
import "./details.css"

type PageParams = { id: string };

const contentData: Record<string, {
  id: number;
  title: string;
  author: string;
  narrator?: string;
  type: 'audiobook' | 'podcast';
  duration: string;
  cover: string;
  description: string;
  chapters?: { title: string; duration: string }[];
  episodes?: { title: string; duration: string; date: string }[];
  releaseDate: string;
  language: string;
  publisher: string;
  category: string;
}> = {
  '1': {
    id: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    narrator: 'Chris Hill',
    type: 'audiobook',
    duration: '5h 48m',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 24589,
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in the real world people don\'t make financial decisions on a spreadsheet. They make them at the dinner table, or in a meeting room, where personal history, your own unique view of the world, ego, pride, marketing, and odd incentives are scrambled together.',
    chapters: [
      { title: 'Introduction', duration: '12m' },
      { title: 'No One\'s Crazy', duration: '24m' },
      { title: 'Luck & Risk', duration: '31m' },
      { title: 'Never Enough', duration: '28m' },
      { title: 'Confounding Compounding', duration: '22m' },
      { title: 'Getting Wealthy vs. Staying Wealthy', duration: '35m' },
      { title: 'Tails, You Win', duration: '27m' },
      { title: 'Freedom', duration: '19m' },
      { title: 'Man in the Car Paradox', duration: '16m' },
      { title: 'Wealth is What You Don\'t See', duration: '21m' },
    ],
    releaseDate: 'September 2020',
    language: 'English',
    publisher: 'Harriman House',
    category: 'Business & Finance',
  },
  '2': {
    id: 2,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    narrator: 'Derek Perkins',
    type: 'audiobook',
    duration: '15h 17m',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 56234,
    description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    chapters: [
      { title: 'Part One: The Cognitive Revolution', duration: '2h 45m' },
      { title: 'Part Two: The Agricultural Revolution', duration: '3h 12m' },
      { title: 'Part Three: The Unification of Humankind', duration: '4h 20m' },
      { title: 'Part Four: The Scientific Revolution', duration: '5h' },
    ],
    releaseDate: 'February 2015',
    language: 'English',
    publisher: 'Harper',
    category: 'History',
  }
};

const defaultContent = {
  id: 1,
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  narrator: 'Chris Hill',
  type: 'audiobook' as const,
  duration: '5h 48m',
  cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
  rating: 4.8,
  reviews: 24589,
  description: 'Timeless lessons on wealth, greed, and happiness.',
  chapters: [
    { title: 'Introduction', duration: '12m' },
    { title: 'No One\'s Crazy', duration: '24m' },
    { title: 'Luck & Risk', duration: '31m' },
  ],
  releaseDate: 'September 2020',
  language: 'English',
  publisher: 'Harriman House',
  category: 'Business & Finance',
};

const relatedContent = [
  { id: 3, title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop', duration: '5h 35m' },
  { id: 4, title: 'Think Again', author: 'Adam Grant', cover: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&h=400&fit=crop', duration: '6h 40m' },
  { id: 5, title: 'Deep Work', author: 'Cal Newport', cover: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=400&fit=crop', duration: '7h 44m' },
  { id: 6, title: 'Range', author: 'David Epstein', cover: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', duration: '10h 11m' },
];

export default function Details({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const content = contentData[id] || defaultContent;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [isInLibrary, setIsInLibrary] = useState(false);

  const handleGenerateSummary = () => {
    setLoadingSummary(true);
    setTimeout(() => {
      setAiSummary(
        `"${content.title}" by ${content.author} explores fundamental concepts through engaging storytelling. The author presents a unique perspective that challenges conventional thinking while remaining accessible to general audiences. Key themes include personal growth, understanding complex systems, and practical wisdom for everyday life. The narrative style combines research-backed insights with memorable anecdotes, making it an excellent choice for listeners seeking both entertainment and education.`
      );
      setLoadingSummary(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Source Sans 3', sans-serif" }}>

      <Header/>

      {/* Hero Section */}
      <section className="border-b" style={{ background: '#232F3E', borderColor: '#37475A' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Book Cover */}
            <div className="shrink-0 flex justify-center md:justify-start">
              <div className="relative">
                <img 
                  src={content.cover} 
                  alt={content.title}
                  className="w-56 md:w-64 rounded-lg shadow-2xl"
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
                <div className="absolute -bottom-3 left-4 right-4 h-6 rounded-full bg-black/30 blur-xl"></div>
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4" style={{ background: 'rgba(247, 148, 29, 0.2)', color: '#F7941D' }}>
                {content.type}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">{content.title}</h1>
              <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>By {content.author}</p>
              {content.narrator && (
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Narrated by {content.narrator}</p>
              )}
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" style={{ color: i < Math.floor(content.rating) ? '#F7941D' : 'rgba(255,255,255,0.2)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-semibold">{content.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{content.reviews.toLocaleString()} reviews</span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Duration</p>
                  <p className="text-white font-semibold">{content.duration}</p>
                </div>
                <div>
                  <p className="text-xs uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Release Date</p>
                  <p className="text-white font-semibold">{content.releaseDate}</p>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href={`/listen/${id}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
                  style={{ background: '#F7941D', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-10">
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: '#232F3E' }}>About this {content.type}</h2>
              <p className="leading-relaxed" style={{ color: '#444444' }}>
                {showFullDescription ? content.description : `${content.description.slice(0, 300)}...`}
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

            {/* AI Summary */}
            <div className="rounded-xl p-6 mb-10" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F7941D 0%, #FF6B35 100%)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif font-bold" style={{ color: '#232F3E' }}>AI-Powered Summary</h3>
                  <p className="text-xs" style={{ color: '#666666' }}>Get key insights in seconds</p>
                </div>
              </div>
              {!aiSummary ? (
                <button 
                  onClick={handleGenerateSummary}
                  disabled={loadingSummary}
                  className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-60 border"
                  style={{ borderColor: '#F7941D', color: '#F7941D' }}
                >
                  {loadingSummary ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate AI Summary'
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-lg" style={{ background: '#F9F9F7' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#444444' }}>{aiSummary}</p>
                </div>
              )}
            </div>

            {/* Chapters/Episodes Tabs */}
            <div>
              <div className="flex gap-6 mb-6 border-b" style={{ borderColor: '#E8E8E8' }}>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`pb-4 px-1 text-sm font-semibold transition-colors relative`}
                  style={{ color: activeTab === 'chapters' ? '#232F3E' : '#666666' }}
                >
                  {content.type === 'audiobook' ? 'Chapters' : 'Episodes'}
                  {activeTab === 'chapters' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F7941D' }}></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 px-1 text-sm font-semibold transition-colors relative`}
                  style={{ color: activeTab === 'reviews' ? '#232F3E' : '#666666' }}
                >
                  Reviews
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F7941D' }}></span>
                  )}
                </button>
              </div>

              {activeTab === 'chapters' && content.chapters && (
                <div className="space-y-2">
                  {content.chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      href={`/listen/${id}`}
                      className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-white group"
                      style={{ background: '#FAFAF8' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: '#F5F5F5' }}>
                          <span className="text-sm font-semibold" style={{ color: '#666666' }}>{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold group-hover:text-orange-500 transition-colors" style={{ color: '#232F3E' }}>{chapter.title}</p>
                          <p className="text-sm" style={{ color: '#666666' }}>{chapter.duration}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#F7941D' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {[
                    { author: 'BookLover2024', rating: 5, text: 'Absolutely transformative! This changed the way I think about money forever.', date: '2 weeks ago' },
                    { author: 'FinanceFan', rating: 5, text: 'One of the best books on personal finance I\'ve ever read. Highly recommend.', date: '1 month ago' },
                    { author: 'CuriousReader', rating: 4, text: 'Great insights, though some chapters felt repetitive. Overall excellent.', date: '2 months ago' },
                  ].map((review, index) => (
                    <div key={index} className="p-5 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F5F5F5' }}>
                            <span className="text-sm font-semibold" style={{ color: '#666666' }}>{review.author[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: '#232F3E' }}>{review.author}</p>
                            <p className="text-xs" style={{ color: '#666666' }}>{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" style={{ color: i < review.rating ? '#F7941D' : '#E8E8E8' }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#444444' }}>{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E' }}>You Might Also Like</h3>
              <div className="space-y-4">
                {relatedContent.map((item) => (
                  <Link
                    key={item.id}
                    href={`/details/${item.id}`}
                    className="flex gap-4 p-3 rounded-lg transition-colors hover:bg-white book-card"
                  >
                    <img src={item.cover} alt={item.title} className="w-16 rounded-md" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold truncate" style={{ color: '#232F3E' }}>{item.title}</h4>
                      <p className="text-sm truncate" style={{ color: '#666666' }}>{item.author}</p>
                      <p className="text-xs mt-1" style={{ color: '#999999' }}>{item.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
