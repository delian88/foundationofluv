import React, { useState, useEffect, useRef } from 'react';
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

const SECTIONS = ['hero', 'about', 'contact', 'workshop', 'flyer'];
const SECTION_LABELS: Record<string, string> = {
  hero: '🏠 Hero Section',
  about: '❤️ About / Mission',
  contact: '📞 Contact Info',
  workshop: '🎓 Workshop Details',
  flyer: '🖼️ Workshop Flyer',
};

const BUCKET = 'flyers';

const AdminCMS: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeSection, setActiveSection] = useState('hero');

  // Flyer state
  const [flyerList, setFlyerList] = useState<{ name: string; url: string }[]>([]);
  const [flyerUploading, setFlyerUploading] = useState(false);
  const [flyerError, setFlyerError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makeKey = (section: string, key: string) => `${section}:${key}`;

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseAdmin.from('site_content').select('section, key, value');
      const map: Record<string, string> = {};
      (data ?? []).forEach((row: any) => { map[makeKey(row.section, row.key)] = row.value ?? ''; });

      FIELDS.forEach(f => {
        const k = makeKey(f.section, f.key);
        if (!(k in map)) map[k] = '';
      });

      setValues(map);
      setOriginal(map);
      setLoading(false);

      // Load flyer list from storage
      loadFlyerList();
    };
    load();
  }, []);

  const loadFlyerList = async () => {
    try {
      // Ensure bucket exists
      await supabaseAdmin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
      const { data: files } = await supabaseAdmin.storage.from(BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } });
      if (files) {
        const list = files.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => {
          const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(f.name);
          return { name: f.name, url: publicUrl };
        });
        setFlyerList(list);
      }
    } catch (e) {
      // bucket may not be accessible yet
    }
  };

  const handleFlyerUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFlyerError('Please upload an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFlyerError('File must be smaller than 10 MB');
      return;
    }

    setFlyerUploading(true);
    setFlyerError('');

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `flyer_${Date.now()}.${ext}`;

      // Create bucket if needed
      await supabaseAdmin.storage.createBucket(BUCKET, { public: true }).catch(() => {});

      // Upload
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);

      // Save as primary flyer URL in site_content
      await supabaseAdmin.from('site_content').upsert(
        { section: 'workshop', key: 'flyer_url', value: publicUrl, updated_at: new Date().toISOString() },
        { onConflict: 'section,key' }
      );

      // Update local CMS state so workshop page shows new flyer immediately
      setValues(v => ({ ...v, 'workshop:flyer_url': publicUrl }));
      setOriginal(v => ({ ...v, 'workshop:flyer_url': publicUrl }));

      // Refresh flyer list
      await loadFlyerList();
      showToast('✅ Flyer uploaded and set as active!');
    } catch (err: any) {
      setFlyerError(err.message || 'Upload failed. Check Supabase Storage settings.');
    } finally {
      setFlyerUploading(false);
    }
  };

  const handleSetPrimary = async (url: string) => {
    await supabaseAdmin.from('site_content').upsert(
      { section: 'workshop', key: 'flyer_url', value: url, updated_at: new Date().toISOString() },
      { onConflict: 'section,key' }
    );
    setValues(v => ({ ...v, 'workshop:flyer_url': url }));
    setOriginal(v => ({ ...v, 'workshop:flyer_url': url }));
    showToast('✅ Flyer set as active on the website!');
  };

  const handleDeleteFlyer = async (name: string) => {
    if (!confirm('Delete this flyer permanently?')) return;
    await supabaseAdmin.storage.from(BUCKET).remove([name]);
    await loadFlyerList();
    showToast('🗑️ Flyer deleted.');
  };

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

  const handleReset = () => { setValues({ ...original }); };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4500); };

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
    saveBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
    resetBtn: { padding: '10px 16px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer', transition: 'all 0.15s' },
    fieldGroup: { marginBottom: 24 },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 },
    input: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 15, padding: '12px 14px', outline: 'none', transition: 'border-color 0.2s', lineHeight: 1.5 },
    textarea: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical' as const, minHeight: 100, fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.2s' },
    changedDot: { display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#eeb053', marginLeft: 6 },
    divider: { height: 1, background: '#1e1e1e', margin: '20px 0' },
    preview: { marginTop: 8, padding: '10px 12px', background: '#0f0f0f', borderRadius: 8, border: '1px solid #1a1a1a', fontSize: 13, color: '#9ca3af', lineHeight: 1.6 },
    toast: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', maxWidth: 380 },
    skeleton: { background: '#1e1e1e', borderRadius: 8, height: 44, marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' },
    // Flyer styles
    dropZone: (dragging: boolean): React.CSSProperties => ({
      border: `2px dashed ${dragging ? '#9c1c22' : '#2a2a2a'}`,
      borderRadius: 16, padding: '40px 24px', textAlign: 'center',
      background: dragging ? 'rgba(156,28,34,0.05)' : '#0f0f0f',
      cursor: 'pointer', transition: 'all 0.2s', marginBottom: 24,
    }),
    flyerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginTop: 24 },
    flyerCard: { background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden', position: 'relative' as const },
    flyerImg: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' as const, display: 'block' },
    flyerActions: { padding: '10px 12px', display: 'flex', gap: 6 },
    primaryBtn: { flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 },
    deleteBtn: { padding: '7px 10px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#6b7280', fontSize: 11, cursor: 'pointer' },
    activeBadge: { position: 'absolute' as const, top: 8, left: 8, background: '#9c1c22', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 0.5 },
  };

  const FlyerSection = () => (
    <div>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>🖼️ Workshop Flyer</div>
          <div style={S.cardSub}>Upload flyers or event posters. Click "Set Active" to show one on the website.</div>
        </div>
        <button
          style={{ ...S.saveBtn, fontSize: 13, padding: '8px 16px' }}
          onClick={() => fileInputRef.current?.click()}
          disabled={flyerUploading}
        >
          {flyerUploading ? '⏳ Uploading...' : '⬆ Upload Flyer'}
        </button>
      </div>

      {/* Current active flyer preview */}
      {values['workshop:flyer_url'] && (
        <div style={{ marginBottom: 28, padding: 16, background: 'rgba(156,28,34,0.05)', border: '1px solid rgba(156,28,34,0.15)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: '#9c1c22', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            ✅ Currently Active on Website
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img
              src={values['workshop:flyer_url']}
              alt="Active flyer"
              style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8, border: '2px solid rgba(156,28,34,0.4)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, wordBreak: 'break-all' }}>{values['workshop:flyer_url']}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Displayed on the /workshop page. Upload a new flyer below to replace it.</div>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        style={S.dropZone(isDragging)}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFlyerUpload(file);
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🖼️</div>
        <div style={{ color: '#d1d5db', fontWeight: 600, marginBottom: 6 }}>
          {flyerUploading ? 'Uploading...' : 'Drag & drop a flyer here, or click to browse'}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>JPG, PNG, WebP — max 10 MB. Sets as active immediately.</div>
        {flyerError && (
          <div style={{ marginTop: 12, color: '#fca5a5', fontSize: 13, background: 'rgba(239,68,68,0.1)', padding: '8px 14px', borderRadius: 8 }}>
            ⚠️ {flyerError}
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFlyerUpload(f); }}
      />

      {/* Flyer library */}
      {flyerList.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            Uploaded Flyers ({flyerList.length})
          </div>
          <div style={S.flyerGrid}>
            {flyerList.map(flyer => {
              const isActive = values['workshop:flyer_url'] === flyer.url;
              return (
                <div key={flyer.name} style={S.flyerCard}>
                  {isActive && <div style={S.activeBadge}>ACTIVE</div>}
                  <img
                    src={flyer.url}
                    alt={flyer.name}
                    style={S.flyerImg}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                  />
                  <div style={S.flyerActions}>
                    <button
                      style={{ ...S.primaryBtn, opacity: isActive ? 0.5 : 1, cursor: isActive ? 'default' : 'pointer' }}
                      onClick={() => !isActive && handleSetPrimary(flyer.url)}
                      disabled={isActive}
                      title={isActive ? 'Already active' : 'Set as active flyer'}
                    >
                      {isActive ? '✓ Active' : 'Set Active'}
                    </button>
                    <button
                      style={S.deleteBtn}
                      onClick={() => handleDeleteFlyer(flyer.name)}
                      title="Delete flyer"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {flyerList.length === 0 && !flyerUploading && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#4b5563', fontSize: 13 }}>
          No flyers uploaded yet. Upload your first flyer above.
        </div>
      )}
    </div>
  );

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
              {sec !== 'flyer' && FIELDS.filter(f => f.section === sec && values[makeKey(f.section, f.key)] !== original[makeKey(f.section, f.key)]).length > 0 && (
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
          {activeSection === 'flyer' ? (
            <FlyerSection />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
};

export default AdminCMS;
