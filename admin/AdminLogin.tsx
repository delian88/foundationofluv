import React, { useState } from 'react';
import { supabase } from '../supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    else if (data.user) onLogin();
    setLoading(false);
  };

  const S: Record<string, React.CSSProperties> = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #090909 0%, #160808 60%, #090909 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: 24,
    },
    card: {
      background: '#141414',
      border: '1px solid #2a1a1a',
      borderRadius: 20,
      padding: '52px 44px',
      width: '100%', maxWidth: 440,
      boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(156,28,34,0.1)',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
      justifyContent: 'center',
    },
    logoImg: { width: 48, height: 48, objectFit: 'contain' as const },
    logoText: { fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' },
    logoSub: { fontSize: 11, color: '#eeb053', fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' as const },
    heading: { fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6, textAlign: 'center' as const },
    sub: { fontSize: 14, color: '#6b7280', textAlign: 'center' as const, marginBottom: 36, lineHeight: 1.5 },
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: 0.3 },
    input: {
      width: '100%', boxSizing: 'border-box' as const,
      background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10,
      color: '#fff', fontSize: 15, padding: '13px 16px', outline: 'none',
      transition: 'border-color 0.2s',
    },
    field: { marginBottom: 20 },
    btn: {
      width: '100%', padding: '14px 24px', borderRadius: 10, border: 'none',
      background: 'linear-gradient(135deg, #9c1c22, #7a1219)',
      color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
      marginTop: 8, transition: 'all 0.2s', letterSpacing: 0.3,
    },
    error: {
      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 10, padding: '12px 16px', color: '#fca5a5',
      fontSize: 14, marginBottom: 20, textAlign: 'center' as const,
    },
    hint: {
      marginTop: 28, padding: '16px', borderRadius: 10,
      background: 'rgba(238,176,83,0.06)', border: '1px solid rgba(238,176,83,0.15)',
      color: '#9ca3af', fontSize: 12, lineHeight: 1.6,
    },
    hintTitle: { color: '#eeb053', fontWeight: 600, marginBottom: 4, display: 'block' },
  };

  return (
    <div style={S.root}>
      <div style={S.card}>
        <div style={S.logo}>
          <img src="/logo.svg" alt="FOL" style={S.logoImg} />
          <div>
            <div style={S.logoText}>Foundation of Luv</div>
            <div style={S.logoSub}>Admin Portal</div>
          </div>
        </div>
        <h1 style={S.heading}>Welcome Back</h1>
        <p style={S.sub}>Sign in to access the admin dashboard</p>
        {error && <div style={S.error}>⚠️ {error}</div>}
        <form onSubmit={handleLogin}>
          <div style={S.field}>
            <label style={S.label}>EMAIL ADDRESS</label>
            <input
              style={S.input}
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@foundationofluv.org" required autoComplete="email"
              onFocus={e => (e.target.style.borderColor = '#9c1c22')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>PASSWORD</label>
            <input
              style={S.input}
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••" required autoComplete="current-password"
              onFocus={e => (e.target.style.borderColor = '#9c1c22')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          </div>
          <button
            type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}
            onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #b01e25, #9c1c22)'; }}
            onMouseLeave={e => (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9c1c22, #7a1219)'}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>
        <div style={S.hint}>
          <span style={S.hintTitle}>🔑 First time?</span>
          Create an admin account in Supabase Dashboard → Authentication → Users → Add User,
          then sign in here.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
