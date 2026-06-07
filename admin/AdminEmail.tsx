import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../supabase';

const AdminEmail: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'single' | 'bulk'>('bulk');
  const [recipientFilter, setRecipientFilter] = useState<'all' | 'free' | 'vip'>('all');
  const [singleSearch, setSingleSearch] = useState('');
  const [selectedSingle, setSelectedSingle] = useState<any | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      supabaseAdmin.from('workshop_registrations').select('id, full_name, email, ticket_type').order('full_name'),
      supabaseAdmin.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(20),
    ]).then(([regs, emails]) => {
      setRegistrations(regs.data ?? []);
      setLogs(emails.data ?? []);
      setLoading(false);
    });
  }, []);

  const getRecipients = () => {
    if (mode === 'single') return selectedSingle ? [selectedSingle] : [];
    return registrations.filter(r =>
      recipientFilter === 'all' ? true : (r.ticket_type ?? 'free') === recipientFilter
    );
  };

  const recipients = getRecipients();
  const recipientEmails = recipients.map(r => r.email).filter(Boolean);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { showToast('Please fill in subject and message'); return; }
    if (recipientEmails.length === 0) { showToast('No recipients selected'); return; }
    setSending(true);

    // Log the email to Supabase
    const { error } = await supabaseAdmin.from('email_logs').insert({
      recipients: recipientEmails,
      subject,
      body,
      status: 'sent',
    });

    if (!error) {
      const allEmails = recipientEmails.join(',');
      const mailtoUrl = `mailto:${allEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      try {
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'admin_email',
            payload: {
              recipients: recipientEmails,
              subject,
              body,
            }
          })
        });

        if (emailRes.ok) {
          showToast(`🚀 successfully sent to ${recipientEmails.length} recipient(s) via SMTP!`);
        } else {
          const errData = await emailRes.json().catch(() => ({}));
          showToast(`⚠️ SMTP error: ${errData.error || 'Failed to send'}`);
          if (recipientEmails.length <= 20) {
            window.location.href = mailtoUrl;
          }
        }
      } catch (err) {
        console.error('SMTP fetch failure:', err);
        showToast('⚠️ SMTP service unavailable. Fallback to mail client.');
        if (recipientEmails.length <= 20) {
          window.location.href = mailtoUrl;
        }
      }

      // Refresh logs
      const { data: newLogs } = await supabaseAdmin.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(20);
      setLogs(newLogs ?? []);
      setSubject('');
      setBody('');
      setSelectedSingle(null);
      setSingleSearch('');
    } else {
      showToast('Error saving email log. Please try again.');
    }
    setSending(false);
  };

  const copyEmails = () => {
    navigator.clipboard.writeText(recipientEmails.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const filteredSingle = singleSearch
    ? registrations.filter(r =>
        (r.full_name ?? '').toLowerCase().includes(singleSearch.toLowerCase()) ||
        (r.email ?? '').toLowerCase().includes(singleSearch.toLowerCase())
      )
    : [];

  const S: Record<string, any> = {
    grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' },
    card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 },
    cardTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 },
    modeToggle: { display: 'flex', gap: 8, marginBottom: 24, background: '#111', borderRadius: 12, padding: 4 },
    modeBtn: (active: boolean): React.CSSProperties => ({
      flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, #9c1c22, #7a1219)' : 'transparent',
      color: active ? '#fff' : '#6b7280', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
    }),
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 },
    input: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '12px 14px', outline: 'none', transition: 'border-color 0.2s', marginBottom: 16 },
    textarea: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical' as const, minHeight: 200, fontFamily: 'inherit', lineHeight: 1.6, marginBottom: 16 },
    sendBtn: { width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' },
    recipientsBox: { background: '#111', borderRadius: 12, padding: 16, marginBottom: 20 },
    recipientsTitle: { fontSize: 12, color: '#6b7280', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 },
    recipientChip: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#d1d5db', fontSize: 12, margin: '3px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
    recipientsCount: { fontSize: 13, color: '#9ca3af', marginTop: 8 },
    copyBtn: { fontSize: 12, color: '#eeb053', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600, padding: '4px 8px', borderRadius: 6 },
    select: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '12px 14px', outline: 'none', cursor: 'pointer', marginBottom: 16 },
    searchResult: { maxHeight: 200, overflowY: 'auto' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, marginBottom: 16 },
    searchItem: { padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #222', transition: 'background 0.1s' },
    // Logs
    logItem: { borderBottom: '1px solid #1a1a1a', padding: '14px 0', display: 'flex', flexDirection: 'column' as const, gap: 6 },
    logSubject: { fontSize: 14, fontWeight: 600, color: '#fff' },
    logMeta: { fontSize: 12, color: '#6b7280', display: 'flex', gap: 12 },
    logBadge: { fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontWeight: 700, border: '1px solid rgba(34,197,94,0.2)' },
    toast: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', maxWidth: 380 },
  };

  return (
    <div>
      <div style={S.grid}>
        {/* Compose */}
        <div style={S.card}>
          <div style={S.cardTitle}>✉️ Compose Email</div>

          {/* Mode Toggle */}
          <div style={S.modeToggle}>
            <button style={S.modeBtn(mode === 'bulk')} onClick={() => setMode('bulk')}>📨 Bulk Email</button>
            <button style={S.modeBtn(mode === 'single')} onClick={() => setMode('single')}>👤 Single Person</button>
          </div>

          {/* Recipient Selection */}
          {mode === 'bulk' ? (
            <div>
              <label style={S.label}>SEND TO</label>
              <select style={S.select} value={recipientFilter} onChange={e => setRecipientFilter(e.target.value as any)}>
                <option value="all">All Registrants ({registrations.length})</option>
                <option value="free">Free Ticket Holders ({registrations.filter(r => (r.ticket_type ?? 'free') === 'free').length})</option>
                <option value="vip">VIP Ticket Holders ({registrations.filter(r => r.ticket_type === 'vip').length})</option>
              </select>
            </div>
          ) : (
            <div>
              <label style={S.label}>SEARCH REGISTRANT</label>
              <input
                style={S.input} placeholder="Type name or email..." value={singleSearch}
                onChange={e => { setSingleSearch(e.target.value); setSelectedSingle(null); }}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
              {filteredSingle.length > 0 && !selectedSingle && (
                <div style={S.searchResult}>
                  {filteredSingle.slice(0, 8).map(r => (
                    <div
                      key={r.id} style={S.searchItem}
                      onClick={() => { setSelectedSingle(r); setSingleSearch(r.full_name); }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{r.full_name}</div>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>{r.email}</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedSingle && (
                <div style={{ background: 'rgba(156,28,34,0.1)', border: '1px solid rgba(156,28,34,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
                  ✅ To: <strong>{selectedSingle.full_name}</strong> ({selectedSingle.email})
                  <button onClick={() => { setSelectedSingle(null); setSingleSearch(''); }} style={{ marginLeft: 10, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
              )}
            </div>
          )}

          {/* Recipients Preview */}
          <div style={S.recipientsBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={S.recipientsTitle}>Recipients ({recipientEmails.length})</div>
              {recipientEmails.length > 0 && (
                <button style={S.copyBtn} onClick={copyEmails}>{copied ? '✅ Copied!' : '📋 Copy All Emails'}</button>
              )}
            </div>
            {recipientEmails.length === 0 ? (
              <div style={{ color: '#4b5563', fontSize: 13 }}>No recipients selected</div>
            ) : (
              <div>
                {recipientEmails.slice(0, 10).map(email => (
                  <span key={email} style={S.recipientChip}>📧 {email}</span>
                ))}
                {recipientEmails.length > 10 && (
                  <span style={{ ...S.recipientChip, color: '#9ca3af' }}>+{recipientEmails.length - 10} more</span>
                )}
              </div>
            )}
          </div>

          {/* Subject */}
          <label style={S.label}>SUBJECT</label>
          <input
            style={S.input} placeholder="Email subject..." value={subject} onChange={e => setSubject(e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#9c1c22')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />

          {/* Body */}
          <label style={S.label}>MESSAGE</label>
          <textarea
            style={S.textarea} placeholder="Write your message here..." value={body} onChange={e => setBody(e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#9c1c22')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />

          <button
            style={{ ...S.sendBtn, opacity: (sending || recipientEmails.length === 0) ? 0.6 : 1 }}
            onClick={handleSend} disabled={sending || recipientEmails.length === 0}
          >
            {sending ? '⏳ Sending...' : `🚀 Send to ${recipientEmails.length} Recipient${recipientEmails.length !== 1 ? 's' : ''}`}
          </button>

          <p style={{ fontSize: 12, color: '#4b5563', textAlign: 'center' as const, marginTop: 10, lineHeight: 1.5 }}>
            Email is logged to Supabase and sent automatically via Gmail SMTP serverless dispatch.
          </p>
        </div>

        {/* Email Log */}
        <div style={S.card}>
          <div style={S.cardTitle}>📜 Email History</div>
          {loading ? (
            <div style={{ color: '#6b7280', fontSize: 14 }}>Loading...</div>
          ) : logs.length === 0 ? (
            <div style={{ color: '#4b5563', fontSize: 14, padding: '20px 0' }}>No emails sent yet.</div>
          ) : (
            logs.map((log, i) => (
              <div key={log.id} style={S.logItem}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={S.logSubject}>{log.subject || '(No subject)'}</div>
                  <span style={S.logBadge}>{log.status?.toUpperCase()}</span>
                </div>
                <div style={S.logMeta}>
                  <span>📧 {(log.recipients ?? []).length} recipient(s)</span>
                  <span>🕐 {new Date(log.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                {log.body && (
                  <div style={{ fontSize: 12, color: '#4b5563', overflow: 'hidden', maxHeight: 36, textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                    {log.body}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
};

export default AdminEmail;
