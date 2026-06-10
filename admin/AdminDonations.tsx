import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabaseAdmin } from '../supabase';

// ─── Parse donation amount from payment_reference string ──────────────────────
// Format: "Donation: $50 - Ref: PayPal Order: 12345" or "Donation: $0 - Ref: Unpaid (Voluntary)"
function parseAmount(ref: string | null): number {
  if (!ref) return 0;
  const match = ref.match(/Donation:\s*\$?([\d.]+)/i);
  return match ? parseFloat(match[1]) : 0;
}

function parseRef(ref: string | null): string {
  if (!ref) return '—';
  const match = ref.match(/Ref:\s*(.+)$/i);
  return match ? match[1].trim() : ref;
}

function fmtDate(ts: string | null): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

interface Donation {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  organization: string;
  ticket_type: string;
  payment_method: string | null;
  payment_reference: string | null;
  amount: number;
  refText: string;
  verified: boolean;
}

type DateFilter = '7d' | '30d' | '90d' | 'year' | 'all' | 'custom';

const CURRENCY = 'USD';

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const printRef = useRef<HTMLDivElement>(null);

  // ── Load donations ────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from('workshop_registrations')
      .select('id, created_at, full_name, email, phone, city, organization, ticket_type, payment_method, payment_reference')
      .eq('ticket_type', 'donation')
      .order('created_at', { ascending: false });

    const rows: Donation[] = (data ?? []).map((r: any) => {
      const amt = parseAmount(r.payment_reference);
      const method = (r.payment_method || '').toLowerCase();
      const isOnlinePaid = method.includes('paypal') || method.includes('stripe') || method.includes('flutterwave') || method.includes('paystack');
      const isManualVerified = method.includes('verified');
      return {
        ...r,
        amount: amt,
        refText: parseRef(r.payment_reference),
        verified: !!(r.payment_method && (isOnlinePaid || isManualVerified) && amt > 0),
      };
    });

    setDonations(rows);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleVerify = async (id: string, currentVerified: boolean, method: string | null) => {
    let newMethod = method || 'Bank Transfer';
    if (!currentVerified) {
      if (!newMethod.toLowerCase().includes('verified')) {
        newMethod = newMethod ? `${newMethod} (Verified)` : 'Verified';
      }
    } else {
      newMethod = newMethod.replace(/\s*\(Verified\)/gi, '').replace(/^Verified$/i, '').trim() || 'Bank Transfer';
    }
    
    const { error } = await supabaseAdmin
      .from('workshop_registrations')
      .update({ payment_method: newMethod })
      .eq('id', id);
      
    if (error) {
      alert('Error updating verification status: ' + error.message);
    } else {
      load();
    }
  };

  // ── Filter by date range ──────────────────────────────────────────────────────
  const getDateBound = (): Date | null => {
    const now = new Date();
    if (dateFilter === '7d') return new Date(now.getTime() - 7 * 86400000);
    if (dateFilter === '30d') return new Date(now.getTime() - 30 * 86400000);
    if (dateFilter === '90d') return new Date(now.getTime() - 90 * 86400000);
    if (dateFilter === 'year') return new Date(now.getFullYear(), 0, 1);
    return null;
  };

  const filtered = donations.filter(d => {
    // Date filter
    const bound = getDateBound();
    if (bound && new Date(d.created_at) < bound) return false;
    if (dateFilter === 'custom') {
      if (customFrom && new Date(d.created_at) < new Date(customFrom)) return false;
      if (customTo && new Date(d.created_at) > new Date(customTo + 'T23:59:59')) return false;
    }
    // Verification filter
    if (filterVerified === 'verified' && !d.verified) return false;
    if (filterVerified === 'unverified' && d.verified) return false;
    // Search
    const q = search.toLowerCase();
    if (q && !d.full_name?.toLowerCase().includes(q) && !d.email?.toLowerCase().includes(q) && !d.refText?.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'amount') cmp = a.amount - b.amount;
    if (sortBy === 'name') cmp = (a.full_name ?? '').localeCompare(b.full_name ?? '');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // ── Summary metrics ───────────────────────────────────────────────────────────
  const totalRaised = filtered.reduce((s, d) => s + d.amount, 0);
  const verifiedRaised = filtered.filter(d => d.verified).reduce((s, d) => s + d.amount, 0);
  const avgDonation = filtered.length > 0 ? totalRaised / filtered.length : 0;
  const verifiedCount = filtered.filter(d => d.verified).length;
  const highestDonation = filtered.reduce((max, d) => d.amount > max ? d.amount : max, 0);

  // ── Monthly chart data (last 6 months) ───────────────────────────────────────
  const monthlyData = (() => {
    const now = new Date();
    const months: { label: string; amount: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const inMonth = donations.filter(don => {
        const dt = new Date(don.created_at);
        return dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth();
      });
      months.push({ label, amount: inMonth.reduce((s, x) => s + x.amount, 0), count: inMonth.length });
    }
    return months;
  })();
  const maxMonthly = Math.max(...monthlyData.map(m => m.amount), 1);

  // ── Sort toggle ───────────────────────────────────────────────────────────────
  const toggleSort = (col: 'date' | 'amount' | 'name') => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [
      ['Date', 'Name', 'Email', 'Phone', 'City', 'Organization', 'Amount (USD)', 'Payment Method', 'Reference', 'Status'].join(','),
      ...filtered.map(d => [
        fmtDate(d.created_at),
        `"${d.full_name ?? ''}"`,
        d.email ?? '',
        d.phone ?? '',
        d.city ?? '',
        `"${d.organization ?? ''}"`,
        d.amount.toFixed(2),
        d.payment_method ?? 'Voluntary',
        `"${d.refText}"`,
        d.verified ? 'Verified' : 'Unverified',
      ].join(','))
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `FOL_Donations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Print ─────────────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const S: Record<string, any> = {
    card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 },
    label: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const },
    input: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none', transition: 'border-color 0.2s' },
    select: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#d1d5db', fontSize: 13, padding: '9px 12px', outline: 'none', cursor: 'pointer' },
    btn: (active?: boolean): React.CSSProperties => ({
      padding: '8px 16px', borderRadius: 8, border: `1px solid ${active ? '#9c1c22' : '#2a2a2a'}`,
      background: active ? 'rgba(156,28,34,0.15)' : 'transparent', color: active ? '#fca5a5' : '#9ca3af',
      cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
    }),
    actionBtn: (color: string): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10,
      border: `1px solid ${color}33`, background: `${color}14`, color, cursor: 'pointer', fontSize: 13, fontWeight: 700,
    }),
    th: (col: string, active: boolean): React.CSSProperties => ({
      padding: '12px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: active ? '#eeb053' : '#6b7280',
      letterSpacing: 0.8, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
      cursor: ['date', 'amount', 'name'].includes(col) ? 'pointer' : 'default', userSelect: 'none' as const,
      background: '#141414', borderBottom: '1px solid #1e1e1e',
    }),
    td: { padding: '12px 14px', fontSize: 13, color: '#d1d5db', borderBottom: '1px solid #111', verticalAlign: 'middle' as const },
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #1e1e1e', borderTopColor: '#9c1c22', borderRadius: '50%', animation: 'dspin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <style>{`@keyframes dspin { to { transform: rotate(360deg); } }`}</style>
      Loading donation records...
    </div>
  );

  return (
    <div>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #donations-print-area { display: block !important; }
          #donations-print-area { color: #000 !important; background: #fff !important; }
          .no-print { display: none !important; }
        }
        .sg-hover:hover { background: rgba(156,28,34,0.06) !important; }
        @keyframes dspin { to { transform: rotate(360deg); } }
      `}</style>

      <div id="donations-print-area" ref={printRef}>
        {/* ── Print Header (hidden on screen, shown in print) ─────────────── */}
        <div style={{ display: 'none' }} className="print-only">
          <h1>Foundation of Luv — Donation Report</h1>
          <p>Generated: {new Date().toLocaleString()}</p>
          <p>Period: {dateFilter === 'all' ? 'All Time' : dateFilter}</p>
        </div>

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }} className="no-print">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 5px' }}>💰 Donation Reports</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
              {donations.length} total donation records — {fmtCurrency(donations.reduce((s, d) => s + d.amount, 0))} raised overall
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={S.actionBtn('#22c55e')} onClick={exportCSV}>📊 Export CSV</button>
            <button style={S.actionBtn('#eeb053')} onClick={handlePrint}>🖨️ Print Report</button>
          </div>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Raised', value: fmtCurrency(totalRaised), icon: '💵', color: '#22c55e', sub: `${filtered.length} donors` },
            { label: 'Verified Funds', value: fmtCurrency(verifiedRaised), icon: '✅', color: '#4ade80', sub: `${verifiedCount} transactions` },
            { label: 'Avg Donation', value: fmtCurrency(avgDonation), icon: '📊', color: '#eeb053', sub: 'per donor' },
            { label: 'Highest Gift', value: fmtCurrency(highestDonation), icon: '🏆', color: '#a78bfa', sub: 'single donation' },
            { label: 'Unverified', value: fmtCurrency(totalRaised - verifiedRaised), icon: '⏳', color: '#6b7280', sub: `${filtered.length - verifiedCount} voluntary` },
          ].map(c => (
            <div key={c.label} style={{ ...S.card, padding: 18 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 2 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#4b5563' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Monthly Chart ──────────────────────────────────────────────────── */}
        <div style={{ ...S.card, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20 }}>📈 Monthly Donations (Last 6 Months)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120 }}>
            {monthlyData.map(m => (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600 }}>{m.amount > 0 ? fmtCurrency(m.amount) : ''}</div>
                <div style={{ width: '100%', position: 'relative', height: 80, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.5s',
                    height: `${Math.max(4, (m.amount / maxMonthly) * 80)}px`,
                    background: m.amount > 0 ? 'linear-gradient(180deg, #9c1c22, #7a1219)' : '#1e1e1e',
                  }} title={`${m.label}: ${fmtCurrency(m.amount)} (${m.count} donors)`} />
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: '#4b5563' }}>{m.count > 0 ? `${m.count} donor${m.count !== 1 ? 's' : ''}` : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div style={{ ...S.card, marginBottom: 20 }} className="no-print">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {/* Search */}
            <input
              className="sg-input"
              style={{ ...S.input, minWidth: 200, flex: 1 }}
              placeholder="🔍 Search by name, email, or reference..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#9c1c22')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />

            {/* Date filter */}
            <select style={S.select} value={dateFilter} onChange={e => setDateFilter(e.target.value as DateFilter)}>
              <option value="all">📅 All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === 'custom' && (
              <>
                <input type="date" style={S.input} value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                <span style={{ color: '#4b5563', fontSize: 12 }}>to</span>
                <input type="date" style={S.input} value={customTo} onChange={e => setCustomTo(e.target.value)} />
              </>
            )}

            {/* Verified filter */}
            <select style={S.select} value={filterVerified} onChange={e => setFilterVerified(e.target.value as any)}>
              <option value="all">All Donations</option>
              <option value="verified">✅ Verified Only</option>
              <option value="unverified">⏳ Unverified Only</option>
            </select>
          </div>

          {/* Results count */}
          <div style={{ marginTop: 10, fontSize: 12, color: '#4b5563' }}>
            Showing <strong style={{ color: '#d1d5db' }}>{filtered.length}</strong> of {donations.length} records · 
            Total: <strong style={{ color: '#22c55e' }}>{fmtCurrency(totalRaised)}</strong>
          </div>
        </div>

        {/* ── Transaction Table ──────────────────────────────────────────────── */}
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>📋 Transaction History</div>
            <div style={{ fontSize: 12, color: '#4b5563' }}>
              Sort by:&nbsp;
              <button onClick={() => toggleSort('date')} style={S.btn(sortBy === 'date')}>Date {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</button>
              &nbsp;
              <button onClick={() => toggleSort('amount')} style={S.btn(sortBy === 'amount')}>Amount {sortBy === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</button>
              &nbsp;
              <button onClick={() => toggleSort('name')} style={S.btn(sortBy === 'name')}>Name {sortBy === 'name' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4b5563' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💸</div>
              No donation records match your filters.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th('date', sortBy === 'date')} onClick={() => toggleSort('date')}># Date</th>
                    <th style={S.th('name', sortBy === 'name')} onClick={() => toggleSort('name')}>Donor</th>
                    <th style={S.th('amount', sortBy === 'amount')} onClick={() => toggleSort('amount')}>Amount</th>
                    <th style={S.th('method', false)}>Method</th>
                    <th style={S.th('ref', false)}>Reference</th>
                    <th style={S.th('status', false)}>Status</th>
                    <th style={S.th('city', false)}>City</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={d.id} className="sg-hover" style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={S.td}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{fmtDate(d.created_at)}</div>
                      </td>
                      <td style={S.td}>
                        <div style={{ fontWeight: 600, color: '#fff', marginBottom: 2 }}>{d.full_name || '—'}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{d.email}</div>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: d.amount > 0 ? '#4ade80' : '#4b5563' }}>
                          {d.amount > 0 ? fmtCurrency(d.amount) : 'Voluntary'}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{d.payment_method || 'Voluntary'}</span>
                      </td>
                      <td style={{ ...S.td, maxWidth: 200 }}>
                        <div style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          title={d.refText}>
                          {d.refText}
                        </div>
                      </td>
                      <td style={S.td}>
                        <button
                          onClick={() => toggleVerify(d.id, d.verified, d.payment_method)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            color: d.verified ? '#4ade80' : '#a3a3a3',
                            background: d.verified ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${d.verified ? 'rgba(34,197,94,0.2)' : '#2a2a2a'}`,
                            borderRadius: 20,
                            padding: '4px 10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          title="Click to toggle verification status"
                          className="sg-status-toggle"
                        >
                          {d.verified ? '✅ Verified' : '⏳ Verify'}
                        </button>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{d.city || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Table Footer Summary */}
                <tfoot>
                  <tr style={{ background: '#0f0f0f', borderTop: '2px solid #2a2a2a' }}>
                    <td colSpan={2} style={{ ...S.td, fontWeight: 700, color: '#fff', fontSize: 13 }}>
                      TOTAL ({filtered.length} records)
                    </td>
                    <td style={{ ...S.td, fontWeight: 800, fontSize: 16, color: '#22c55e' }}>
                      {fmtCurrency(totalRaised)}
                    </td>
                    <td colSpan={4} style={{ ...S.td, fontSize: 12, color: '#4b5563' }}>
                      {verifiedCount} verified · {filtered.length - verifiedCount} voluntary · avg {fmtCurrency(avgDonation)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* ── Print Footer ──────────────────────────────────────────────────── */}
        <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#4b5563' }} className="no-print">
          <span>Foundation of Luv — Confidential Financial Report</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={S.actionBtn('#22c55e')} onClick={exportCSV}>📊 Export CSV</button>
            <button style={S.actionBtn('#eeb053')} onClick={handlePrint}>🖨️ Print Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonations;
