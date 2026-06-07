import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../supabase';

interface ContentField {
  section: string;
  key: string;
  value?: string;
  label: string;
  multiline?: boolean;
}

const FIELDS: ContentField[] = [
  // Hero
  { section: 'hero', key: 'title', label: 'Hero Title', multiline: false },
  { section: 'hero', key: 'subtitle', label: 'Hero Subtitle', multiline: true },
  // About
  { section: 'about', key: 'intro', label: 'About / Mission Intro', multiline: true },
  // Contact
  { section: 'contact', key: 'phone', label: 'Contact Phone', multiline: false },
  { section: 'contact', key: 'address', label: 'Contact Address', multiline: false },
  { section: 'contact', key: 'email', label: 'Contact Email', multiline: false },
  // Workshop
  { section: 'workshop', key: 'date', label: 'Workshop Date', multiline: false },
  { section: 'workshop', key: 'time', label: 'Workshop Time', multiline: false },
  { section: 'workshop', key: 'location', label: 'Workshop Location', multiline: false },
];

const SECTIONS = ['hero', 'about', 'contact', 'workshop'];
const SECTION_LABELS: Record<string, string> = {
  hero: '🏠 Hero Section',
  about: '❤️ About / Mission',
  contact: '📞 Contact Info',
  workshop: '🎓 Workshop Details',
};

const AdminCMS: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeSection, setActiveSection] = useState('hero');

  const makeKey = (section: string, key: string) => `${section}:${key}`;

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseAdmin.from('site_content').select('section, key, value');
      const map: Record<string, string> = {};
      (data ?? []).forEach((row: any) => { map[makeKey(row.section, row.key)] = row.value ?? ''; });
      
      // Set defaults for any missing fields
      FIELDS.forEach(f => {
        const k = makeKey(f.section, f.key);
        if (!(k in map)) map[k] = '';
      });

      setValues(map);
      setOriginal(map);
      setLoading(false);
    };
    load();
  }, []);

  const hasChanges = JSON.stringify(values) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    const upserts = FIELDS.map(f => ({
      section: f.section,
      key: f.key,
      value: values[makeKey(f.section, f.key)] ?? '',
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert(upserts, { onConflict: 'section,key' });

    if (!error) {
      setOriginal({ ...values });
      showToast('✅ Content saved! Changes will reflect on the site.');
    } else {
      showToast('❌ Error saving. Please try again.');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setValues({ ...original });
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const sectionFields = FIELDS.filter(f => f.section === activeSection);

  const S: Record<string, any> = {
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start' },
    sectionNav: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 12 },
    sectionNavTitle: { fontSize: 11, fontWeight: 700, color: '#4b5563', letterSpacing: 1.5, textTransform: 'uppercase' as const, padding: '8px 12px', marginBottom: 4 },
    sectionBtn: (active: boolean): React.CSSProperties => ({
      width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid transparent',
      cursor: 'pointer', textAlign: 'left' as const, fontSize: 13, fontWeight: 500,
      background: active ? 'rgba(156,28,34,0.15)' : 'transparent',
      color: active ? '#ff6b6b' : '#9ca3af',
      borderColor: active ? 'rgba(156,28,34,0.25)' : 'transparent',
      marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
    }),
    card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 28 },
    cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
    cardTitle: { fontSize: 18, fontWeight: 800, color: '#fff' },
    cardSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },
    actionBar: { display: 'flex', gap: 12 },
    saveBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: 1, transition: 'all 0.2s' },
    resetBtn: { padding: '10px 16px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer', transition: 'all 0.15s' },
    fieldGroup: { marginBottom: 24 },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 },
    hint: { fontSize: 11, color: '#4b5563', marginBottom: 6 },
    input: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 15, padding: '12px 14px', outline: 'none', transition: 'border-color 0.2s', lineHeight: 1.5 },
    textarea: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical' as const, minHeight: 100, fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.2s' },
    changedDot: { display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#eeb053', marginLeft: 6 },
    divider: { height: 1, background: '#1e1e1e', margin: '20px 0' },
    preview: { marginTop: 8, padding: '10px 12px', background: '#0f0f0f', borderRadius: 8, border: '1px solid #1a1a1a', fontSize: 13, color: '#9ca3af', lineHeight: 1.6 },
    toast: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', maxWidth: 380 },
    skeleton: { background: '#1e1e1e', borderRadius: 8, height: 44, marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' },
  };

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .cms-input:focus { border-color: #9c1c22 !important; box-shadow: 0 0 0 3px rgba(156,28,34,0.1); }
        .cms-save-btn:hover:not(:disabled) { background: linear-gradient(135deg, #b01e25, #9c1c22) !important; }
        .cms-reset-btn:hover { background: #1e1e1e !important; color: #fff !important; }
        .section-btn:hover { background: rgba(255,255,255,0.04) !important; color: #d1d5db !important; }
      `}</style>

      <div style={S.layout}>
        {/* Section Nav */}
        <div style={S.sectionNav}>
          <div style={S.sectionNavTitle}>Sections</div>
          {SECTIONS.map(sec => (
            <button
              key={sec}
              className="section-btn"
              style={S.sectionBtn(activeSection === sec)}
              onClick={() => setActiveSection(sec)}
            >
              {SECTION_LABELS[sec]}
              {FIELDS.filter(f => f.section === sec && values[makeKey(f.section, f.key)] !== original[makeKey(f.section, f.key)]).length > 0 && (
                <span style={S.changedDot} title="Unsaved changes" />
              )}
            </button>
          ))}

          <div style={S.divider} />

          <div style={{ padding: '8px 12px' }}>
            <a href="/" target="_blank" style={{ fontSize: 13, color: '#eeb053', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              🌐 Preview Site ↗
            </a>
          </div>
        </div>

        {/* Editor */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div>
              <div style={S.cardTitle}>{SECTION_LABELS[activeSection]}</div>
              <div style={S.cardSub}>Edit the content for this section. Changes are saved to the database.</div>
            </div>
            <div style={S.actionBar}>
              {hasChanges && (
                <button className="cms-reset-btn" style={S.resetBtn} onClick={handleReset}>↩ Reset</button>
              )}
              <button
                className="cms-save-btn"
                style={{ ...S.saveBtn, opacity: (!hasChanges || saving) ? 0.5 : 1, cursor: (!hasChanges || saving) ? 'not-allowed' : 'pointer' }}
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>

          {loading ? (
            <>
              {[...Array(3)].map((_, i) => <div key={i} style={S.skeleton} />)}
            </>
          ) : (
            sectionFields.map(field => {
              const k = makeKey(field.section, field.key);
              const isChanged = values[k] !== original[k];
              return (
                <div key={k} style={S.fieldGroup}>
                  <label style={{ ...S.label, color: isChanged ? '#eeb053' : '#6b7280' }}>
                    {field.label}
                    {isChanged && <span style={S.changedDot} title="Unsaved change" />}
                  </label>
                  {field.multiline ? (
                    <textarea
                      className="cms-input"
                      style={{ ...S.textarea, borderColor: isChanged ? 'rgba(238,176,83,0.3)' : '#2a2a2a' }}
                      value={values[k] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [k]: e.target.value }))}
                      rows={3}
                    />
                  ) : (
                    <input
                      className="cms-input"
                      style={{ ...S.input, borderColor: isChanged ? 'rgba(238,176,83,0.3)' : '#2a2a2a' }}
                      value={values[k] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [k]: e.target.value }))}
                    />
                  )}
                  {isChanged && original[k] && (
                    <div style={S.preview}>
                      <span style={{ color: '#4b5563', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Was: </span>
                      {original[k]}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {hasChanges && (
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(238,176,83,0.06)', border: '1px solid rgba(238,176,83,0.15)', borderRadius: 10, fontSize: 13, color: '#d1a84f' }}>
              ⚠️ You have unsaved changes. Click "Save Changes" to apply them to the website.
            </div>
          )}
        </div>
      </div>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
};

export default AdminCMS;
