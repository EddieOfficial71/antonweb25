# Whitelist Request Template — Diagnostic & IT Instructions

Purpose
- This document helps you collect the diagnostic output from the app and prepare a concise whitelist/review request for your school's IT or the GoGuardian administrators.

When to use
- Use this when a site (for example, `play.geforcenow.com`) is blocked or refuses to load/embed inside the launcher. The app's "Diagnose" button produces server-side headers and status that you should attach to your request.

How to run the diagnosis (locally)
1. Start the local server:
```powershell
cd 'C:\Users\anton\OneDrive\Desktop\idk-anton'
npm install
npm start
```
2. Open the dashboard at `http://localhost:3000`, sign in, and attempt to launch the app that is blocked.
3. When the popup is blocked, click the **Diagnose** button in the modal and then click **Copy Whitelist Request** to copy a prefilled message containing the diagnosis.

What to include in your IT ticket/email
- Your name and class/role (if required by your school).
- The exact URL that is blocked (e.g., `https://play.geforcenow.com/...`).
- The timestamp (ISO format) you ran the diagnosis.
- The browser user-agent string (the copy action includes it).
- The full diagnostic output (server-side JSON with HTTP status and relevant headers). Useful headers include `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, and any redirect status.
- A short description of the intended use (e.g., educational activity, game required for class, school-licensed tool, etc.).

Why this helps
- Many sites intentionally disallow embedding by setting `X-Frame-Options: DENY` or a restrictive `Content-Security-Policy`. These are server-side security settings. IT can:
  - Whitelist the specific host in their filtering rules, or
  - Open a support ticket with GoGuardian (or their filtering provider) including the diagnostic data so the site can be reviewed.

Sample message (paste into your ticket/email)

```
Subject: Request to review/whitelist URL blocked by GoGuardian

Hello IT team,

Please review and whitelist the following URL so it can be accessed from student devices when required for class.

URL: <PASTE URL HERE>
Timestamp: <PASTE ISO TIMESTAMP HERE>
User Agent: <PASTE USER AGENT HERE>

Diagnosis (server-side):
<PASTE DIAGNOSIS JSON HERE>

Reason: The diagnostic output shows the site sets headers or returns a status that prevents embedding or normal loading (for example: X-Frame-Options or Content-Security-Policy). Please advise how we can get this site allowed for our class use, or provide a site-based exception for students.

Thanks,
<Name> — <Class/Role>
```

Important notes and policy
- Do not attempt to circumvent or evade school filters. This document is only to help you gather evidence and request a legitimate review or whitelist.
- If the target site responds with `X-Frame-Options: DENY` or an equivalent `Content-Security-Policy` that forbids embedding, the only correct remedy is working with IT or the site owner — not bypassing the protection.

Optional: If you'd like, I can also commit the diagnostic output to the project logs (Netlify functions logs) after we deploy. That requires adding appropriate logging and ensuring no private user data is included.

---
Last updated: 2025-11-13
