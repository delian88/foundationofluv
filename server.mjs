// server.mjs — Local development API server
// Run with: node server.mjs
// This mimics the Vercel serverless function for /api/send-email locally.

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse .env file
const env = {};
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        env[key] = value;
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn('Could not parse .env file:', e.message);
}

// Dynamically import nodemailer (CommonJS style via ESM dynamic import)
const nodemailerMod = await import('nodemailer');
const nodemailer = nodemailerMod.default || nodemailerMod;

const SMTP_HOST = env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(env.SMTP_PORT || '465', 10);
const SMTP_SECURE = env.SMTP_SECURE === 'true';
const SMTP_USER = env.SMTP_USER || '';
const SMTP_PASS = env.SMTP_PASS || '';
const ADMIN_EMAIL = env.ADMIN_EMAIL || 'info@azariahmg.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const defaultHeader = `
<div style="background-color: #9c1c22; padding: 32px; text-align: center; border-bottom: 6px solid #eeb053;">
  <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Foundation of Luv</h1>
  <p style="color: #eeb053; font-family: 'Arial', sans-serif; font-size: 11px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Love in Action, Change in Motion</p>
</div>
`;

const defaultFooter = `
<div style="background-color: #1a1a1a; padding: 24px; text-align: center; margin-top: 40px; border-top: 1px solid #2a2a2a; color: #888888; font-family: 'Arial', sans-serif; font-size: 11px;">
  <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 Foundation of Luv. All Rights Reserved.</p>
  <p style="margin: 4px 0 0 0; color: #eeb053;">#9960 Raven Hurst Road, Middle River MD 21221</p>
  <p style="margin: 8px 0 0 0; font-style: italic; color: #555555;">This email was sent dynamically via the FOL Secure SMTP Portal.</p>
</div>
`;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url !== '/api/send-email' || req.method !== 'POST') {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const { type, payload } = JSON.parse(body);

    if (type === 'registration') {
      const {
        full_name, email, phone, city, organization, job_title, profile,
        interests, cybersecurity_level, financial_level, referral,
        special_requirements, questions, ticket_type, payment_method, payment_reference
      } = payload;

      // Email to applicant
      await transporter.sendMail({
        from: `"Foundation of Luv" <${SMTP_USER}>`,
        to: email,
        subject: 'Registration Confirmed: Cybersecurity & Financial Literacy Workshop',
        html: `
          <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e1e1e1;border-radius:12px;overflow:hidden;">
            ${defaultHeader}
            <div style="padding:40px 32px;font-family:Arial,sans-serif;line-height:1.6;color:#333;">
              <h2 style="font-family:Georgia,serif;font-size:20px;color:#111;margin-top:0;">Hello ${full_name},</h2>
              <p>Thank you for registering for the upcoming <strong>Cybersecurity &amp; Financial Literacy Workshop</strong>. Your application has been received.</p>
              <div style="background:#fcfaf6;border-left:4px solid #eeb053;padding:20px;border-radius:4px;margin:24px 0;">
                <h3 style="margin-top:0;font-family:Georgia,serif;color:#9c1c22;">Event Details</h3>
                <table style="width:100%;font-size:14px;">
                  <tr><td style="padding:6px 0;font-weight:bold;width:100px;">Date:</td><td>Saturday, July 18, 2026</td></tr>
                  <tr><td style="padding:6px 0;font-weight:bold;">Time:</td><td>10:00 AM - 3:00 PM EST</td></tr>
                  <tr><td style="padding:6px 0;font-weight:bold;">Ticket:</td><td style="color:#9c1c22;font-weight:bold;">${ticket_type === 'vip' ? 'VIP Ticket (with Certification)' : 'General Admission (Free)'}</td></tr>
                </table>
              </div>
              <p>If you have any questions, contact us at <a href="mailto:${ADMIN_EMAIL}" style="color:#9c1c22;">${ADMIN_EMAIL}</a>.</p>
              <p style="margin-top:36px;"><strong>Warm regards,</strong><br/><em style="font-family:Georgia,serif;color:#9c1c22;">The Foundation of Luv Team</em></p>
            </div>
            ${defaultFooter}
          </div>
        `,
      });

      // Notification to admin
      await transporter.sendMail({
        from: `"Foundation of Luv System" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `New Workshop Registration: ${full_name} (${(ticket_type || '').toUpperCase()})`,
        html: `
          <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e1e1e1;border-radius:12px;overflow:hidden;">
            ${defaultHeader}
            <div style="padding:40px 32px;font-family:Arial,sans-serif;line-height:1.6;">
              <h2 style="font-family:Georgia,serif;color:#9c1c22;margin-top:0;">New Registration</h2>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;width:150px;">Name</td><td style="padding:10px;">${full_name}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;">Email</td><td style="padding:10px;"><a href="mailto:${email}" style="color:#9c1c22;">${email}</a></td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;">Phone</td><td style="padding:10px;">${phone}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;">City</td><td style="padding:10px;">${city || 'N/A'}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;">Ticket</td><td style="padding:10px;color:#9c1c22;font-weight:bold;">${ticket_type}</td></tr>
                ${ticket_type === 'vip' ? `<tr><td style="padding:10px;font-weight:bold;">Payment Ref</td><td style="padding:10px;font-family:monospace;">${payment_reference}</td></tr>` : ''}
              </table>
            </div>
            ${defaultFooter}
          </div>
        `,
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Registration emails sent' }));
      return;
    }

    if (type === 'login_alert') {
      const { email, time, userAgent, ip } = payload;
      await transporter.sendMail({
        from: `"Foundation of Luv Security" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: 'Security Alert: Admin Dashboard Login',
        html: `
          <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e1e1e1;border-radius:12px;overflow:hidden;">
            <div style="background:#dc2626;padding:24px;text-align:center;border-bottom:4px solid #eeb053;">
              <h1 style="color:#fff;font-family:Georgia,serif;font-size:20px;margin:0;">⚠️ SECURITY ALERT</h1>
            </div>
            <div style="padding:40px 32px;font-family:Arial,sans-serif;line-height:1.6;color:#333;">
              <h2 style="font-family:Georgia,serif;color:#111;margin-top:0;">Admin Login Detected</h2>
              <div style="background:#fcf8f8;border:1px solid #fca5a5;padding:20px;border-radius:8px;">
                <table style="width:100%;font-size:13px;">
                  <tr><td style="padding:6px 0;font-weight:bold;color:#7f1d1d;width:140px;">Account:</td><td>${email}</td></tr>
                  <tr><td style="padding:6px 0;font-weight:bold;color:#7f1d1d;">Time:</td><td>${time}</td></tr>
                  <tr><td style="padding:6px 0;font-weight:bold;color:#7f1d1d;">IP:</td><td style="font-family:monospace;">${ip || 'Unknown'}</td></tr>
                  <tr><td style="padding:6px 0;font-weight:bold;color:#7f1d1d;">Browser:</td><td style="font-size:12px;color:#666;">${userAgent}</td></tr>
                </table>
              </div>
              <p style="margin-top:24px;font-size:13px;color:#666;">If this was not you, reset your password immediately in the Supabase Auth console.</p>
            </div>
            ${defaultFooter}
          </div>
        `,
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Login alert sent' }));
      return;
    }

    if (type === 'admin_email') {
      const { recipients, subject, body: emailBody } = payload;
      if (!Array.isArray(recipients) || recipients.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Recipients must be a non-empty array' }));
        return;
      }
      await Promise.all(recipients.map(to =>
        transporter.sendMail({
          from: `"Foundation of Luv" <${SMTP_USER}>`,
          to,
          subject,
          html: `
            <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e1e1e1;border-radius:12px;overflow:hidden;">
              ${defaultHeader}
              <div style="padding:40px 32px;font-family:Arial,sans-serif;line-height:1.6;color:#333;font-size:15px;">
                ${emailBody.replace(/\n/g, '<br />')}
              </div>
              ${defaultFooter}
            </div>
          `,
        })
      ));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Sent ${recipients.length} email(s)` }));
      return;
    }

    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unsupported type' }));

  } catch (err) {
    console.error('Email server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal error', details: err.message }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ FOL Local Email API running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/send-email`);
  console.log(`   SMTP: ${SMTP_HOST}:${SMTP_PORT} (${SMTP_USER})`);
  console.log(`   Admin: ${ADMIN_EMAIL}`);
});
