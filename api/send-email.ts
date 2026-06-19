import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to resolve environment variables locally or in Vercel
const getEnv = (key: string): string => {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const parts = line.split('=');
        if (parts.length >= 2 && parts[0].trim() === key) {
          return parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
  } catch (e) {
    // Ignore
  }
  return '';
};

// Create a nodemailer transporter using SMTP settings
const createTransporter = () => {
  const host = getEnv('SMTP_HOST') || 'smtp.gmail.com';
  const port = parseInt(getEnv('SMTP_PORT') || '465', 10);
  const secure = getEnv('SMTP_SECURE') === 'true';
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const defaultHeader = `
<div style="background-color: #9c1c22; padding: 32px; text-align: center; border-bottom: 6px solid #eeb053;">
  <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Foundation of Luv</h1>
  <p style="color: #eeb053; font-family: 'Arial', sans-serif; font-size: 11px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Love in Action, Change in Motion</p>
</div>
`;

const defaultFooter = `
<div style="background-color: #1a1a1a; padding: 24px; text-align: center; margin-top: 40px; border-top: 1px solid #2a2a2a; color: #888888; font-family: 'Arial', sans-serif; font-size: 11px;">
  <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 Foundation of Luv. All Rights Reserved.</p>
  <p style="margin: 8px 0 0 0; font-style: italic; color: #555555;">This email was sent dynamically via the FOL Secure SMTP Portal.</p>
</div>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  const transporter = createTransporter();
  const fromName = 'Foundation of Luv';
  const fromEmail = getEnv('SMTP_USER') || 'podoremetropolis@gmail.com';
  const adminEmail = getEnv('ADMIN_EMAIL') || 'info@azariahmg.com';

  try {
    if (type === 'registration') {
      const {
        full_name,
        email,
        phone,
        city,
        organization,
        job_title,
        sex,
        age_group,
        profile,
        interests,
        cybersecurity_level,
        financial_level,
        referral,
        special_requirements,
        questions,
        ticket_type,
        payment_method,
        payment_reference,
      } = payload;

      // 1. Send confirmation to applicant
      const applicantMailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject: 'Registration Confirmed: Cybersecurity & Financial Literacy Workshop',
        html: `
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            ${defaultHeader}
            <div style="padding: 40px 32px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333;">
              <h2 style="font-family: 'Georgia', serif; font-size: 20px; color: #111111; margin-top: 0; text-transform: uppercase;">Hello ${full_name},</h2>
              <p style="font-size: 15px; margin-bottom: 24px;">Thank you for registering for the upcoming <strong>Cybersecurity & Financial Literacy Workshop</strong>. Your application has been successfully received and registered in our database.</p>
              
              <div style="background-color: #fcfaf6; border-left: 4px solid #eeb053; padding: 20px; border-radius: 4px; margin-bottom: 28px;">
                <h3 style="margin-top: 0; font-family: 'Georgia', serif; font-size: 16px; color: #9c1c22; text-transform: uppercase;">Event Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 100px;">Date:</td>
                    <td style="padding: 6px 0;">Saturday, July 18, 2026</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Time:</td>
                    <td style="padding: 6px 0;">10:00 AM - 3:00 PM EST</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Location:</td>
                    <td style="padding: 6px 0;">Online (Zoom Link Sent Prior to Event)</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Ticket Type:</td>
                    <td style="padding: 6px 0; text-transform: uppercase; color: #9c1c22; font-weight: bold;">${ticket_type === 'donation' ? 'Donation' : ticket_type === 'vip' ? 'VIP Ticket (with Certification)' : 'General Admission (Free)'}</td>
                  </tr>
                </table>
              </div>

              ${ticket_type === 'vip' ? `
                <div style="background-color: #f4e8e9; border: 1px solid #d4a3a6; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                  <h4 style="margin-top: 0; font-family: 'Georgia', serif; color: #9c1c22; text-transform: uppercase;">VIP Registration Note</h4>
                  <p style="margin: 0; font-size: 14px; color: #555555;">Since you selected a VIP Ticket, we will verify your payment details shortly. Your VIP package includes an official Certificate of Completion, 1-on-1 coaching session, and permanent access to recorded video sessions.</p>
                </div>
              ` : ''}

              ${ticket_type === 'donation' ? `
                <div style="background-color: #fcfaf6; border: 1px solid #eeb053; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                  <h4 style="margin-top: 0; font-family: 'Georgia', serif; color: #9c1c22; text-transform: uppercase;">Thank you for your donation!</h4>
                  <p style="margin: 0; font-size: 14px; color: #555555;">Your kind donation (${payment_reference}) helps keep our workshops and certification free of charge for future batches. We will verify your transaction shortly.</p>
                </div>
              ` : ''}

              <p style="font-size: 15px; margin-bottom: 0;">If you have any questions or require special accommodations in the meantime, please do not hesitate to contact us at <a href="mailto:${adminEmail}" style="color: #9c1c22; text-decoration: none; font-weight: bold;">${adminEmail}</a>.</p>
              
              <div style="margin-top: 36px;">
                <p style="margin: 0; font-size: 14px; font-weight: bold;">Warm regards,</p>
                <p style="margin: 4px 0 0 0; font-family: 'Georgia', serif; font-size: 15px; color: #9c1c22; font-style: italic;">The Foundation of Luv Team</p>
              </div>
            </div>
            ${defaultFooter}
          </div>
        `,
      };
      await transporter.sendMail(applicantMailOptions);

      // 2. Send notification to admin
      const adminMailOptions = {
        from: `"${fromName} System" <${fromEmail}>`,
        to: adminEmail,
        subject: `New Workshop Registration: ${full_name} (${ticket_type.toUpperCase()})`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
            ${defaultHeader}
            <div style="padding: 40px 32px; font-family: 'Arial', sans-serif; line-height: 1.6;">
              <h2 style="font-family: 'Georgia', serif; font-size: 20px; color: #9c1c22; margin-top: 0; text-transform: uppercase;">New Registration Logged</h2>
              <p style="font-size: 14px; color: #666666;">A new participant has signed up for the Cybersecurity & Financial Literacy Workshop. Details are listed below:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold; width: 150px;">Full Name</td>
                  <td style="padding: 10px;">${full_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Email</td>
                  <td style="padding: 10px;"><a href="mailto:${email}" style="color: #9c1c22;">${email}</a></td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Phone</td>
                  <td style="padding: 10px;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">City/Town</td>
                  <td style="padding: 10px;">${city || 'Not specified'}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Organization</td>
                  <td style="padding: 10px;">${organization || 'None'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Job Title</td>
                  <td style="padding: 10px;">${job_title || 'None'}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Sex</td>
                  <td style="padding: 10px;">${sex || 'Not specified'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Age Group</td>
                  <td style="padding: 10px;">${age_group || 'Not specified'}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Profile</td>
                  <td style="padding: 10px;">${profile}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Interests</td>
                  <td style="padding: 10px;">${Array.isArray(interests) ? interests.join(', ') : interests || 'None'}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Cybersecurity Level</td>
                  <td style="padding: 10px;">${cybersecurity_level}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Financial Level</td>
                  <td style="padding: 10px;">${financial_level}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Referral Source</td>
                  <td style="padding: 10px;">${referral || 'Not specified'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Special Needs</td>
                  <td style="padding: 10px;">${special_requirements || 'None'}</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Questions</td>
                  <td style="padding: 10px;">${questions || 'None'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Ticket Type</td>
                  <td style="padding: 10px; text-transform: uppercase; font-weight: bold; color: #9c1c22;">${ticket_type}</td>
                </tr>
                 ${ticket_type === 'vip' || ticket_type === 'donation' ? `
                  <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 10px; font-weight: bold;">Payment Method</td>
                    <td style="padding: 10px;">${payment_method}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 10px; font-weight: bold;">Payment Ref # / Amount</td>
                    <td style="padding: 10px; font-family: monospace;">${payment_reference}</td>
                  </tr>
                ` : ''}
              </table>
            </div>
            ${defaultFooter}
          </div>
        `,
      };
      await transporter.sendMail(adminMailOptions);

      return res.status(200).json({ success: true, message: 'Registration email sent successfully' });
    }

    if (type === 'login_alert') {
      const { email, time, userAgent, ip } = payload;

      const alertMailOptions = {
        from: `"${fromName} Security" <${fromEmail}>`,
        to: adminEmail,
        subject: 'Security Alert: Admin Dashboard Login',
        html: `
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);">
            <div style="background-color: #dc2626; padding: 24px; text-align: center; border-bottom: 4px solid #eeb053;">
              <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">⚠️ SECURITY ALERT</h1>
            </div>
            <div style="padding: 40px 32px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333;">
              <h2 style="font-family: 'Georgia', serif; font-size: 18px; color: #111111; margin-top: 0; text-transform: uppercase;">Admin Login Detected</h2>
              <p style="font-size: 14px; margin-bottom: 24px;">An administrative login was completed successfully for the portal. Please review the connection audit details below to ensure this access was authorized:</p>
              
              <div style="background-color: #fcf8f8; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                <table style="width: 100%; font-size: 13px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #7f1d1d;">Account Email:</td>
                    <td style="padding: 6px 0; font-weight: bold;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">Timestamp:</td>
                    <td style="padding: 6px 0;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">IP Address:</td>
                    <td style="padding: 6px 0; font-family: monospace;">${ip || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">Browser Agent:</td>
                    <td style="padding: 6px 0; font-size: 12px; color: #666666;">${userAgent}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; color: #666666; margin: 0;">If this activity was yours, no action is required. If this login was unexpected, please reset your password immediately in the Supabase Authentication console and audit active database sessions.</p>
            </div>
            ${defaultFooter}
          </div>
        `,
      };
      await transporter.sendMail(alertMailOptions);

      return res.status(200).json({ success: true, message: 'Security alert email sent successfully' });
    }

    if (type === 'admin_email') {
      const { recipients, subject, body } = payload;

      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients must be a non-empty array' });
      }

      // Send to all recipients (can use BCC or send individual mails)
      // Sending individually keeps individual formatting and prevents recipients from seeing each other's addresses
      const sendPromises = recipients.map((to: string) => {
        return transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to,
          subject,
          html: `
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              ${defaultHeader}
              <div style="padding: 40px 32px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; font-size: 15px;">
                ${body.replace(/\n/g, '<br />')}
              </div>
              ${defaultFooter}
            </div>
          `,
        });
      });

      await Promise.all(sendPromises);

      return res.status(200).json({ success: true, message: `Dispatched ${recipients.length} email(s) successfully` });
    }

    return res.status(400).json({ error: 'Unsupported type' });
  } catch (error: any) {
    console.error('Mail Sending Exception:', error);
    return res.status(500).json({ error: 'Internal mail server error', details: error.message });
  }
}
