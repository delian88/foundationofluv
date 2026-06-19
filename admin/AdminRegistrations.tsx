import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../supabase';

const AdminRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<any | null>(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabaseAdmin.from('workshop_registrations').select('*').order('created_at', { ascending: false });
    setRegistrations(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = [...registrations];
    if (ticketFilter !== 'all') result = result.filter(r => (r.ticket_type ?? 'free') === ticketFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        (r.full_name ?? '').toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        (r.phone ?? '').toLowerCase().includes(q) ||
        (r.organization ?? '').toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const va = a[sortField] ?? ''; const vb = b[sortField] ?? '';
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
    setFiltered(result);
  }, [search, ticketFilter, sortField, sortDir, registrations]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this registration?')) return;
    await supabaseAdmin.from('workshop_registrations').delete().eq('id', id);
    setRegistrations(r => r.filter(x => x.id !== id));
    setSelected(null);
    showToast('Registration deleted');
  };

  const exportCSV = () => {
    const cols = ['full_name', 'email', 'phone', 'city', 'organization', 'job_title', 'sex', 'age_group', 'profile', 'ticket_type', 'payment_method', 'created_at'];
    const rows = [cols.join(','), ...filtered.map(r => cols.map(c => `"${(r[c] ?? '').toString().replace(/"/g, '""')}"`).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `fol_registrations_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    showToast('CSV exported!');
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const resendConfirmationEmail = async (r: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmResend = window.confirm(`Resend confirmation email to ${r.full_name}?`);
    if (!confirmResend) return;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'registration',
          payload: {
            full_name: r.full_name,
            email: r.email,
            phone: r.phone,
            city: r.city,
            organization: r.organization,
            job_title: r.job_title,
            sex: r.sex,
            age_group: r.age_group,
            profile: r.profile,
            interests: r.interests || [],
            cybersecurity_level: r.cybersecurity_level,
            financial_level: r.financial_level,
            referral: r.referral,
            special_requirements: r.special_requirements,
            questions: r.questions,
            ticket_type: r.ticket_type,
            payment_method: r.payment_method || '',
            payment_reference: r.payment_reference || '',
          }
        })
      });
      if (response.ok) {
        showToast('Confirmation email resent successfully!');
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || errData.details || 'Unknown server error';
        alert(`Failed to resend confirmation email: ${errMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error resending email.');
    }
  };

  const S: Record<string, any> = {
    toolbar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' as const, alignItems: 'center' },
    input: { flex: '1 1 200px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '10px 16px', outline: 'none' },
    select: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '10px 14px', outline: 'none', cursor: 'pointer' },
    btn: (variant: 'default' | 'danger' | 'success' = 'default'): React.CSSProperties => ({
      padding: '10px 18px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      background: variant === 'danger' ? 'rgba(239,68,68,0.15)' : variant === 'success' ? 'rgba(34,197,94,0.15)' : '#1e1e1e',
      color: variant === 'danger' ? '#fca5a5' : variant === 'success' ? '#4ade80' : '#d1d5db',
      transition: 'all 0.15s',
    }),
    countBadge: { fontSize: 13, color: '#6b7280', padding: '10px 4px', whiteSpace: 'nowrap' as const },
    tableWrap: { overflowX: 'auto' as const, borderRadius: 14, border: '1px solid #1e1e1e' },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14 },
    th: (field: string): React.CSSProperties => ({
      textAlign: 'left' as const, padding: '14px 16px', fontSize: 11, fontWeight: 700,
      letterSpacing: 1, textTransform: 'uppercase' as const, background: '#111',
      borderBottom: '1px solid #1e1e1e', cursor: 'pointer', userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const,
      color: sortField === field ? '#fff' : '#6b7280',
    }),
    tr: (i: number): React.CSSProperties => ({ background: i % 2 === 0 ? '#141414' : '#111', cursor: 'pointer', transition: 'background 0.1s' }),
    td: { padding: '14px 16px', borderBottom: '1px solid #1a1a1a', color: '#d1d5db', whiteSpace: 'nowrap' as const },
    badge: (type: string): React.CSSProperties => {
      const isDonation = type === 'donation';
      const isVip = type === 'vip';
      return {
        display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
        background: isDonation || isVip ? 'rgba(238,176,83,0.15)' : 'rgba(34,197,94,0.1)',
        color: isDonation || isVip ? '#eeb053' : '#4ade80',
        border: `1px solid ${isDonation || isVip ? 'rgba(238,176,83,0.25)' : 'rgba(34,197,94,0.2)'}`,
      };
    },
    empty: { textAlign: 'center' as const, padding: '60px 20px', color: '#4b5563' },
    modal: {
      position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
    },
    modalCard: {
      background: '#141414', border: '1px solid #2a2a2a', borderRadius: 20,
      padding: '36px 32px', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' as const,
    },
    modalTitle: { fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 24 },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
    field: { marginBottom: 16 },
    fieldLabel: { fontSize: 11, color: '#6b7280', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 },
    fieldValue: { fontSize: 14, color: '#d1d5db', padding: '10px 12px', background: '#1a1a1a', borderRadius: 8, border: '1px solid #222', wordBreak: 'break-word' as const },
    toast: {
      position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e',
      border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px',
      color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999,
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 8,
    },
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const DetailField = ({ label, value }: { label: string; value: any }) => (
    <div style={S.field}>
      <div style={S.fieldLabel}>{label}</div>
      <div style={S.fieldValue}>{Array.isArray(value) ? value.join(', ') : (value || '—')}</div>
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={S.toolbar}>
        <input
          style={S.input} placeholder="🔍 Search name, email, phone, org…"
          value={search} onChange={e => setSearch(e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#9c1c22')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
        <select style={S.select} value={ticketFilter} onChange={e => setTicketFilter(e.target.value)}>
          <option value="all">All Tickets</option>
          <option value="free">Free Only</option>
          <option value="donation">Donation Only</option>
          <option value="vip">VIP Only (Legacy)</option>
        </select>
        <span style={S.countBadge}>{filtered.length} registrant{filtered.length !== 1 ? 's' : ''}</span>
        <button style={S.btn('success')} onClick={exportCSV}>⬇️ Export CSV</button>
        <button style={S.btn()} onClick={load}>🔄 Refresh</button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={S.empty}><div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>Loading registrations...</div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {[
                  { label: 'Name', field: 'full_name' },
                  { label: 'Email', field: 'email' },
                  { label: 'Phone', field: 'phone' },
                  { label: 'City', field: 'city' },
                  { label: 'Ticket', field: 'ticket_type' },
                  { label: 'Registered', field: 'created_at' },
                ].map(col => (
                  <th key={col.field} style={S.th(col.field)} onClick={() => handleSort(col.field)}>
                    {col.label}<SortIcon field={col.field} />
                  </th>
                ))}
                <th style={{ ...S.th(''), cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ ...S.empty, border: 'none' }}>No registrations found. {search && 'Try clearing your search.'}</td></tr>
              ) : filtered.map((r, i) => (
                <tr
                  key={r.id} style={S.tr(i)}
                  onClick={() => setSelected(r)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(156,28,34,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#141414' : '#111')}
                >
                  <td style={{ ...S.td, color: '#fff', fontWeight: 500 }}>{r.full_name || '—'}</td>
                  <td style={S.td}>{r.email || '—'}</td>
                  <td style={S.td}>{r.phone || '—'}</td>
                  <td style={S.td}>{r.city || '—'}</td>
                  <td style={S.td}><span style={S.badge(r.ticket_type ?? 'free')}>{(r.ticket_type ?? 'free').toUpperCase()}</span></td>
                  <td style={{ ...S.td, color: '#6b7280', fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={S.td}>
                    <button 
                      onClick={(e) => resendConfirmationEmail(r, e)}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(156,28,34,0.1)',
                        color: '#fca5a5',
                        border: '1px solid rgba(156,28,34,0.2)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#9c1c22'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(156,28,34,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
                    >
                      Resend ✉️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={S.modal} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={S.modalCard}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={S.modalTitle}>Registration Details</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
            </div>
            <div style={S.row2}>
              <DetailField label="Full Name" value={selected.full_name} />
              <DetailField label="Email" value={selected.email} />
            </div>
            <div style={S.row2}>
              <DetailField label="Phone" value={selected.phone} />
              <DetailField label="City" value={selected.city} />
            </div>
            <div style={S.row2}>
              <DetailField label="Organization" value={selected.organization} />
              <DetailField label="Job Title" value={selected.job_title} />
            </div>
            <div style={S.row2}>
              <DetailField label="Sex" value={selected.sex} />
              <DetailField label="Age Group" value={selected.age_group} />
            </div>
            <DetailField label="Participant Profile" value={selected.profile} />
            <DetailField label="Workshop Interests" value={selected.interests} />
            <div style={S.row2}>
              <DetailField label="Cybersecurity Level" value={selected.cybersecurity_level} />
              <DetailField label="Financial Level" value={selected.financial_level} />
            </div>
            <div style={S.row2}>
              <DetailField label="Ticket Type" value={(selected.ticket_type ?? 'free').toUpperCase()} />
              <DetailField label="Payment Method" value={selected.payment_method} />
            </div>
            <DetailField label="Payment Reference" value={selected.payment_reference} />
            <DetailField label="Special Requirements" value={selected.special_requirements} />
            <DetailField label="Questions / Comments" value={selected.questions} />
            <DetailField label="How they heard about us" value={selected.referral} />
            <DetailField label="Registered On" value={new Date(selected.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              <a href={`mailto:${selected.email}`} style={{ flex: 1, minWidth: 120 }}>
                <button style={{ ...S.btn('success'), width: '100%', textAlign: 'center' as const }}>✉️ Email this Person</button>
              </a>
              <button 
                style={{ ...S.btn('default'), flex: 1, minWidth: 120 }} 
                onClick={(e) => { resendConfirmationEmail(selected, e); }}
              >
                🔄 Resend Confirmation
              </button>
              <button style={{ ...S.btn('danger') }} onClick={() => handleDelete(selected.id)}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toast}>✅ {toast}</div>}
    </div>
  );
};

export default AdminRegistrations;
