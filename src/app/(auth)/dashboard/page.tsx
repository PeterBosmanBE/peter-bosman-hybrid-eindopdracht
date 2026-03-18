'use client';

import { useState } from 'react';
import Link from 'next/link';
import AvatarDropdown from '@/src/components/avatar-dropdown';
import "./dashboard.css"
import { Dropzone } from '@/src/components/dropzone';

const stats = [
  { label: 'Total Listeners', value: '12,847', change: '+12%', icon: 'users' },
  { label: 'Hours Played', value: '45,291', change: '+8%', icon: 'clock' },
  { label: 'Revenue', value: '$8,429', change: '+15%', icon: 'dollar' },
  { label: 'Avg. Rating', value: '4.7', change: '+0.2', icon: 'star' },
];

const myContent = [
  { id: 1, title: 'Building Wealth Slowly', type: 'audiobook', status: 'published', listeners: 3420, rating: 4.8, cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop' },
  { id: 2, title: 'Morning Mindset', type: 'podcast', status: 'published', listeners: 5891, rating: 4.6, cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 3, title: 'Leadership Lessons', type: 'audiobook', status: 'draft', listeners: 0, rating: 0, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop' },
];

const recentActivity = [
  { type: 'listen', user: 'Sarah M.', content: 'Building Wealth Slowly', time: '5 min ago' },
  { type: 'review', user: 'John D.', content: 'Morning Mindset', rating: 5, time: '12 min ago' },
  { type: 'follow', user: 'Emily R.', time: '1 hour ago' },
  { type: 'listen', user: 'Michael B.', content: 'Building Wealth Slowly', time: '2 hours ago' },
  { type: 'review', user: 'Lisa K.', content: 'Morning Mindset', rating: 4, time: '3 hours ago' },
];

const weeklyData = [
  { day: 'Mon', listeners: 420 },
  { day: 'Tue', listeners: 380 },
  { day: 'Wed', listeners: 520 },
  { day: 'Thu', listeners: 490 },
  { day: 'Fri', listeners: 610 },
  { day: 'Sat', listeners: 580 },
  { day: 'Sun', listeners: 450 },
];

const categories = ['Business', 'Self-Help', 'Fiction', 'History', 'Science', 'Biography'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'upload' | 'analytics'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'audiobook',
    category: 'Business',
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const maxListeners = Math.max(...weeklyData.map(d => d.listeners));

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'users':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      case 'clock':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'dollar':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'star':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FAFAF8', fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#232F3E' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F7941D' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-bold text-white">Chapter</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="px-3 mb-3 text-xs font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Creator Hub</p>
            <ul className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
                { id: 'content', label: 'My Content', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                { id: 'upload', label: 'Upload', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
                { id: 'analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'text-white' : ''}`}
                    style={{ 
                      background: activeTab === item.id ? 'rgba(247, 148, 29, 0.15)' : 'transparent',
                      color: activeTab === item.id ? '#F7941D' : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <p className="px-3 mt-8 mb-3 text-xs font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Quick Links</p>
            <ul className="space-y-1">
              <li>
                <Link href="/home" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Browse Library
                </Link>
              </li>
              <li>
                <Link href="/home" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Help Center
                </Link>
              </li>
            </ul>
          </nav>

          {/* Profile */}
          <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: '#F7941D' }}>
                <AvatarDropdown/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">John Doe</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>Creator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: '#F7941D' }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4 border-b" style={{ background: '#FFFFFF', borderColor: '#E8E8E8' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold" style={{ color: '#232F3E' }}>
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'content' && 'My Content'}
                {activeTab === 'upload' && 'Upload'}
                {activeTab === 'analytics' && 'Analytics'}
              </h1>
              <p className="text-sm" style={{ color: '#666666' }}>Welcome back, John</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50" style={{ borderColor: '#E8E8E8' }}>
                <svg className="w-5 h-5" style={{ color: '#666666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="p-5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(247, 148, 29, 0.1)', color: '#F7941D' }}>
                        {getIcon(stat.icon)}
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="font-serif text-2xl font-bold mb-1" style={{ color: '#232F3E' }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: '#666666' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Weekly Chart */}
                <div className="lg:col-span-2 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                  <h3 className="font-serif text-lg font-bold mb-6" style={{ color: '#232F3E' }}>Weekly Listeners</h3>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full rounded-t-lg transition-all hover:opacity-80"
                          style={{ 
                            height: `${(day.listeners / maxListeners) * 100}%`,
                            background: 'linear-gradient(180deg, #F7941D 0%, #FF6B35 100%)'
                          }}
                        />
                        <p className="text-xs font-semibold mt-2" style={{ color: '#666666' }}>{day.day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                  <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E' }}>Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ 
                            background: activity.type === 'listen' ? 'rgba(247, 148, 29, 0.1)' : 
                                       activity.type === 'review' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: activity.type === 'listen' ? '#F7941D' : 
                                  activity.type === 'review' ? '#10B981' : '#6366F1'
                          }}
                        >
                          {activity.type === 'listen' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                          {activity.type === 'review' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>}
                          {activity.type === 'follow' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" style={{ color: '#232F3E' }}>
                            <span className="font-semibold">{activity.user}</span>
                            {activity.type === 'listen' && <> started listening to <span className="font-medium">{activity.content}</span></>}
                            {activity.type === 'review' && <> rated <span className="font-medium">{activity.content}</span> {activity.rating}★</>}
                            {activity.type === 'follow' && <> followed you</>}
                          </p>
                          <p className="text-xs" style={{ color: '#999999' }}>{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#232F3E', color: 'white' }}>All</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#F5F5F5', color: '#666666' }}>Audiobooks</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#F5F5F5', color: '#666666' }}>Podcasts</button>
                </div>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{ background: '#F7941D', color: 'white' }}
                >
                  + New Upload
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#F9F9F7' }}>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: '#666666' }}>Title</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Type</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Status</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Listeners</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: '#666666' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myContent.map((item) => (
                      <tr key={item.id} className="border-t" style={{ borderColor: '#E8E8E8' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.cover} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-semibold" style={{ color: '#232F3E' }}>{item.title}</p>
                              <div className="flex items-center gap-1 md:hidden">
                                <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: item.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : '#F5F5F5', color: item.status === 'published' ? '#10B981' : '#666666' }}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm capitalize" style={{ color: '#666666' }}>{item.type}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs px-2 py-1 rounded-full capitalize font-semibold" style={{ background: item.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : '#F5F5F5', color: item.status === 'published' ? '#10B981' : '#666666' }}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span style={{ color: '#232F3E' }}>{item.listeners.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg transition-colors hover:bg-gray-100" title="Edit">
                              <svg className="w-4 h-4" style={{ color: '#666666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="p-2 rounded-lg transition-colors hover:bg-gray-100" title="Analytics">
                              <svg className="w-4 h-4" style={{ color: '#666666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                <h3 className="font-serif text-xl font-bold mb-6" style={{ color: '#232F3E' }}>Upload New Content</h3>
                
                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#232F3E' }}>Audio File</label>
                    <Dropzone/>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#232F3E' }}>Title</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="Enter title..."
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-orange-400"
                      style={{ borderColor: '#E8E8E8' }}
                    />
                  </div>

                  {/* Type & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#232F3E' }}>Type</label>
                      <select
                        value={uploadForm.type}
                        onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-orange-400"
                        style={{ borderColor: '#E8E8E8' }}
                      >
                        <option value="audiobook">Audiobook</option>
                        <option value="podcast">Podcast Episode</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#232F3E' }}>Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-orange-400"
                        style={{ borderColor: '#E8E8E8' }}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#232F3E' }}>Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Describe your content..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-orange-400 resize-none"
                      style={{ borderColor: '#E8E8E8' }}
                    />
                  </div>

                  {/* Submit */}
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full py-3.5 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#F7941D', color: 'white' }}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Content'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Plays', value: '89,234', trend: '+18%' },
                  { label: 'Unique Listeners', value: '12,847', trend: '+12%' },
                  { label: 'Completion Rate', value: '67%', trend: '+5%' },
                  { label: 'Avg. Session', value: '32 min', trend: '+8%' },
                ].map((stat, index) => (
                  <div key={index} className="p-5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                    <p className="text-sm mb-1" style={{ color: '#666666' }}>{stat.label}</p>
                    <div className="flex items-end gap-2">
                      <p className="font-serif text-2xl font-bold" style={{ color: '#232F3E' }}>{stat.value}</p>
                      <span className="text-xs font-semibold mb-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Content */}
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                  <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E'}}>Top Performing Content</h3>
                  <div className="space-y-4">
                    {myContent.filter(c => c.status === 'published').map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <span className="text-lg font-bold" style={{ color: '#F7941D' }}>#{index + 1}</span>
                        <img src={item.cover} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate" style={{ color: '#232F3E' }}>{item.title}</p>
                          <p className="text-sm" style={{ color: '#666666' }}>{item.listeners.toLocaleString()} listeners</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" style={{ color: '#F7941D' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold" style={{ color: '#232F3E' }}>{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Listener Demographics */}
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                  <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#232F3E' }}>Listener Demographics</h3>
                  <div className="space-y-4">
                    {[
                      { label: '25-34', percentage: 35, color: '#F7941D' },
                      { label: '35-44', percentage: 28, color: '#FF6B35' },
                      { label: '18-24', percentage: 20, color: '#37475A' },
                      { label: '45-54', percentage: 12, color: '#999999' },
                      { label: '55+', percentage: 5, color: '#CCCCCC' },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: '#232F3E' }}>{item.label}</span>
                          <span style={{ color: '#666666' }}>{item.percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: '#E8E8E8' }}>
                          <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
