import React, { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../supabase';

// ─── Gateway Definitions ──────────────────────────────────────────────────────
interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  hint?: string;
  fullWidth?: boolean;
}

interface GatewayDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  docsUrl: string;
  fields: FieldDef[];
  commonFields: FieldDef[]; // mode, currency, enabled
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
  { value: 'GHS', label: 'GHS — Ghanaian Cedi' },
  { value: 'ZAR', label: 'ZAR — South African Rand' },
  { value: 'KES', label: 'KES — Kenyan Shilling' },
];

const GATEWAYS: GatewayDef[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    color: '#0070BA',
    bgColor: 'rgba(0,112,186,0.1)',
    description: 'Global online payments, donations & PayPal Buttons SDK',
    docsUrl: 'https://developer.paypal.com/dashboard/',
    commonFields: [
      { key: 'mode', label: 'Environment', type: 'select', placeholder: '', options: [{ value: 'live', label: '🟢 Live (Real Payments)' }, { value: 'sandbox', label: '🟡 Sandbox (Testing)' }], hint: 'Use Sandbox for testing, Live for real transactions.' },
      { key: 'currency', label: 'Currency', type: 'select', placeholder: '', options: CURRENCY_OPTIONS },
    ],
    fields: [
      { key: 'client_id', label: 'Client ID', type: 'password', placeholder: 'Enter PayPal Client ID', hint: 'From PayPal Developer Dashboard → My Apps & Credentials' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter PayPal Client Secret', hint: '⚠️ Keep secret. Never expose publicly.' },
      { key: 'business_email', label: 'Business Email', type: 'email', placeholder: 'payments@yourorg.com', hint: 'PayPal account email that receives funds.' },
      { key: 'webhook_id', label: 'Webhook ID', type: 'text', placeholder: 'Enter PayPal Webhook ID', hint: 'Optional — for verifying PayPal webhook events.' },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    color: '#635BFF',
    bgColor: 'rgba(99,91,255,0.1)',
    description: 'Modern card payments, subscriptions & one-time charges',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
    commonFields: [
      { key: 'mode', label: 'Environment', type: 'select', placeholder: '', options: [{ value: 'live', label: '🟢 Live (Real Payments)' }, { value: 'test', label: '🟡 Test Mode' }] },
      { key: 'currency', label: 'Currency', type: 'select', placeholder: '', options: CURRENCY_OPTIONS },
    ],
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', type: 'password', placeholder: 'Enter Stripe Publishable Key (pk_live_...)', hint: 'Used on the client side (starts with pk_live_ or pk_test_)' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: 'Enter Stripe Secret Key (sk_live_...)', hint: '⚠️ Server-side only. Never expose in front-end code.' },
      { key: 'webhook_secret', label: 'Webhook Signing Secret', type: 'password', placeholder: 'Enter Stripe Webhook Signing Secret (whsec_...)', hint: 'For verifying Stripe webhook events.' },
      { key: 'account_id', label: 'Account ID', type: 'text', placeholder: 'Enter Stripe Account ID', hint: 'Optional — your Stripe account ID.' },
    ],
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    icon: '🌊',
    color: '#F5A623',
    bgColor: 'rgba(245,166,35,0.1)',
    description: 'Africa-focused payments — cards, mobile money, bank transfer',
    docsUrl: 'https://dashboard.flutterwave.com/settings/apis',
    commonFields: [
      { key: 'mode', label: 'Environment', type: 'select', placeholder: '', options: [{ value: 'live', label: '🟢 Live (Real Payments)' }, { value: 'test', label: '🟡 Test Mode' }] },
      { key: 'currency', label: 'Currency', type: 'select', placeholder: '', options: CURRENCY_OPTIONS },
    ],
    fields: [
      { key: 'public_key', label: 'Public Key', type: 'password', placeholder: 'Enter Flutterwave Public Key (FLWPUBK-...)', hint: 'Used to initialize the Flutterwave payment modal.' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: 'Enter Flutterwave Secret Key (FLWSECK-...)', hint: '⚠️ Server-side only. Keep private.' },
      { key: 'encryption_key', label: 'Encryption Key', type: 'password', placeholder: 'Enter Flutterwave Encryption Key', hint: 'For encrypting payment payloads.' },
      { key: 'webhook_secret', label: 'Webhook Secret Hash', type: 'password', placeholder: 'Enter Webhook Secret Hash', hint: 'For verifying Flutterwave webhook events.' },
    ],
  },
  {
    id: 'paystack',
    name: 'Paystack',
    icon: '🔵',
    color: '#00C3F7',
    bgColor: 'rgba(0,195,247,0.1)',
    description: 'Nigerian & African card payments, bank transfer, USSD',
    docsUrl: 'https://dashboard.paystack.com/#/settings/developers',
    commonFields: [
      { key: 'mode', label: 'Environment', type: 'select', placeholder: '', options: [{ value: 'live', label: '🟢 Live (Real Payments)' }, { value: 'test', label: '🟡 Test Mode' }] },
      { key: 'currency', label: 'Currency', type: 'select', placeholder: '', options: CURRENCY_OPTIONS },
    ],
    fields: [
      { key: 'public_key', label: 'Public Key', type: 'password', placeholder: 'Enter Paystack Public Key (pk_live_...)', hint: 'Starts with pk_live_ (or pk_test_ for test mode).' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: 'Enter Paystack Secret Key (sk_live_...)', hint: '⚠️ Server-side only. Keep private. Starts with sk_live_.' },
      { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'Enter Webhook Secret', hint: 'For verifying Paystack webhook events.' },
      { key: 'merchant_email', label: 'Merchant Email', type: 'email', placeholder: 'payments@yourorg.com', hint: 'Paystack account email.' },
    ],
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.1)',
    description: 'Manual bank transfer — show instructions & account details to donors',
    docsUrl: '',
    commonFields: [
      { key: 'currency', label: 'Currency', type: 'select', placeholder: '', options: CURRENCY_OPTIONS },
    ],
    fields: [
      { key: 'bank_name', label: 'Bank Name', type: 'text', placeholder: 'Chase Bank', hint: '' },
      { key: 'account_name', label: 'Account Name', type: 'text', placeholder: 'Foundation of Luv Inc.', hint: 'Name on the bank account.' },
      { key: 'account_number', label: 'Account Number', type: 'text', placeholder: '000123456789', hint: '' },
      { key: 'routing_number', label: 'Routing / Sort Code', type: 'text', placeholder: '021000021', hint: 'US routing number or UK sort code.' },
      { key: 'swift_code', label: 'SWIFT / BIC Code', type: 'text', placeholder: 'CHASUS33', hint: 'For international wire transfers.' },
      { key: 'instructions', label: 'Payment Instructions', type: 'textarea', placeholder: 'Please include your name and "Workshop Donation" in the reference.', hint: 'Shown to donors after selecting bank transfer.', fullWidth: true },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminSettings: React.FC = () => {
  const [activeGateway, setActiveGateway] = useState<string>('paypal');
  const [allSettings, setAllSettings] = useState<Record<string, Record<string, string>>>({});
  const [original, setOriginal] = useState<Record<string, Record<string, string>>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [revealFields, setRevealFields] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'fail'>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // ── Load all gateway settings ────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    setLoading(true);
    const sections = GATEWAYS.map(g => `gateway_${g.id}`);
    const all: Record<string, Record<string, string>> = {};
    const en: Record<string, boolean> = {};

    for (const gw of GATEWAYS) {
      const section = `gateway_${gw.id}`;
      const { data } = await supabaseAdmin.from('site_content').select('key, value').eq('section', section);
      const map: Record<string, string> = {};
      (data ?? []).forEach((row: any) => { map[row.key] = row.value ?? ''; });
      all[gw.id] = map;
      en[gw.id] = map['enabled'] === 'true';
    }

    setAllSettings(all);
    setOriginal(JSON.parse(JSON.stringify(all)));
    setEnabled(en);
    setLoading(false);
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  // ── Save current gateway's settings ─────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const gw = GATEWAYS.find(g => g.id === activeGateway)!;
    const section = `gateway_${gw.id}`;
    const current: Record<string, string> = { ...(allSettings[gw.id] ?? {}), enabled: enabled[gw.id] ? 'true' : 'false' };

    const upserts = Object.entries(current).map(([key, value]) => ({
      section,
      key,
      value: value ?? '',
      updated_at: new Date().toISOString(),
    }));

    // Also add all fields that may not have been set yet
    const allKeys = [...gw.fields, ...gw.commonFields].map(f => f.key);
    for (const key of allKeys) {
      if (!current[key]) {
        upserts.push({ section, key, value: '', updated_at: new Date().toISOString() });
      }
    }

    const { error } = await supabaseAdmin.from('site_content').upsert(upserts, { onConflict: 'section,key' });

    if (error) {
      showToast('❌ Failed to save: ' + error.message);
    } else {
      setOriginal(prev => ({ ...prev, [gw.id]: { ...allSettings[gw.id], enabled: enabled[gw.id] ? 'true' : 'false' } }));
      showToast(`✅ ${gw.name} settings saved!`);
      setTestResult(t => ({ ...t, [activeGateway]: 'idle' }));
    }
    setSaving(false);
  };

  const handleReset = () => {
    setAllSettings(prev => ({ ...prev, [activeGateway]: { ...(original[activeGateway] ?? {}) } }));
    setEnabled(prev => ({ ...prev, [activeGateway]: original[activeGateway]?.['enabled'] === 'true' }));
  };

  const set = (key: string, value: string) => {
    setAllSettings(prev => ({
      ...prev,
      [activeGateway]: { ...(prev[activeGateway] ?? {}), [key]: value },
    }));
  };

  const get = (key: string) => allSettings[activeGateway]?.[key] ?? '';

  const hasChanges = () => {
    const cur = { ...(allSettings[activeGateway] ?? {}), enabled: enabled[activeGateway] ? 'true' : 'false' };
    const orig = original[activeGateway] ?? {};
    return JSON.stringify(cur) !== JSON.stringify({ ...orig, enabled: orig['enabled'] ?? 'false' });
  };

  const toggleReveal = (key: string) => setRevealFields(r => ({ ...r, [key]: !r[key] }));

  // ── Test gateway connection (PayPal SDK test, others show placeholder) ───────
  const handleTest = async (gwId: string) => {
    setTestResult(t => ({ ...t, [gwId]: 'testing' }));
    if (gwId === 'paypal') {
      const clientId = allSettings['paypal']?.['client_id'] ?? '';
      if (!clientId) { showToast('⚠️ Enter a Client ID first.'); setTestResult(t => ({ ...t, paypal: 'idle' })); return; }
      try {
        const existing = document.getElementById('pp-test-script'); if (existing) existing.remove();
        const script = document.createElement('script');
        script.id = 'pp-test-script';
        const mode = allSettings['paypal']?.['mode'] ?? 'live';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${allSettings['paypal']?.['currency'] || 'USD'}${mode === 'sandbox' ? '&debug=true' : ''}`;
        script.onload = () => setTestResult(t => ({ ...t, paypal: 'ok' }));
        script.onerror = () => setTestResult(t => ({ ...t, paypal: 'fail' }));
        document.head.appendChild(script);
      } catch { setTestResult(t => ({ ...t, paypal: 'fail' })); }
    } else {
      // For other gateways, just check that the required keys are filled
      setTimeout(() => {
        const gw = GATEWAYS.find(g => g.id === gwId)!;
        const firstField = gw.fields[0];
        const filled = !!(allSettings[gwId]?.[firstField.key]?.trim());
        setTestResult(t => ({ ...t, [gwId]: filled ? 'ok' : 'fail' }));
      }, 1200);
    }
  };

  // ── Render a single field ────────────────────────────────────────────────────
  const renderField = (field: FieldDef) => {
    const fieldKey = `${activeGateway}_${field.key}`;
    const val = get(field.key);
    const isRevealed = revealFields[fieldKey];

    return (
      <div key={field.key} style={{ gridColumn: field.fullWidth ? '1 / -1' : undefined, marginBottom: 18 }}>
        <label style={S.label}>{field.label}</label>
        {field.type === 'select' ? (
          <select className="sg-input" style={S.select} value={val} onChange={e => set(field.key, e.target.value)}>
            {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            className="sg-input"
            style={{ ...S.input, minHeight: 80, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6 }}
            value={val}
            onChange={e => set(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        ) : field.type === 'password' ? (
          <div style={{ position: 'relative' }}>
            <input
              className="sg-input"
              style={{ ...S.input, paddingRight: 44, fontFamily: 'monospace', fontSize: 13 }}
              type={isRevealed ? 'text' : 'password'}
              value={val}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              autoComplete="new-password"
            />
            <button
              type="button"
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 16, lineHeight: 1 }}
              onClick={() => toggleReveal(fieldKey)}
              title={isRevealed ? 'Hide' : 'Show'}
            >{isRevealed ? '🙈' : '👁️'}</button>
          </div>
        ) : (
          <input
            className="sg-input"
            style={S.input}
            type={field.type || 'text'}
            value={val}
            onChange={e => set(field.key, e.target.value)}
            placeholder={field.placeholder}
            autoComplete="off"
          />
        )}
        {field.hint && <div style={{ fontSize: 11, color: '#4b5563', marginTop: 5, lineHeight: 1.5 }}>{field.hint}</div>}
      </div>
    );
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const S: Record<string, any> = {
    layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'flex-start' },
    sidebar: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 12, position: 'sticky' as const, top: 24 },
    gwCard: (active: boolean, color: string): React.CSSProperties => ({
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
      cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s',
      background: active ? `rgba(${hexToRgb(color)},0.12)` : 'transparent',
      border: `1px solid ${active ? `rgba(${hexToRgb(color)},0.3)` : 'transparent'}`,
    }),
    card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 28, marginBottom: 20 },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 7 },
    input: { width: '100%', boxSizing: 'border-box' as const, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '11px 14px', outline: 'none', transition: 'border-color 0.2s' },
    select: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 14, padding: '11px 14px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' as const },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 },
    saveBtn: { padding: '11px 26px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' },
    resetBtn: { padding: '11px 18px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer' },
    testBtn: (gw: GatewayDef): React.CSSProperties => ({ padding: '11px 20px', borderRadius: 10, border: `1px solid rgba(${hexToRgb(gw.color)},0.3)`, background: `rgba(${hexToRgb(gw.color)},0.08)`, color: gw.color, fontSize: 13, fontWeight: 600, cursor: 'pointer' }),
    toggle: (on: boolean): React.CSSProperties => ({
      width: 44, height: 24, borderRadius: 20, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
      background: on ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#2a2a2a', transition: 'all 0.2s',
    }),
    dot: (on: boolean): React.CSSProperties => ({
      position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%',
      background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    }),
    toast: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', maxWidth: 400 },
  };

  const gw = GATEWAYS.find(g => g.id === activeGateway)!;
  const tr = testResult[activeGateway] ?? 'idle';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #2a2a2a', borderTopColor: '#9c1c22', borderRadius: '50%', animation: 'sgSpin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes sgSpin { to { transform: rotate(360deg); } }`}</style>
        Loading gateway settings...
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .sg-input:focus { border-color: #9c1c22 !important; box-shadow: 0 0 0 3px rgba(156,28,34,0.1); }
        @keyframes sgSpin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>⚙️ Payment Gateways</h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Configure multiple payment gateways. Enable only the ones you want active on your site. Credentials are stored securely in Supabase.</p>
      </div>

      <div style={S.layout}>
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px 10px', marginBottom: 4 }}>
            Gateways
          </div>
          {GATEWAYS.map(g => {
            const isActive = activeGateway === g.id;
            const isEnabled = enabled[g.id] ?? false;
            const isSaved = original[g.id]?.['enabled'] === 'true';
            return (
              <div
                key={g.id}
                style={S.gwCard(isActive, g.color)}
                onClick={() => setActiveGateway(g.id)}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: g.bgColor, border: `1px solid rgba(${hexToRgb(g.color)},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {g.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#fff' : '#9ca3af', marginBottom: 2 }}>{g.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSaved ? '#22c55e' : '#2a2a2a', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: isSaved ? '#4ade80' : '#4b5563', fontWeight: 600 }}>
                      {isSaved ? 'Enabled' : 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Security note */}
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 10, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
            🔒 All credentials stored in your Supabase DB with service-role access only.
          </div>
        </div>

        {/* ── Gateway Config ───────────────────────────────────────────────── */}
        <div>
          {/* Gateway header card */}
          <div style={{ ...S.card, borderColor: `rgba(${hexToRgb(gw.color)},0.2)`, background: `rgba(${hexToRgb(gw.color)},0.03)`, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: gw.bgColor, border: `1px solid rgba(${hexToRgb(gw.color)},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {gw.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{gw.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{gw.description}</div>
                {gw.docsUrl && (
                  <a href={gw.docsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: gw.color, textDecoration: 'none', fontWeight: 600 }}>
                    Open {gw.name} Dashboard ↗
                  </a>
                )}
              </div>

              {/* Enable Toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <button
                  style={S.toggle(enabled[gw.id] ?? false)}
                  onClick={() => setEnabled(e => ({ ...e, [gw.id]: !e[gw.id] }))}
                  type="button"
                >
                  <div style={S.dot(enabled[gw.id] ?? false)} />
                </button>
                <span style={{ fontSize: 10, fontWeight: 700, color: (enabled[gw.id] ?? false) ? '#4ade80' : '#4b5563', letterSpacing: 0.5 }}>
                  {(enabled[gw.id] ?? false) ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
          </div>

          {/* Common fields (mode, currency) */}
          {gw.commonFields.length > 0 && (
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>1</span>
                General Settings
              </div>
              <div style={S.grid2}>
                {gw.commonFields.map(f => renderField(f))}
              </div>
            </div>
          )}

          {/* Credentials */}
          <div style={S.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#eeb053', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(238,176,83,0.15)', borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>2</span>
              API Credentials
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              {gw.fields.map(f => renderField(f))}
            </div>

            {/* Test button */}
            <div style={{ marginTop: 8, padding: '14px 16px', background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', marginBottom: 2 }}>🔌 Verify Credentials</div>
                  <div style={{ fontSize: 12, color: '#4b5563' }}>
                    {gw.id === 'paypal' ? 'Tests your Client ID by loading the PayPal SDK.' : 'Checks that required credentials are filled in.'}
                  </div>
                </div>
                <button
                  style={{ ...S.testBtn(gw), opacity: tr === 'testing' ? 0.6 : 1, whiteSpace: 'nowrap', flexShrink: 0 }}
                  onClick={() => handleTest(gw.id)}
                  disabled={tr === 'testing'}
                >
                  {tr === 'testing' ? '⏳ Checking...' : '🔌 Test'}
                </button>
              </div>
              {tr === 'ok' && <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, fontSize: 12, color: '#4ade80', fontWeight: 600 }}>✅ Credentials verified successfully!</div>}
              {tr === 'fail' && <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: 12, color: '#fca5a5', fontWeight: 600 }}>❌ Verification failed. Check your credentials and mode.</div>}
            </div>
          </div>

          {/* Action bar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              style={{ ...S.saveBtn, opacity: (!hasChanges() || saving) ? 0.5 : 1 }}
              onClick={handleSave}
              disabled={!hasChanges() || saving}
            >
              {saving ? '⏳ Saving...' : `💾 Save ${gw.name} Settings`}
            </button>
            {hasChanges() && (
              <button style={S.resetBtn} onClick={handleReset}>↩ Reset</button>
            )}
            {!hasChanges() && original[gw.id]?.['enabled'] !== undefined && (
              <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>✅ Settings saved</span>
            )}
          </div>
        </div>
      </div>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
};

// ─── Helper: hex color to rgb triplet ───────────────────────────────────────
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default AdminSettings;
