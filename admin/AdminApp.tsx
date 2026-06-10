import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminRegistrations from './AdminRegistrations';
import AdminEmail from './AdminEmail';
import AdminCMS from './AdminCMS';
import AdminEvents from './AdminEvents';

type AdminPage = 'dashboard' | 'registrations' | 'email' | 'cms' | 'events';

const AdminApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#9c1c22', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: 14 }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))} />;

  const navItems: { id: AdminPage; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'registrations', icon: '📋', label: 'Registrations' },
    { id: 'email', icon: '✉️', label: 'Email Center' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'cms', icon: '✏️', label: 'Content (CMS)' },
  ];

  const S: Record<string, any> = {
    root: { display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Inter', 'Segoe UI', sans-serif" },
    sidebar: {
      width: sidebarOpen ? 240 : 68, minHeight: '100vh', background: '#111',
      borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease', flexShrink: 0, position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh',
    },
    sidebarHeader: {
      padding: sidebarOpen ? '24px 20px' : '24px 14px', borderBottom: '1px solid #1e1e1e',
      display: 'flex', alignItems: 'center', gap: 12,
    },
    logoImg: { width: 36, height: 36, flexShrink: 0, objectFit: 'contain' as const },
    logoTexts: { overflow: 'hidden', transition: 'opacity 0.2s', opacity: sidebarOpen ? 1 : 0, whiteSpace: 'nowrap' as const },
    logoName: { fontSize: 14, fontWeight: 700, color: '#fff' },
    logoBadge: { fontSize: 10, color: '#eeb053', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' as const },
    nav: { flex: 1, padding: '16px 8px' },
    navItem: (active: boolean): React.CSSProperties => ({
      display: 'flex', alignItems: 'center', gap: 12, padding: sidebarOpen ? '12px 14px' : '12px 16px',
      borderRadius: 10, marginBottom: 4, cursor: 'pointer', transition: 'all 0.15s',
      background: active ? 'linear-gradient(135deg, rgba(156,28,34,0.25), rgba(156,28,34,0.1))' : 'transparent',
      border: active ? '1px solid rgba(156,28,34,0.3)' : '1px solid transparent',
      color: active ? '#ff6b6b' : '#6b7280',
    }),
    navIcon: { fontSize: 18, flexShrink: 0 },
    navLabel: { fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.15s' },
    sidebarFooter: { padding: '16px 8px', borderTop: '1px solid #1e1e1e' },
    userCard: {
      display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '10px 12px' : '10px',
      borderRadius: 10, marginBottom: 6,
    },
    avatar: {
      width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #9c1c22, #eeb053)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
    },
    userInfo: { overflow: 'hidden', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.15s' },
    userEmail: { fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 },
    logoutBtn: {
      display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '10px 14px' : '10px 16px',
      borderRadius: 10, cursor: 'pointer', color: '#6b7280', border: '1px solid transparent',
      fontSize: 14, background: 'transparent', width: '100%', transition: 'all 0.15s',
    },
    toggleBtn: {
      position: 'absolute' as const, right: -14, top: 80, width: 28, height: 28,
      background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: '#6b7280', fontSize: 12, zIndex: 10, transition: 'all 0.15s',
    },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' as const },
    topbar: {
      padding: '16px 32px', borderBottom: '1px solid #1e1e1e',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#111', position: 'sticky', top: 0, zIndex: 5,
    },
    topbarTitle: { fontSize: 20, fontWeight: 700, color: '#fff' },
    topbarBadge: {
      fontSize: 11, color: '#eeb053', fontWeight: 600, letterSpacing: 1.5,
      textTransform: 'uppercase' as const, background: 'rgba(238,176,83,0.1)',
      padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(238,176,83,0.2)',
    },
    content: { flex: 1, padding: 32, overflow: 'auto' as const },
  };

  const pageTitle: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    registrations: 'Workshop Registrations',
    email: 'Email Center',
    events: 'Events & Scheduling',
    cms: 'Content Management',
  };

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ position: 'relative' }}>
          <div style={S.sidebarHeader}>
            <img src="/logo.svg" alt="FOL" style={S.logoImg} />
            <div style={S.logoTexts}>
              <div style={S.logoName}>Foundation of Luv</div>
              <div style={S.logoBadge}>Admin</div>
            </div>
          </div>
          <div
            style={S.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </div>
        </div>

        <nav style={S.nav}>
          {navItems.map(item => (
            <div
              key={item.id}
              style={S.navItem(page === item.id)}
              onClick={() => setPage(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span style={S.navIcon}>{item.icon}</span>
              <span style={S.navLabel}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.userCard}>
            <div style={S.avatar}>{(user.email?.[0] ?? 'A').toUpperCase()}</div>
            <div style={S.userInfo}>
              <div style={S.userEmail}>{user.email}</div>
            </div>
          </div>
          <a href="/" target="_blank" style={{ textDecoration: 'none' }}>
            <button
              style={S.logoutBtn}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1e1e1e'; (e.currentTarget as HTMLButtonElement).style.color = '#d1d5db'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
            >
              <span style={{ fontSize: 16 }}>🌐</span>
              <span style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.15s' }}>View Website</span>
            </button>
          </a>
          <button
            style={S.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.15s' }}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.topbarTitle}>{pageTitle[page]}</div>
          <div style={S.topbarBadge}>Admin Portal</div>
        </div>
        <div style={S.content}>
          {page === 'dashboard' && <AdminDashboard onNavigate={setPage} />}
          {page === 'registrations' && <AdminRegistrations />}
          {page === 'email' && <AdminEmail />}
          {page === 'events' && <AdminEvents />}
          {page === 'cms' && <AdminCMS />}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
