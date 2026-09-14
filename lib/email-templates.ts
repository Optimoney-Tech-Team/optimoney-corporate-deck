function row(label: string, value: string, last = false): string {
  return `
  <tr><td style="padding:10px 0;${last ? "" : "border-bottom:1px solid #F5F5F5;"}">
    <p style="margin:0 0 3px;font-family:'Courier New',monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(11,13,20,0.4);">${label}</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#0B0D14;">${value || "N/A"}</p>
  </td></tr>`;
}

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background-color:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F2F5;padding:48px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
  ${body}
</table></td></tr></table>
</body></html>`;
}

function header(seriesLabel: string): string {
  return `
  <tr><td style="background-color:#ffffff;border-radius:20px 20px 0 0;padding:28px 48px;border-bottom:1px solid #F0F2F5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><p style="margin:0;font-family:Georgia,serif;font-size:18px;color:#0B0D14;">Optimoney <span style="color:#10b981;font-style:italic;">Technologies</span></p>
          <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(11,13,20,0.35);">${seriesLabel}</p></td>
      <td align="right">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;"></span>&nbsp;
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:rgba(16,185,129,0.3);"></span>&nbsp;
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:rgba(16,185,129,0.1);"></span>
      </td>
    </tr></table>
  </td></tr>`;
}

function footer(year: number): string {
  return `
  <tr><td style="background-color:#ffffff;border-top:1px solid #F0F2F5;border-radius:0 0 20px 20px;padding:20px 48px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(11,13,20,0.3);">&copy; ${year} Optimoney Technologies Pvt. Ltd.</p></td>
      <td align="right"><p style="margin:0;font-family:Georgia,serif;font-size:14px;color:rgba(11,13,20,0.15);font-style:italic;">Optimoney</p></td>
    </tr></table>
  </td></tr>`;
}

export interface ReportEmailStat {
  num: string;
  label: string;
}

export interface ReportEmailConfig {
  docTitle: string; // <title> tag
  seriesLabel: string; // small mono label next to the Optimoney wordmark, e.g. "Compliance Catalyst Series"
  eyebrow: string; // small mono label above the headline, e.g. "August 2026"
  headlinePlain: string; // regular-weight line
  headlineBold: string; // bold line
  subtitle: string;
  stats: [ReportEmailStat, ReportEmailStat, ReportEmailStat];
}

export function getReportEmailHTML(config: ReportEmailConfig): string {
  const year = new Date().getFullYear();
  const [s1, s2, s3] = config.stats;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${config.docTitle}</title></head>
<body style="margin:0;padding:0;background-color:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F2F5;padding:48px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        ${header(config.seriesLabel)}

        <tr><td style="background-color:#ffffff;padding:48px 48px 44px;text-align:center;">
          <div style="width:1px;height:40px;background-color:rgba(16,185,129,0.3);margin:0 auto 24px;"></div>
          <p style="margin:0 0 14px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:#10b981;font-weight:900;">${config.eyebrow}</p>
          <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;color:#0B0D14;line-height:1.25;letter-spacing:-0.5px;">
            ${config.headlinePlain}<br/><span style="font-weight:700;">${config.headlineBold}</span>
          </p>
          <p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(11,13,20,0.5);line-height:1.7;max-width:380px;margin-left:auto;margin-right:auto;font-style:italic;">
            ${config.subtitle}
          </p>
          <p style="display:inline-block;background-color:#0B0D14;color:#F5F3EE;font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:16px 36px;border-radius:9999px;margin:0;">
            Attached to This Email
          </p>
          <div style="width:1px;height:40px;background-color:rgba(16,185,129,0.3);margin:36px auto 0;"></div>
        </td></tr>

        <tr><td style="background-color:#FAFAFA;padding:40px 48px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #E8EAF0;border-radius:16px;overflow:hidden;">
            <tr>
              <td align="center" width="33%" style="padding:28px 12px;border-right:1px solid #F0F2F5;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#10b981;line-height:1;">${s1.num}</p>
                <p style="margin:8px 0 0;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,13,20,0.4);line-height:1.6;">${s1.label}</p>
              </td>
              <td align="center" width="33%" style="padding:28px 12px;border-right:1px solid #F0F2F5;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#10b981;line-height:1;">${s2.num}</p>
                <p style="margin:8px 0 0;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,13,20,0.4);line-height:1.6;">${s2.label}</p>
              </td>
              <td align="center" width="33%" style="padding:28px 12px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#10b981;line-height:1;">${s3.num}</p>
                <p style="margin:8px 0 0;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,13,20,0.4);line-height:1.6;">${s3.label}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="background-color:#FAFAFA;padding:0 48px 40px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(11,13,20,0.38);line-height:1.8;text-align:center;">
            Your copy is attached to this email as a PDF.<br/>Questions? Reply to this email and we'll get back to you.
          </p>
        </td></tr>

        <tr><td style="background-color:#ffffff;border-top:1px solid #F0F2F5;border-radius:0 0 20px 20px;padding:24px 48px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle">
              <p style="margin:0 0 3px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(11,13,20,0.3);line-height:1.7;">&copy; ${year} Optimoney Technologies Pvt. Ltd.</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(11,13,20,0.3);line-height:1.7;">You received this because you requested this document.</p>
            </td>
            <td align="right" valign="middle">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:rgba(11,13,20,0.15);font-style:italic;">Optimoney</p>
            </td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function getNotifyEmailHTML(
  name: string,
  email: string,
  company: string,
  title: string,
  timestamp: string,
  reportLabel: string,
  seriesLabel: string
): string {
  const year = new Date().getFullYear();
  const optionalRows = [
    company && row("Company", company),
    title && row("Title / Role", title),
  ]
    .filter(Boolean)
    .join("");
  return wrap(`
    ${header(seriesLabel)}
    <tr><td style="background-color:#ffffff;padding:40px 48px 36px;text-align:center;">
      <div style="width:1px;height:36px;background-color:rgba(16,185,129,0.3);margin:0 auto 20px;"></div>
      <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.45em;text-transform:uppercase;color:#10b981;font-weight:900;">${reportLabel}</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:#0B0D14;line-height:1.2;">New lead <span style="color:#10b981;font-style:italic;">inbound.</span></p>
      <div style="width:1px;height:36px;background-color:rgba(16,185,129,0.3);margin:24px auto 0;"></div>
    </td></tr>
    <tr><td style="background-color:#FAFAFA;padding:0 48px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #E8EAF0;border-radius:16px;overflow:hidden;margin-top:24px;">
        <tr><td width="3" style="background-color:#10b981;">&nbsp;</td>
        <td style="padding:24px 28px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${row("Name", name)}
            ${row("Email", `<a href="mailto:${email}" style="color:#10b981;text-decoration:none;">${email}</a>`)}
            ${optionalRows}
            ${row("Requested", reportLabel)}
            ${row("Timestamp", `${timestamp} IST`, true)}
          </table>
        </td></tr>
      </table>
    </td></tr>
    ${footer(year)}
  `);
}
