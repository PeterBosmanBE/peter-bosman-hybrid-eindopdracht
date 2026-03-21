'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import "../listening-page.css"
import Logo from '@/src/components/ui/logo';

type PageParams = { id: string };

const contentData: Record<string, {
  id: number;
  title: string;
  author: string;
  narrator?: string;
  cover: string;
  chapters: { title: string; duration: string }[];
}> = {
  '1': {
    id: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    narrator: 'Chris Hill',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
    chapters: [
      { title: 'Introduction', duration: '12:00' },
      { title: 'No One\'s Crazy', duration: '24:32' },
      { title: 'Luck & Risk', duration: '31:15' },
      { title: 'Never Enough', duration: '28:44' },
      { title: 'Confounding Compounding', duration: '22:18' },
      { title: 'Getting Wealthy vs. Staying Wealthy', duration: '35:22' },
      { title: 'Tails, You Win', duration: '27:05' },
      { title: 'Freedom', duration: '19:33' },
    ],
  },
};

const defaultContent = {
  id: 1,
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  narrator: 'Chris Hill',
  cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
  chapters: [
    { title: 'Introduction', duration: '12:00' },
    { title: 'No One\'s Crazy', duration: '24:32' },
    { title: 'Luck & Risk', duration: '31:15' },
    { title: 'Never Enough', duration: '28:44' },
  ],
};

export default function Listen({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const content = contentData[id] || defaultContent;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1440); // 24 minutes in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const [showChapters, setShowChapters] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const addBookmark = () => {
    if (!bookmarks.includes(currentTime)) {
      setBookmarks([...bookmarks, currentTime].sort((a, b) => a - b));
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#121212', fontFamily: "'Source Sans 3', sans-serif" }}>


      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ background: '#1A1A1A' }}>
        <Link href={`/details/${id}`} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <Logo isMainHeader={false} />
        <button 
          onClick={() => setShowChapters(!showChapters)}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: showChapters ? '#F7941D' : 'rgba(255,255,255,0.6)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Chapters
        </button>
      </nav>

      <div className="flex-1 flex">
        {/* Main Player Area */}
        <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all ${showChapters ? 'lg:mr-80' : ''}`}>
          {/* Cover Art */}
          <div className="relative mb-10">
            <div className={`absolute inset-0 rounded-full ${isPlaying ? 'pulse-ring' : ''}`} style={{ background: '#F7941D', filter: 'blur(60px)', opacity: 0.2 }}></div>
            <img 
              src={content.cover} 
              alt={content.title}
              className="w-64 md:w-80 rounded-xl shadow-2xl relative z-10"
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </div>

          {/* Title & Author */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">{content.title}</h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>{content.author}</p>
            {content.narrator && (
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Narrated by {content.narrator}</p>
            )}
          </div>

          {/* Chapter Info */}
          <div className="text-center mb-6">
            <p className="text-sm font-semibold" style={{ color: '#F7941D' }}>
              Chapter {currentChapter + 1}: {content.chapters[currentChapter]?.title || 'Introduction'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xl mb-4">
            <div className="relative h-1.5 rounded-full cursor-pointer group" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${progress}%`, background: '#F7941D' }}
              />
              {bookmarks.map((bm, i) => (
                <div 
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer"
                  style={{ left: `${(bm / duration) * 100}%`, background: '#FF6B35' }}
                  title={formatTime(bm)}
                />
              ))}
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-6 mb-8">
            <button 
              onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
              <span className="absolute -bottom-1 text-xs text-white font-semibold">30</span>
            </button>

            <button 
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: '#F7941D' }}
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button 
              onClick={() => setCurrentChapter(Math.min(content.chapters.length - 1, currentChapter + 1))}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>

            <button 
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 30))}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
              <span className="absolute -bottom-1 text-xs text-white font-semibold">30</span>
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-8">
            {/* Playback Speed */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const currentIndex = speeds.indexOf(playbackSpeed);
                  const nextIndex = (currentIndex + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIndex]);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#F7941D' }}
              >
                {playbackSpeed}x
              </button>
            </div>

            {/* Bookmark */}
            <button 
              onClick={addBookmark}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              title="Add bookmark"
            >
              <svg className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Sleep Timer */}
            <div className="relative">
              <button 
                onClick={() => setShowSleepMenu(!showSleepMenu)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: sleepTimer ? 'rgba(247,148,29,0.2)' : 'rgba(255,255,255,0.1)' }}
              >
                <svg className="w-5 h-5" style={{ color: sleepTimer ? '#F7941D' : 'rgba(255,255,255,0.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              {showSleepMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg shadow-lg" style={{ background: '#2A2A2A', minWidth: '120px' }}>
                  {[15, 30, 45, 60, null].map((mins, i) => (
                    <button 
                      key={i}
                      onClick={() => { setSleepTimer(mins); setShowSleepMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm rounded transition-colors hover:bg-white/10"
                      style={{ color: sleepTimer === mins ? '#F7941D' : 'rgba(255,255,255,0.7)' }}
                    >
                      {mins ? `${mins} min` : 'Off'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24"
                style={{ background: `linear-gradient(90deg, #F7941D ${volume}%, rgba(255,255,255,0.1) ${volume}%)` }}
              />
            </div>
          </div>
        </div>

        {/* Chapters Sidebar */}
        {showChapters && (
          <div 
            className="fixed right-0 top-0 bottom-0 w-80 overflow-y-auto border-l"
            style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-bold text-white">Chapters</h3>
                <button onClick={() => setShowChapters(false)} className="p-1">
                  <svg className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                {content.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChapter(index)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${currentChapter === index ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      {currentChapter === index && isPlaying ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#F7941D' }}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      ) : (
                        <span className="w-6 h-6 text-sm font-semibold flex items-center justify-center" style={{ color: currentChapter === index ? '#F7941D' : 'rgba(255,255,255,0.4)' }}>
                          {index + 1}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${currentChapter === index ? 'text-white' : ''}`} style={{ color: currentChapter === index ? 'white' : 'rgba(255,255,255,0.7)' }}>
                          {chapter.title}
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{chapter.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bookmarks Section */}
              {bookmarks.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-serif text-lg font-bold text-white mb-4">Bookmarks</h3>
                  <div className="space-y-2">
                    {bookmarks.map((bm, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTime(bm)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5"
                      >
                        <svg className="w-4 h-4" style={{ color: '#F7941D' }} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTime(bm)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
