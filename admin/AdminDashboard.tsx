import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../supabase';

type AdminPage = 'dashboard' | 'registrations' | 'email' | 'cms';

interface Props {
  onNavigate: (page: AdminPage) => void;
}

interface Stats {
  total: number;
  free: number;
  vip: number;
  today: number;
  emailsSent: number;
  recent: any[];
}

const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats>({ total: 0, free: 0, vip: 0, today: 0, emailsSent: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [regsResult, emailsResult] = await Promise.all([
        supabaseAdmin.from('workshop_registrations').select('*').order('created_at', { ascending: false }),
        supabaseAdmin.from('email_logs').select('id', { count: 'exact' }),
      ]);

      const regs = regsResult.data ?? [];
      const today = new Date(); today.setHours(0,0,0,0);
      setStats({
        total: regs.length,
        free: regs.filter((r: any) => r.ticket_type === 'free' || !r.ticket_type).length,
        vip: regs.filter((r: any) => r.ticket_type === 'vip').length,
        today: regs.filter((r: any) => new Date(r.created_at) >= today).length,
        emailsSent: emailsResult.count ?? 0,
        recent: regs.slice(0, 5),
      });
      setLoading(false);
    };
    load();
  }, []);

  const S: Record<string, any> = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    statCard: {
      background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16,
      padding: '24px 20px', cursor: 'default',
    },
    statIcon: { fontSize: 28, marginBottom: 12, display: 'block' },
    statValue: { fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
    statDelta: { fontSize: 12, color: '#22c55e', marginTop: 6, fontWeight: 600 },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 },
    table: { width: '100%', borderCollapse: 'collapse' as const, background: '#141414', borderRadius: 12, overflow: 'hidden' },
    th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, borderBottom: '1px solid #1e1e1e', background: '#111' },
    td: { padding: '14px 16px', fontSize: 14, color: '#d1d5db', borderBottom: '1px solid #1a1a1a' },
    badge: (type: string): React.CSSProperties => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: type === 'vip' ? 'rgba(238,176,83,0.15)' : 'rgba(34,197,94,0.1)',
      color: type === 'vip' ? '#eeb053' : '#4ade80',
      border: `1px solid ${type === 'vip' ? 'rgba(238,176,83,0.25)' : 'rgba(34,197,94,0.2)'}`,
    }),
    quickActions: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 },
    qBtn: {
      padding: '20px 16px', borderRadius: 14, border: '1px solid #2a2a2a',
      background: '#141414', cursor: 'pointer', textAlign: 'center' as const,
      transition: 'all 0.2s', color: '#fff',
    },
    qBtnIcon: { fontSize: 28, display: 'block', marginBottom: 8 },
    qBtnLabel: { fontSize: 13, fontWeight: 600, color: '#9ca3af' },
    empty: { textAlign: 'center' as const, padding: '40px', color: '#4b5563', fontSize: 14 },
    skeleton: { background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', borderRadius: 8, height: 20, marginBottom: 8, animation: 'shimmer 1.5s infinite' },
  };

  if (loading) return (
    <div>
      <div style={S.grid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={S.statCard}>
            <div style={{ ...S.skeleton, width: 48, height: 48, borderRadius: 12, marginBottom: 16 }} />
            <div style={{ ...S.skeleton, width: '60%', height: 36 }} />
            <div style={{ ...S.skeleton, width: '80%', height: 14 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );

  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>

      {/* Stat Cards */}
      <div style={S.grid}>
        {[
          { icon: '👥', value: stats.total, label: 'Total Registrations', delta: `+${stats.today} today` },
          { icon: '🎟️', value: stats.free, label: 'Free Tickets', color: '#4ade80' },
          { icon: '⭐', value: stats.vip, label: 'VIP Tickets', color: '#eeb053' },
          { icon: '✉️', value: stats.emailsSent, label: 'Emails Sent', color: '#60a5fa' },
        ].map((s, i) => (
          <div key={i} style={{ ...S.statCard, borderColor: i === 0 ? 'rgba(156,28,34,0.25)' : '#1e1e1e' }}>
            <span style={S.statIcon}>{s.icon}</span>
            <div style={{ ...S.statValue, color: s.color ?? '#fff' }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
            {s.delta && <div style={S.statDelta}>{s.delta}</div>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Quick Actions</div>
        <div style={S.quickActions}>
          {([
            { icon: '📋', label: 'View Registrations', page: 'registrations' },
            { icon: '📨', label: 'Send Email', page: 'email' },
            { icon: '✏️', label: 'Edit Content', page: 'cms' },
          ] as { icon: string; label: string; page: AdminPage }[]).map(a => (
            <div
              key={a.page} style={S.qBtn}
              onClick={() => onNavigate(a.page)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#9c1c22'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(156,28,34,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLDivElement).style.background = '#141414'; }}
            >
              <span style={S.qBtnIcon}>{a.icon}</span>
              <span style={S.qBtnLabel}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Registrations */}
      <div style={S.section}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={S.sectionTitle}>Recent Registrations</div>
          <span style={{ fontSize: 13, color: '#9c1c22', cursor: 'pointer', fontWeight: 600 }} onClick={() => onNavigate('registrations')}>View all →</span>
        </div>
        {stats.recent.length === 0 ? (
          <div style={S.empty}>No registrations yet. Share the workshop link to get started!</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Ticket</th>
                <th style={S.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ ...S.td, color: '#fff', fontWeight: 500 }}>{r.full_name || '—'}</td>
                  <td style={S.td}>{r.email || '—'}</td>
                  <td style={S.td}><span style={S.badge(r.ticket_type ?? 'free')}>{(r.ticket_type ?? 'free').toUpperCase()}</span></td>
                  <td style={{ ...S.td, color: '#6b7280', fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
