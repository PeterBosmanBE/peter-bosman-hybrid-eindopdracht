import Link from "next/link";
import AvatarDropdown from "@/src/components/avatar-dropdown";
import Logo from '@/src/components/ui/logo';
import { authClient } from "@/src/server/auth/auth-client";
import { DashboardTabType } from "@/src/types/DashboardTabType";
import { Button } from "../ui/button";

interface SidebarProps {
  activeTab: DashboardTabType;
  onTabChange: (tab: DashboardTabType) => void;
  isOpen?: boolean;
}

export default function Sidebar({ activeTab, onTabChange, isOpen = false }: SidebarProps) {
  const { data: session } = authClient.useSession();
  const username = session?.user?.name || "User";
  return (
    <aside 
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 bg-tertiary ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <Logo isMainHeader={false} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="px-3 mb-3 text-xs font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Creator Hub</p>
            <ul className="space-y-1">
              {[
                { id: 'content', label: 'My Content', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                { id: 'upload', label: 'Upload', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
                { id: "profile", label: "Profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              ].map((item) => (
                <li key={item.id}>
                  <Button 
                    onClick={() => onTabChange(item.id as typeof activeTab)}
                    className={`w-full flex justify-start items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'text-white' : ''}`}
                    style={{ 
                      background: activeTab === item.id ? 'rgba(247, 148, 29, 0.15)' : 'transparent',
                      color: activeTab === item.id ? '#F7941D' : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>

            <p className="px-3 mt-8 mb-3 text-xs font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Quick Links</p>
            <ul className="space-y-1">
              <li>
                <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  My Library
                </Link>
              </li>
              <li>
                <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.24 7.76l-4.24 8.48-1.41-1.41-1.41-1.41 8.48-4.24z"/></svg>
                  Discover
                </Link>
              </li>
            </ul>
          </nav>

          {/* Profile */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-avatar-border">
                <AvatarDropdown/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{username}</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>Creator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
}