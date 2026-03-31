'use client';

import { useSearchParams } from 'next/navigation';
import Content from '@/src/components/dashboard/content';
import { DashboardTabType } from '@/src/types/DashboardTabType';
import Upload from '@/src/components/dashboard/upload';
import { Button } from '@/src/components/ui/button';
import Profile from '@/src/components/dashboard/profile';

const stats = [
  { label: 'Total Listeners', value: '12,847', change: '+12%', icon: 'users' },
  { label: 'Hours Played', value: '45,291', change: '+8%', icon: 'clock' },
  { label: 'Revenue', value: '$8,429', change: '+15%', icon: 'dollar' },
  { label: 'Avg. Rating', value: '4.7', change: '+0.2', icon: 'star' },
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

export default function Dashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab: DashboardTabType =
    tab === 'overview' || tab === 'content' || tab === 'upload' || tab === 'profile'
      ? tab
      : 'overview';

  const maxListeners = Math.max(...weeklyData.map(d => d.listeners));

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
    <div>
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4 border-b bg-white border-nav-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold" style={{ color: '#232F3E' }}>
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'content' && 'My Content'}
                {activeTab === 'upload' && 'Upload'}
                {activeTab === 'profile' && 'Profile'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50" style={{ borderColor: '#E8E8E8' }}>
                <svg className="w-5 h-5" style={{ color: '#666666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Button>
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
              <Content />
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div>
              <Upload />
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <Profile />
            </div>
          )}
        </div>
    </div>
  );
}
