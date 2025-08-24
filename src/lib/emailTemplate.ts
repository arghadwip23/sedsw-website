// lib/emailTemplates.ts
export default function verificationEmailTemplate(name: string, verificationLink: string): string {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #000000;
      color: #ffffff;
      font-family: 'Segoe UI', sans-serif;
      text-align: center;
    }

    .container {
      width: 100%;
      padding: 40px 0;
      background: linear-gradient(to bottom, #000000, #0b0b1d);
    }

    .card {
      max-width: 500px;
      margin: auto;
      background: rgba(20, 20, 40, 0.95);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
    }

    .title {
      font-size: 26px;
      margin-bottom: 10px;
      color: #9d7fff;
      letter-spacing: 1px;
    }

    .subtitle {
      font-size: 16px;
      margin-bottom: 25px;
      color: #cfcfff;
    }

    .button {
      display: inline-block;
      background: linear-gradient(90deg, #8a2be2, #4facfe);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 1px;
      box-shadow: 0 0 12px rgba(138, 43, 226, 0.8);
      transition: transform 0.2s ease;
    }

    .button:hover {
      transform: scale(1.05);
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #8888aa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="title">🌌 Verify Your Mission Access</h1>
      <p class="subtitle">Your journey among the stars is about to begin.  
      Confirm your identity to board the spacecraft.</p>

      <a href="{verification_link}" class="button">Verify Email</a>

      <p class="footer">If you didn’t request this, you can safely ignore this message.<br>
      © 2025 SEDS Antariksh. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

  `;
}
