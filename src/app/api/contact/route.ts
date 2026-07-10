import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { name, email,reason,  message } = await request.json();

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: 'Please fill out all fields.' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        {
          error:
            'Email delivery is not configured yet. Set EMAIL_USER and EMAIL_PASS in your environment variables.',
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT || 587),
      secure: Number(process.env.EMAIL_PORT || 587) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const toAddress = process.env.CONTACT_TO || 'rubytechconsulting@gmail.com';
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    // await transporter.sendMail({
    //   from: fromAddress,
    //   to: toAddress,
    //   replyTo: email,
    //   subject: `New contact inquiry from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    //       <h3>New contact inquiry</h3>
    //       <p><strong>Name:</strong> ${name}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Message:</strong></p>
    //       <p>${message.replace(/\n/g, '<br />')}</p>
    //     </div>
    //   `,
    // });


    await transporter.sendMail({
  from: fromAddress,
  to: toAddress,
  replyTo: email,
  subject: `New Contact Inquiry from ${name}`,
  text: `
New Contact Inquiry

Name: ${name}
Email: ${email}
Reason: ${reason}

Message:
${message}
  `,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>New Contact Inquiry</title>
</head>

<body style="margin:0;padding:40px 20px;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="640" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:16px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.08);
">

<!-- Header -->
<tr>
<td
style="
background:#111827;
padding:32px;
text-align:center;
">
<h1
style="
margin:0;
font-size:28px;
color:#ffffff;
font-weight:700;
">
New Contact Inquiry
</h1>

<p
style="
margin:10px 0 0;
color:#d1d5db;
font-size:15px;
">
Someone submitted your contact form.
</p>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:35px;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>
<td style="padding-bottom:20px;">

<p style="margin:0;color:#6b7280;font-size:13px;">
NAME
</p>

<p style="margin:6px 0 0;font-size:18px;font-weight:bold;color:#111827;">
${name}
</p>

</td>
</tr>

<tr>
<td style="padding-bottom:20px;">

<p style="margin:0;color:#6b7280;font-size:13px;">
EMAIL:
</p>

<p style="margin:6px 0 0;font-size:17px;">
<a
href="mailto:${email}"
style="
color:#2563eb;
text-decoration:none;
">
${email}
</a>
</p>

</td>
</tr>

<tr>

<td>
<p style="margin:0 0 10px;color:#6b7280;font-size:13px;">
REASON: 
</p>
<p>${reason}</p>
<p style="margin:0 0 10px;color:#6b7280;font-size:13px;">
MESSAGE:
</p>

<div
style="
background:#f9fafb;
border-left:5px solid #B78A46;
padding:18px;
border-radius:8px;
font-size:15px;
line-height:1.8;
color:#374151;
">
${message.replace(/\n/g, "<br>")}
</div>

</td>

</tr>

</table>

</td>
</tr>

<!-- Footer -->

<tr>
<td
style="
background:#fafafa;
padding:25px;
border-top:1px solid #eeeeee;
text-align:center;
">

<p
style="
margin:0;
font-size:13px;
color:#9ca3af;
">
Submitted on ${new Date().toLocaleString("en-NG", {
  timeZone: "Africa/Lagos",
  dateStyle: "full",
  timeStyle: "medium",
})}
</p>

<p
style="
margin:12px 0 0;
font-size:12px;
color:#c0c4cc;
">
This message was generated automatically from Rubytech contact form.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'production'
            ? 'Unable to send your message right now. Please try again later.'
            : error instanceof Error
              ? error.message
              : 'Unable to send your message right now.',
      },
      { status: 500 }
    );
  }
}
