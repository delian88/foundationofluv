import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: 'draft' | 'published' | 'cancelled';
  registration_link: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

const EMPTY_EVENT: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: 'Online (Zoom Link Provided Upon Registration)',
  type: 'Workshop',
  status: 'draft',
  registration_link: '',
  image_url: '',
};

const EVENT_TYPES = ['Workshop', 'Seminar', 'Webinar', 'Community Event', 'Fundraiser', 'Training', 'Conference', 'Other'];

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_EVENT });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (!error) setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (ev: Event) => {
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      type: ev.type,
      status: ev.status,
      registration_link: ev.registration_link || '',
      image_url: ev.image_url || '',
    });
    setEditingId(ev.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setForm({ ...EMPTY_EVENT });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_EVENT });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim()) {
      showToast('⚠️ Title and Date are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      ({ error } = await supabaseAdmin.from('events').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabaseAdmin.from('events').insert({ ...payload, created_at: new Date().toISOString() }));
    }

    if (error) {
      showToast('❌ Error saving event: ' + error.message);
    } else {
      showToast(editingId ? '✅ Event updated successfully!' : '✅ Event created successfully!');
      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_EVENT });
      await load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
    if (error) {
      showToast('❌ Error deleting event.');
    } else {
      showToast('🗑️ Event deleted.');
      setDeleteConfirm(null);
      await load();
    }
  };

  const handleStatusToggle = async (ev: Event) => {
    const newStatus = ev.status === 'published' ? 'draft' : 'published';
    const { error } = await supabaseAdmin.from('events').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', ev.id);
    if (!error) {
      showToast(`✅ Event ${newStatus === 'published' ? 'published' : 'unpublished'}.`);
      await load();
    }
  };

  const filtered = events.filter(ev => {
    const matchSearch = !search.trim() ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.type.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || ev.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor = (status: string) => {
    if (status === 'published') return { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' };
    if (status === 'cancelled') return { bg: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: 'rgba(239,68,68,0.2)' };
    return { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: 'rgba(107,114,128,0.2)' };
  };

  const upcoming = events.filter(e => e.status === 'published' && new Date(e.date) >= new Date()).length;
  const published = events.filter(e => e.status === 'published').length;
  const drafts = events.filter(e => e.status === 'draft').length;

  const S: Record<string, any> = {
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 },
    statCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, padding: '18px 16px' },
    statVal: { fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1 },
    statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4, fontWeight: 500 },
    toolbar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' as const, alignItems: 'center' },
    input: { flex: '1 1 200px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '10px 16px', outline: 'none' },
    select: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '10px 14px', outline: 'none', cursor: 'pointer' },
    addBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0 },
    formCard: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, marginBottom: 28 },
    formTitle: { fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 24 },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
    formField: { marginBottom: 16 },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 },
    formInput: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '11px 14px', outline: 'none', transition: 'border-color 0.2s' },
    formTextarea: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '11px 14px', outline: 'none', resize: 'vertical' as const, minHeight: 100, fontFamily: 'inherit', lineHeight: 1.6 },
    formSelect: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '11px 14px', outline: 'none', cursor: 'pointer' },
    formActions: { display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' as const },
    saveBtn: { padding: '12px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    cancelBtn: { padding: '12px 20px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer' },
    eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
    eventCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, overflow: 'hidden' as const, position: 'relative' as const },
    eventHeader: { padding: '20px 20px 12px', borderBottom: '1px solid #1a1a1a' },
    eventTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 },
    eventMeta: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' },
    typeBadge: { fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(156,28,34,0.15)', color: '#fca5a5', border: '1px solid rgba(156,28,34,0.25)', fontWeight: 700 },
    statusBadge: (s: string): React.CSSProperties => {
      const c = statusColor(s);
      return { fontSize: 10, padding: '3px 9px', borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontWeight: 700, textTransform: 'uppercase' as const };
    },
    eventBody: { padding: '14px 20px' },
    eventInfo: { fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 },
    eventDesc: { fontSize: 13, color: '#6b7280', marginTop: 10, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' },
    eventActions: { padding: '12px 20px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: 8, flexWrap: 'wrap' as const },
    actionBtn: (variant: 'edit' | 'publish' | 'delete' | 'cancel' = 'edit'): React.CSSProperties => ({
      padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
      background: variant === 'delete' ? 'rgba(239,68,68,0.12)' : variant === 'publish' ? 'rgba(34,197,94,0.12)' : variant === 'cancel' ? 'rgba(107,114,128,0.12)' : 'rgba(156,28,34,0.12)',
      color: variant === 'delete' ? '#fca5a5' : variant === 'publish' ? '#4ade80' : variant === 'cancel' ? '#9ca3af' : '#fca5a5',
    }),
    empty: { textAlign: 'center' as const, padding: '60px 20px', color: '#4b5563' },
    toastStyle: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' },
    deleteModal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    deleteCard: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' as const },
  };

  return (
    <div>
      <style>{`
        .events-input:focus { border-color: #9c1c22 !important; }
        .event-action-btn:hover { filter: brightness(1.2); }
      `}</style>

      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { icon: '📅', val: events.length, label: 'Total Events' },
          { icon: '✅', val: published, label: 'Published' },
          { icon: '⏰', val: upcoming, label: 'Upcoming' },
          { icon: '📝', val: drafts, label: 'Drafts' },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={S.statVal}>{s.val}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Event Form */}
      {showForm && (
        <div style={S.formCard}>
          <div style={S.formTitle}>{editingId ? '✏️ Edit Event' : '➕ New Event'}</div>

          {/* Title & Type */}
          <div style={S.formGrid}>
            <div>
              <label style={S.label}>Event Title *</label>
              <input
                className="events-input"
                style={S.formInput}
                placeholder="e.g. Cybersecurity Workshop"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={S.label}>Event Type</label>
              <select style={S.formSelect} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div style={S.formGrid}>
            <div>
              <label style={S.label}>Date *</label>
              <input
                className="events-input"
                style={S.formInput}
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={S.label}>Time</label>
              <input
                className="events-input"
                style={S.formInput}
                placeholder="e.g. 10:00 AM - 3:00 PM EST"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
          </div>

          {/* Location & Status */}
          <div style={S.formGrid}>
            <div>
              <label style={S.label}>Location</label>
              <input
                className="events-input"
                style={S.formInput}
                placeholder="Online / Physical address"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.formSelect} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                <option value="draft">Draft (Hidden from public)</option>
                <option value="published">Published (Visible on site)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Registration Link & Image */}
          <div style={S.formGrid}>
            <div>
              <label style={S.label}>Registration Link</label>
              <input
                className="events-input"
                style={S.formInput}
                placeholder="https:// or /register-workshop"
                value={form.registration_link}
                onChange={e => setForm(f => ({ ...f, registration_link: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={S.label}>Flyer / Image URL (optional)</label>
              <input
                className="events-input"
                style={S.formInput}
                placeholder="https://... or /image.jpg"
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#9c1c22')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>
          </div>

          {/* Description */}
          <div style={S.formField}>
            <label style={S.label}>Description</label>
            <textarea
              className="events-input"
              style={S.formTextarea}
              rows={4}
              placeholder="Describe the event, speakers, agenda, etc."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = '#9c1c22')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          </div>

          <div style={S.formActions}>
            <button
              style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '⏳ Saving...' : editingId ? '💾 Update Event' : '➕ Create Event'}
            </button>
            <button style={S.cancelBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <input
          style={S.input}
          placeholder="🔍 Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => (e.currentTarget.style.borderColor = '#9c1c22')}
          onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
        />
        <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {!showForm && (
          <button style={S.addBtn} onClick={handleNew}>
            ➕ New Event
          </button>
        )}
      </div>

      {/* Events List */}
      {loading ? (
        <div style={S.empty}><div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>Loading events...</div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ color: '#9ca3af', fontWeight: 600, marginBottom: 8 }}>
            {events.length === 0 ? 'No events yet.' : 'No events match your filters.'}
          </div>
          {events.length === 0 && (
            <div style={{ fontSize: 13, color: '#4b5563' }}>Click "New Event" to schedule your first event.</div>
          )}
        </div>
      ) : (
        <div style={S.eventsGrid}>
          {filtered.map(ev => {
            const isPast = ev.date && new Date(ev.date) < new Date();
            return (
              <div key={ev.id} style={{ ...S.eventCard, opacity: isPast && ev.status === 'published' ? 0.75 : 1 }}>
                {/* Image Banner */}
                {ev.image_url && (
                  <div style={{ height: 120, overflow: 'hidden' }}>
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <div style={S.eventHeader}>
                  <div style={S.eventTitle}>{ev.title}</div>
                  <div style={S.eventMeta}>
                    <span style={S.typeBadge}>{ev.type}</span>
                    <span style={S.statusBadge(ev.status)}>{ev.status}</span>
                    {isPast && <span style={{ fontSize: 10, color: '#4b5563', fontWeight: 600 }}>PAST</span>}
                  </div>
                </div>

                <div style={S.eventBody}>
                  {ev.date && (
                    <div style={S.eventInfo}>
                      📅 <span style={{ color: '#d1d5db' }}>
                        {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        {ev.time && ` · ${ev.time}`}
                      </span>
                    </div>
                  )}
                  {ev.location && (
                    <div style={S.eventInfo}>📍 <span style={{ color: '#d1d5db' }}>{ev.location}</span></div>
                  )}
                  {ev.description && (
                    <div style={S.eventDesc}>{ev.description}</div>
                  )}
                </div>

                <div style={S.eventActions}>
                  <button
                    className="event-action-btn"
                    style={S.actionBtn('edit')}
                    onClick={() => handleEdit(ev)}
                  >✏️ Edit</button>
                  <button
                    className="event-action-btn"
                    style={S.actionBtn(ev.status === 'published' ? 'cancel' : 'publish')}
                    onClick={() => handleStatusToggle(ev)}
                  >
                    {ev.status === 'published' ? '🔒 Unpublish' : '🚀 Publish'}
                  </button>
                  <button
                    className="event-action-btn"
                    style={S.actionBtn('delete')}
                    onClick={() => setDeleteConfirm(ev.id)}
                  >🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={S.deleteModal} onClick={() => setDeleteConfirm(null)}>
          <div style={S.deleteCard} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Delete Event?</div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
              This action cannot be undone. The event will be permanently removed.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleDelete(deleteConfirm)}
              >Delete</button>
              <button
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}
                onClick={() => setDeleteConfirm(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toastStyle}>{toast}</div>}
    </div>
  );
};

export default AdminEvents;
