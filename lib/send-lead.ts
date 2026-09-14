import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getReportEmailHTML, getNotifyEmailHTML, type ReportEmailConfig } from "@/lib/email-templates";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAILS =
  process.env.NOTIFY_EMAILS || "mihirmehta@optimoneytech.com, sushil@optimoneytech.com";
const SCRIPT_URL =
  process.env.SHEET_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwARtc4IGauBl3gpWLlVsUX3eJsUq-TCxvWStTfBq8sDaltyoP40xkid8gmxJYO7OcWDQ/exec";

export interface LeadConfig {
  sheetType: string; // "type" value the Apps Script branches on
  sheetExtraParams?: Record<string, string>; // e.g. reportId/reportTitle for the generic "research-report" branch
  reportLabel: string; // human label, e.g. "Lifting the Diligence Burden"
  requireCompany?: boolean; // whitepaper form asks for company; simpler gates may not
  notifyFallback?: string; // shown in the notify email's Company/Title rows when the form doesn't collect them
  pdfPath: string;
  pdfAttachmentName: string;
  emailSubject: string;
  email: ReportEmailConfig;
}

export async function handleLeadRequest(req: Request, config: LeadConfig) {
  try {
    const { name, email, company, title } = await req.json();

    if (!name || !email || !EMAIL_REGEX.test(email) || (config.requireCompany && !company)) {
      return NextResponse.json(
        {
          error: config.requireCompany
            ? "Please fill in your name, work email and company."
            : "Please fill in your name and work email.",
        },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const sheetParams = new URLSearchParams({
      type: config.sheetType,
      name,
      email,
      company: company || "",
      title: title || "",
      timestamp,
      ...config.sheetExtraParams,
    });

    // Report to the requester, internal alert, and sheet log all fire together,
    // settled independently so a sheet-webhook hiccup never blocks the emails
    // (and vice versa), but each outcome is checked below, not ignored.
    const [reportResult, notifyResult, sheetResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `"Optimoney Technologies" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: config.emailSubject,
        html: getReportEmailHTML(config.email),
        attachments: [{ filename: config.pdfAttachmentName, path: config.pdfPath }],
      }),
      transporter.sendMail({
        from: `"Optimoney Technologies" <${process.env.GMAIL_USER}>`,
        to: NOTIFY_EMAILS,
        subject: `"${config.reportLabel}" Request: ${name}`,
        html: getNotifyEmailHTML(
          name,
          email,
          company || config.notifyFallback || "",
          title || config.notifyFallback || "",
          timestamp,
          config.reportLabel,
          config.email.seriesLabel
        ),
      }),
      fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: sheetParams.toString(),
      }),
    ]);

    if (reportResult.status === "rejected") {
      console.error(`${config.sheetType}: failed to email requester:`, reportResult.reason);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }
    if (notifyResult.status === "rejected") {
      console.error(`${config.sheetType}: failed to send internal notification:`, notifyResult.reason);
    }
    if (sheetResult.status === "rejected") {
      console.error(`${config.sheetType}: failed to log to sheet:`, sheetResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`${config.sheetType} error:`, err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
