import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminRegistrations from './AdminRegistrations';
import AdminEmail from './AdminEmail';
import AdminCMS from './AdminCMS';
import AdminEvents from './AdminEvents';
import AdminAttachments from './AdminAttachments';
import AdminCertificates from './AdminCertificates';

type AdminPage = 'dashboard' | 'registrations' | 'email' | 'cms' | 'events' | 'attachments' | 'certificates';

const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

const AdminApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

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

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setMobileMenuOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleNavigate = (p: AdminPage) => {
    setPage(p);
    if (isMobile) setMobileMenuOpen(false);
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
    { id: 'attachments', icon: '📎', label: 'Attachments' },
    { id: 'certificates', icon: '🎓', label: 'Certificates' },
  ];

  const pageTitle: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    registrations: 'Workshop Registrations',
    email: 'Email Center',
    events: 'Events & Scheduling',
    cms: 'Content Management',
    attachments: 'Attachments & Media Library',
    certificates: 'Certificate Manager',
  };

  const currentNav = navItems.find(n => n.id === page);

  // ─── Sidebar (shared between desktop & mobile drawer) ───────────────────────
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div style={{ padding: isMobile ? '20px 16px' : (sidebarOpen ? '24px 20px' : '24px 14px'), borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 12, justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.svg" alt="FOL" style={{ width: 36, height: 36, flexShrink: 0, objectFit: 'contain' }} />
          <div style={{ overflow: 'hidden', opacity: (isMobile || sidebarOpen) ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Foundation of Luv</div>
            <div style={{ fontSize: 10, color: '#eeb053', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>Admin</div>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 20, cursor: 'pointer', padding: 4, lineHeight: 1 }}
          >✕</button>
        )}
      </div>

      {/* Toggle button — desktop only */}
      {!isMobile && (
        <div style={{ position: 'relative' }}>
          <div
            style={{ position: 'absolute', right: -14, top: 16, width: 28, height: 28, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 12, zIndex: 10 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              title={(!isMobile && !sidebarOpen) ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: (isMobile || sidebarOpen) ? '12px 14px' : '12px 16px',
                borderRadius: 10, marginBottom: 4, cursor: 'pointer', transition: 'all 0.15s',
                background: active ? 'linear-gradient(135deg, rgba(156,28,34,0.25), rgba(156,28,34,0.1))' : 'transparent',
                border: active ? '1px solid rgba(156,28,34,0.3)' : '1px solid transparent',
                color: active ? '#ff6b6b' : '#6b7280',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', opacity: (isMobile || sidebarOpen) ? 1 : 0, transition: 'opacity 0.15s' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 8px', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: (isMobile || sidebarOpen) ? '10px 12px' : '10px', borderRadius: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #9c1c22, #eeb053)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(user.email?.[0] ?? 'A').toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', opacity: (isMobile || sidebarOpen) ? 1 : 0, transition: 'opacity 0.15s' }}>
            <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{user.email}</div>
          </div>
        </div>
        <a href="/" target="_blank" style={{ textDecoration: 'none' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: (isMobile || sidebarOpen) ? '10px 14px' : '10px 16px', borderRadius: 10, cursor: 'pointer', color: '#6b7280', border: '1px solid transparent', fontSize: 14, background: 'transparent', width: '100%', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1e1e1e'; (e.currentTarget as HTMLButtonElement).style.color = '#d1d5db'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
          >
            <span style={{ fontSize: 16 }}>🌐</span>
            <span style={{ opacity: (isMobile || sidebarOpen) ? 1 : 0, transition: 'opacity 0.15s' }}>View Website</span>
          </button>
        </a>
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: (isMobile || sidebarOpen) ? '10px 14px' : '10px 16px', borderRadius: 10, cursor: 'pointer', color: '#6b7280', border: '1px solid transparent', fontSize: 14, background: 'transparent', width: '100%', transition: 'all 0.15s' }}
          onClick={handleLogout}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          <span style={{ opacity: (isMobile || sidebarOpen) ? 1 : 0, transition: 'opacity 0.15s' }}>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          width: sidebarOpen ? 240 : 68, minHeight: '100vh', background: '#111',
          borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s ease', flexShrink: 0,
          position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh',
        }}>
          <SidebarContent />
        </div>
      )}

      {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────────── */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(2px)' }}
          />
          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 280, background: '#111', borderRight: '1px solid #1e1e1e',
            display: 'flex', flexDirection: 'column', zIndex: 50,
            boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
            animation: 'slideInLeft 0.22s ease',
          }}>
            <SidebarContent />
          </div>
          <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>

        {/* Top Bar */}
        <div style={{
          padding: isMobile ? '0 16px' : '16px 32px',
          height: isMobile ? 56 : 'auto',
          borderBottom: '1px solid #1e1e1e',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#111', position: 'sticky', top: 0, zIndex: 5,
          gap: 12,
        }}>
          {/* Left: hamburger (mobile) + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: '4px 6px', flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
                aria-label="Open menu"
              >
                ☰
              </button>
            )}

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              {isMobile ? (
                // Mobile breadcrumb: icon + page name
                <>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{currentNav?.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pageTitle[page]}
                  </span>
                </>
              ) : (
                // Desktop: full page title
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{pageTitle[page]}</div>
              )}
            </div>
          </div>

          {/* Right: badge */}
          <div style={{
            fontSize: 11, color: '#eeb053', fontWeight: 600, letterSpacing: 1.5,
            textTransform: 'uppercase', background: 'rgba(238,176,83,0.1)',
            padding: isMobile ? '3px 8px' : '4px 10px', borderRadius: 20,
            border: '1px solid rgba(238,176,83,0.2)', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Admin Portal
          </div>
        </div>

        {/* Mobile Nav Pills (quick tab switcher) */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto', background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', scrollbarWidth: 'none' }}>
            <style>{`.mobile-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: page === item.id ? '1px solid rgba(156,28,34,0.4)' : '1px solid #2a2a2a',
                  background: page === item.id ? 'rgba(156,28,34,0.2)' : '#141414',
                  color: page === item.id ? '#fca5a5' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Page Content */}
        <div style={{ flex: 1, padding: isMobile ? '20px 16px' : 32, overflow: 'auto' }}>
          {page === 'dashboard' && <AdminDashboard onNavigate={setPage} />}
          {page === 'registrations' && <AdminRegistrations />}
          {page === 'email' && <AdminEmail />}
          {page === 'events' && <AdminEvents />}
          {page === 'cms' && <AdminCMS />}
          {page === 'attachments' && <AdminAttachments />}
          {page === 'certificates' && <AdminCertificates />}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
