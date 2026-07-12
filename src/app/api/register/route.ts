import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface RegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  pathway: string;
  expectations: string;
  code: string;
  submittedAt: string;
}

const REQUIRED_FIELDS: (keyof RegistrationPayload)[] = [
  'fullName',
  'email',
  'phone',
  'state',
  'pathway',
  'expectations',
  'code',
];

const NOTIFY_EMAIL = 'rubytechconsulting@gmail.com';

export async function POST(request: NextRequest) {
  let data: RegistrationPayload;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || typeof data[field] !== 'string') {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER / EMAIL_PASS env vars are not set.');
    return NextResponse.json(
      { error: 'Email is not configured on the server yet.' },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const submittedDate = new Date(data.submittedAt || Date.now()).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const textBody = [
    'New RubyTech Bootcamp registration',
    '',
    `Full name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `State: ${data.state}`,
    `Pathway: ${data.pathway}`,
    `Expectations: ${data.expectations}`,
    '',
    `Registration code (payment narration): ${data.code}`,
    `Submitted: ${submittedDate}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: sans-serif; font-size: 15px; color: #10141A; line-height:1.6;">
      <h2 style="margin:0 0 16px;">New RubyTech Bootcamp registration</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td style="color:#666;">Full name</td><td><strong>${escapeHtml(data.fullName)}</strong></td></tr>
        <tr><td style="color:#666;">Email</td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td style="color:#666;">Phone</td><td>${escapeHtml(data.phone)}</td></tr>
        <tr><td style="color:#666;">State</td><td>${escapeHtml(data.state)}</td></tr>
        <tr><td style="color:#666;">Pathway</td><td>${escapeHtml(data.pathway)}</td></tr>
        <tr><td style="color:#666;">Expectations</td><td>${escapeHtml(data.expectations)}</td></tr>
      </table>
      <p style="margin-top:18px;">
        <span style="color:#666;">Registration code (payment narration):</span><br/>
        <strong style="font-family: monospace; font-size:18px;">${escapeHtml(data.code)}</strong>
      </p>
      <p style="color:#999; font-size:13px;">Submitted ${escapeHtml(submittedDate)}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"RubyTech Bootcamp" <${process.env.EMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `New registration: ${data.fullName} — ${data.pathway}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send registration email:', err);
    return NextResponse.json({ error: 'Could not send the notification email.' }, { status: 500 });
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}