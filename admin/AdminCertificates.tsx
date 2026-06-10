import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabaseAdmin } from '../supabase';

// ─── Google Fonts for certificate text ───────────────────────────────────────
const GFONTS_LINK = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@400;700&family=Pinyon+Script&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';

const CERT_BUCKET = 'certificates';

interface Template { name: string; url: string; }

interface TextConfig {
  xPercent: number;
  yPercent: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  shadowColor: string;
  shadowBlur: number;
}

const DEFAULT_TEXT: TextConfig = {
  xPercent: 50,
  yPercent: 55,
  fontSize: 52,
  color: '#8B4513',
  fontFamily: 'Great Vibes',
  bold: false,
  italic: false,
  align: 'center',
  shadowColor: 'rgba(0,0,0,0.2)',
  shadowBlur: 4,
};

const FONT_OPTIONS = [
  { label: '🖊 Great Vibes (Script)', value: 'Great Vibes' },
  { label: '✍️ Dancing Script', value: 'Dancing Script' },
  { label: '🌸 Pinyon Script', value: 'Pinyon Script' },
  { label: '🎨 Pacifico', value: 'Pacifico' },
  { label: '📖 Playfair Display', value: 'Playfair Display' },
  { label: '📚 Georgia (Serif)', value: 'Georgia' },
  { label: '🔤 Times New Roman', value: 'Times New Roman' },
  { label: '🔡 Arial', value: 'Arial' },
  { label: '📝 Palatino', value: 'Palatino' },
];

// ─── Generate a certificate PNG as base64 data URL ───────────────────────────
function generateCertificate(
  templateUrl: string,
  recipientName: string,
  config: TextConfig,
  previewWidth?: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      if (previewWidth) {
        const scale = previewWidth / img.width;
        canvas.width = previewWidth;
        canvas.height = Math.round(img.height * scale);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const scaleX = canvas.width / img.width;
      const x = (config.xPercent / 100) * canvas.width;
      const y = (config.yPercent / 100) * canvas.height;
      const scaledSize = Math.round(config.fontSize * scaleX);

      await document.fonts.ready;

      const fontStr = [
        config.italic ? 'italic' : '',
        config.bold ? 'bold' : '',
        `${scaledSize}px`,
        `'${config.fontFamily}', Georgia, serif`,
      ].filter(Boolean).join(' ');

      ctx.font = fontStr;
      ctx.textAlign = config.align as CanvasTextAlign;
      ctx.textBaseline = 'middle';

      if (config.shadowBlur > 0) {
        ctx.shadowColor = config.shadowColor;
        ctx.shadowBlur = config.shadowBlur;
      }

      ctx.fillStyle = config.color;
      ctx.fillText(recipientName, x, y);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load template image. Check CORS settings.'));
    img.src = templateUrl;
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminCertificates: React.FC = () => {
  const [tab, setTab] = useState<'templates' | 'send'>('templates');

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tLoading, setTLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tError, setTError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send state
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [textConfig, setTextConfig] = useState<TextConfig>({ ...DEFAULT_TEXT });
  const [previewName, setPreviewName] = useState('Participant Name');
  const [previewLoading, setPreviewLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Recipients state
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [recipientMode, setRecipientMode] = useState<'all' | 'free' | 'donation' | 'vip'>('all');
  const [manualEmails, setManualEmails] = useState('');

  // Email state
  const [subject, setSubject] = useState('Your Certificate of Participation – Foundation of Luv');
  const [emailBody, setEmailBody] = useState('Dear {name},\n\nPlease find attached your Certificate of Participation from the Foundation of Luv Workshop.\n\nThank you for your dedication and commitment.\n\nWarm regards,\nThe Foundation of Luv Team');

  // Send state
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4500); };

  // ── Load templates ──────────────────────────────────────────────────────────
  const loadTemplates = useCallback(async () => {
    setTLoading(true);
    setTError(null);
    try {
      await supabaseAdmin.storage.createBucket(CERT_BUCKET, { public: true }).catch(() => {});
      const { data, error } = await supabaseAdmin.storage.from(CERT_BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw new Error(error.message);
      const list: Template[] = (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: { publicUrl } } = supabaseAdmin.storage.from(CERT_BUCKET).getPublicUrl(f.name);
          return { name: f.name, url: publicUrl };
        });
      setTemplates(list);
    } catch (err: any) {
      setTError(err.message || 'Failed to load templates.');
    } finally {
      setTLoading(false);
    }
  }, []);

  // ── Load registrations ──────────────────────────────────────────────────────
  useEffect(() => {
    loadTemplates();
    supabaseAdmin.from('workshop_registrations').select('id, full_name, email, ticket_type').order('full_name')
      .then(({ data }) => setRegistrations(data ?? []));

    // Inject Google Fonts
    if (!document.getElementById('cert-gfonts')) {
      const link = document.createElement('link');
      link.id = 'cert-gfonts';
      link.rel = 'stylesheet';
      link.href = GFONTS_LINK;
      document.head.appendChild(link);
    }
  }, [loadTemplates]);

  // ── Upload template ─────────────────────────────────────────────────────────
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setTError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) { showToast(`⚠️ "${file.name}" is not an image. Skipped.`); continue; }
      if (file.size > 25 * 1024 * 1024) { showToast(`⚠️ "${file.name}" exceeds 25 MB. Skipped.`); continue; }
      const safeName = `cert_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await supabaseAdmin.storage.createBucket(CERT_BUCKET, { public: true }).catch(() => {});
      const { error } = await supabaseAdmin.storage.from(CERT_BUCKET).upload(safeName, file, { cacheControl: '3600', upsert: false });
      if (error) { showToast(`❌ Upload failed: ${error.message}`); }
    }
    setUploading(false);
    await loadTemplates();
    showToast('✅ Template(s) uploaded!');
  };

  const handleDeleteTemplate = async (name: string) => {
    if (!confirm('Delete this certificate template permanently?')) return;
    await supabaseAdmin.storage.from(CERT_BUCKET).remove([name]);
    if (selectedTemplate?.name === name) setSelectedTemplate(null);
    await loadTemplates();
    showToast('🗑️ Template deleted.');
  };

  // ── Draw canvas preview ─────────────────────────────────────────────────────
  const drawPreview = useCallback(async () => {
    if (!selectedTemplate || !canvasRef.current) return;
    setPreviewLoading(true);
    try {
      const dataUrl = await generateCertificate(selectedTemplate.url, previewName || 'Participant Name', textConfig, 560);
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const ctx = canvasRef.current.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        setPreviewLoading(false);
      };
      img.src = dataUrl;
    } catch (e: any) {
      setPreviewLoading(false);
      showToast('⚠️ Preview error: ' + e.message);
    }
  }, [selectedTemplate, textConfig, previewName]);

  useEffect(() => {
    if (tab === 'send') drawPreview();
  }, [drawPreview, tab]);

  // ── Get recipients ──────────────────────────────────────────────────────────
  const getRecipients = () => {
    const fromRegs = registrations.filter(r => {
      if (recipientMode === 'all') return true;
      return (r.ticket_type ?? 'free') === recipientMode;
    }).map(r => ({ email: r.email, name: r.full_name || r.email }));

    const fromManual = manualEmails.split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('@') && line.includes(','))
      .map(line => {
        const [email, ...nameParts] = line.split(',');
        return { email: email.trim(), name: nameParts.join(',').trim() };
      });

    const all = [...fromRegs, ...fromManual];
    const seen = new Set<string>();
    return all.filter(r => { if (seen.has(r.email)) return false; seen.add(r.email); return true; });
  };

  const recipients = getRecipients();

  // ── Generate & Send ─────────────────────────────────────────────────────────
  const handleGenerateAndSend = async () => {
    if (!selectedTemplate) { showToast('⚠️ Please select a certificate template.'); return; }
    if (!subject.trim()) { showToast('⚠️ Please enter an email subject.'); return; }
    if (recipients.length === 0) { showToast('⚠️ No recipients found.'); return; }

    setSending(true);
    setProgress({ current: 0, total: recipients.length });

    const certRecipients: { email: string; name: string; certBase64: string }[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      setProgress({ current: i + 1, total: recipients.length });
      try {
        const certBase64 = await generateCertificate(selectedTemplate.url, r.name, textConfig);
        certRecipients.push({ email: r.email, name: r.name, certBase64 });
      } catch (e: any) {
        console.warn('Certificate generation failed for', r.email, e.message);
      }
    }

    if (certRecipients.length === 0) {
      showToast('❌ Could not generate any certificates. Check template CORS settings.');
      setSending(false);
      setProgress(null);
      return;
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'certificate_email',
          payload: {
            recipients: certRecipients,
            subject,
            body: emailBody,
          }
        })
      });

      if (res.ok) {
        showToast(`🎓 ${certRecipients.length} certificate${certRecipients.length !== 1 ? 's' : ''} sent successfully!`);
        // Log to email_logs (best-effort)
        try {
          await supabaseAdmin.from('email_logs').insert({
            recipients: certRecipients.map(r => r.email),
            subject,
            body: `[Certificate Email] ${emailBody.slice(0, 200)}`,
            status: 'sent',
          });
        } catch { /* ignore logging failure */ }
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(`❌ Error: ${err.error || 'Send failed'}`);
      }
    } catch (err: any) {
      showToast('❌ Network error: ' + err.message);
    }

    setSending(false);
    setProgress(null);
  };

  const tc = (field: keyof TextConfig, value: any) => setTextConfig(c => ({ ...c, [field]: value }));

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const S: Record<string, any> = {
    tab: (active: boolean): React.CSSProperties => ({
      padding: '11px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
      background: active ? 'linear-gradient(135deg, #9c1c22, #7a1219)' : 'transparent',
      color: active ? '#fff' : '#6b7280', transition: 'all 0.2s',
    }),
    card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 },
    input: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '10px 14px', outline: 'none', transition: 'border-color 0.2s' },
    select: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '10px 14px', outline: 'none', cursor: 'pointer' },
    sendBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
    toggleBtn: (active: boolean): React.CSSProperties => ({
      padding: '7px 14px', borderRadius: 8, border: `1px solid ${active ? '#9c1c22' : '#2a2a2a'}`,
      background: active ? 'rgba(156,28,34,0.15)' : 'transparent', color: active ? '#fca5a5' : '#6b7280',
      cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
    }),
    dropZone: (drag: boolean): React.CSSProperties => ({
      border: `2px dashed ${drag ? '#9c1c22' : '#2a2a2a'}`, borderRadius: 16, padding: '36px 24px',
      textAlign: 'center', background: drag ? 'rgba(156,28,34,0.05)' : '#0f0f0f',
      cursor: 'pointer', transition: 'all 0.2s', marginBottom: 24,
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
    templateCard: (sel: boolean): React.CSSProperties => ({
      background: '#0f0f0f', border: `2px solid ${sel ? '#9c1c22' : '#1e1e1e'}`,
      borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s',
    }),
    toast: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', maxWidth: 400 },
  };

  // ─── Templates Tab ───────────────────────────────────────────────────────────
  const TemplatesTab = () => (
    <div>
      <div
        style={S.dropZone(isDragging)}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files); }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
        <div style={{ color: '#d1d5db', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
          {uploading ? 'Uploading...' : 'Drag & drop certificate templates here, or click to browse'}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>PNG, JPG, WebP — max 25 MB. Landscape templates work best.</div>
        {!uploading && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, pointerEvents: 'none' }}>
            ⬆ Upload Template
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />

      {tError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#fca5a5', fontSize: 13 }}>
          ⚠️ {tError}
        </div>
      )}

      {tLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#4b5563' }}>⏳ Loading templates...</div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#4b5563' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          No templates uploaded yet. Upload your first certificate template above.
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            {templates.length} Template{templates.length !== 1 ? 's' : ''} Available
          </div>
          <div style={S.grid}>
            {templates.map(t => (
              <div key={t.name} style={S.templateCard(false)}>
                <img src={t.url} alt={t.name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>
                    {t.name.replace(/^cert_\d+_/, '')}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => { setSelectedTemplate(t); setTab('send'); }}
                    >
                      Use Template
                    </button>
                    <button
                      style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 11, cursor: 'pointer' }}
                      onClick={() => handleDeleteTemplate(t.name)}
                    >🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ─── Send Tab ────────────────────────────────────────────────────────────────
  const SendTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>

      {/* Left: Config */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Step 1: Template */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>1</span>
            Select Template
          </div>
          {templates.length === 0 ? (
            <div style={{ fontSize: 13, color: '#4b5563' }}>
              No templates uploaded. Go to the <button onClick={() => setTab('templates')} style={{ color: '#eeb053', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Templates tab</button> to upload one.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
              {templates.map(t => (
                <div
                  key={t.name}
                  onClick={() => setSelectedTemplate(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${selectedTemplate?.name === t.name ? '#9c1c22' : '#1e1e1e'}`, background: selectedTemplate?.name === t.name ? 'rgba(156,28,34,0.1)' : 'transparent', transition: 'all 0.15s' }}
                >
                  <img src={t.url} alt="" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                  <div style={{ fontSize: 13, color: selectedTemplate?.name === t.name ? '#fca5a5' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {t.name.replace(/^cert_\d+_/, '')}
                  </div>
                  {selectedTemplate?.name === t.name && <span style={{ color: '#9c1c22', fontSize: 16, flexShrink: 0 }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Name Text Config */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>2</span>
            Name Text Style
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.label}>Font Family</label>
              <select style={S.select} value={textConfig.fontFamily} onChange={e => tc('fontFamily', e.target.value)}>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Font Size (px)</label>
              <input type="number" style={S.input} value={textConfig.fontSize} min={12} max={200}
                onChange={e => tc('fontSize', parseInt(e.target.value) || 52)} />
            </div>
            <div>
              <label style={S.label}>Text Color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={textConfig.color} onChange={e => tc('color', e.target.value)}
                  style={{ width: 44, height: 40, border: '1px solid #2a2a2a', borderRadius: 8, background: '#1a1a1a', cursor: 'pointer', padding: 2 }} />
                <input style={{ ...S.input, flex: 1, fontFamily: 'monospace', fontSize: 13 }} value={textConfig.color}
                  onChange={e => tc('color', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={S.label}>Text Align</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['left', 'center', 'right'] as const).map(a => (
                  <button key={a} style={S.toggleBtn(textConfig.align === a)} onClick={() => tc('align', a)}>
                    {a === 'left' ? '⬅' : a === 'center' ? '↔' : '➡'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={S.label}>Horizontal Pos (%)</label>
              <input type="range" min={0} max={100} value={textConfig.xPercent} onChange={e => tc('xPercent', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#9c1c22' }} />
              <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>{textConfig.xPercent}%</div>
            </div>
            <div>
              <label style={S.label}>Vertical Pos (%)</label>
              <input type="range" min={0} max={100} value={textConfig.yPercent} onChange={e => tc('yPercent', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#9c1c22' }} />
              <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>{textConfig.yPercent}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={S.toggleBtn(textConfig.bold)} onClick={() => tc('bold', !textConfig.bold)}>
              <strong>B</strong> Bold
            </button>
            <button style={S.toggleBtn(textConfig.italic)} onClick={() => tc('italic', !textConfig.italic)}>
              <em>I</em> Italic
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={S.label}>Shadow Blur</label>
            <input type="range" min={0} max={20} value={textConfig.shadowBlur} onChange={e => tc('shadowBlur', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#9c1c22' }} />
            <div style={{ fontSize: 11, color: '#6b7280' }}>{textConfig.shadowBlur}px blur</div>
          </div>
        </div>

        {/* Step 3: Recipients */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>3</span>
            Recipients
          </div>

          <label style={S.label}>From Workshop Registrations</label>
          <select style={{ ...S.select, marginBottom: 12 }} value={recipientMode} onChange={e => setRecipientMode(e.target.value as any)}>
            <option value="all">All Registrants ({registrations.length})</option>
            <option value="free">Free Ticket ({registrations.filter(r => (r.ticket_type ?? 'free') === 'free').length})</option>
            <option value="donation">Donation Ticket ({registrations.filter(r => r.ticket_type === 'donation').length})</option>
            <option value="vip">VIP Ticket ({registrations.filter(r => r.ticket_type === 'vip').length})</option>
          </select>

          <label style={{ ...S.label, marginTop: 8 }}>Additional Recipients (email, Full Name — one per line)</label>
          <textarea
            style={{ ...S.input, minHeight: 70, resize: 'vertical' as const, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}
            placeholder={'john@example.com, John Smith\njane@example.com, Jane Doe'}
            value={manualEmails}
            onChange={e => setManualEmails(e.target.value)}
          />

          {recipients.length > 0 && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
              ✅ {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} ready
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {recipients.slice(0, 6).map(r => (
                  <span key={r.email} style={{ fontSize: 11, background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 20, padding: '2px 8px', color: '#9ca3af' }}>
                    {r.name}
                  </span>
                ))}
                {recipients.length > 6 && <span style={{ fontSize: 11, color: '#4b5563' }}>+{recipients.length - 6} more</span>}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Email */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>4</span>
            Email Message
          </div>
          <label style={S.label}>Subject</label>
          <input style={{ ...S.input, marginBottom: 12 }} value={subject} onChange={e => setSubject(e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#9c1c22')} onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
          <label style={S.label}>Body</label>
          <textarea style={{ ...S.input, minHeight: 120, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6 }}
            value={emailBody} onChange={e => setEmailBody(e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#9c1c22')} onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>
            Tip: Use <code style={{ color: '#eeb053', background: '#0f0f0f', padding: '1px 5px', borderRadius: 4 }}>{'{name}'}</code> in the body to auto-insert each recipient's name.
          </div>
        </div>

        {/* Send Button */}
        <button
          style={{ ...S.sendBtn, opacity: (sending || recipients.length === 0 || !selectedTemplate) ? 0.6 : 1 }}
          onClick={handleGenerateAndSend}
          disabled={sending || recipients.length === 0 || !selectedTemplate}
        >
          {sending && progress
            ? `⏳ Generating ${progress.current}/${progress.total}...`
            : `🎓 Generate & Send ${recipients.length} Certificate${recipients.length !== 1 ? 's' : ''}`}
        </button>

        {sending && progress && (
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Generating certificates...</div>
            <div style={{ background: '#1e1e1e', borderRadius: 20, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${(progress.current / progress.total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #9c1c22, #eeb053)', borderRadius: 20, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6, textAlign: 'center' }}>
              {progress.current} of {progress.total}
            </div>
          </div>
        )}
      </div>

      {/* Right: Live Preview */}
      <div style={{ position: 'sticky' as const, top: 24 }}>
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>🖼️ Live Preview</div>

          <label style={S.label}>Preview Name</label>
          <input
            style={{ ...S.input, marginBottom: 14, fontFamily: textConfig.fontFamily }}
            value={previewName}
            onChange={e => setPreviewName(e.target.value)}
            placeholder="Type a name to preview..."
            onFocus={e => (e.target.style.borderColor = '#9c1c22')} onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />

          {!selectedTemplate ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0f0f0f', borderRadius: 12, border: '1px dashed #2a2a2a', color: '#4b5563', fontSize: 13 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎓</div>
              Select a template on the left to see a live preview
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {previewLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.7)', borderRadius: 12, zIndex: 2 }}>
                  <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
                    <div style={{ width: 28, height: 28, border: '3px solid #2a2a2a', borderTopColor: '#9c1c22', borderRadius: '50%', animation: 'cspin 0.7s linear infinite', margin: '0 auto 10px' }} />
                    Rendering...
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                style={{ width: '100%', borderRadius: 10, border: '1px solid #2a2a2a', display: 'block' }}
              />
            </div>
          )}

          <button
            style={{ marginTop: 12, width: '100%', padding: '9px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            onClick={drawPreview}
            disabled={!selectedTemplate || previewLoading}
          >
            🔄 Refresh Preview
          </button>

          {selectedTemplate && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(238,176,83,0.05)', border: '1px solid rgba(238,176,83,0.1)', borderRadius: 8, fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
              <strong style={{ color: '#eeb053' }}>ℹ️ What gets sent:</strong> Each recipient receives a personalized PNG certificate with their name rendered at the configured position, attached to the email as <em>Certificate – [Name].png</em>.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <style>{`@keyframes cspin { to { transform: rotate(360deg); } }`}</style>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#111', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        <button style={S.tab(tab === 'templates')} onClick={() => setTab('templates')}>📋 Templates</button>
        <button style={S.tab(tab === 'send')} onClick={() => { setTab('send'); if (templates.length === 0) loadTemplates(); }}>🎓 Send Certificates</button>
      </div>

      {tab === 'templates' ? <TemplatesTab /> : <SendTab />}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
};

export default AdminCertificates;
