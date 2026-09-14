import path from "path";
import { handleLeadRequest } from "@/lib/send-lead";

const PDF_PATH = path.join(process.cwd(), "reports", "tech-overview-september-2026.pdf");

export async function POST(req: Request) {
  return handleLeadRequest(req, {
    sheetType: "research-report",
    sheetExtraParams: {
      reportId: "tech-overview-september-2026",
      reportTitle: "Optimoney Corporate Overview",
    },
    reportLabel: "Optimoney Corporate Overview",
    requireCompany: false,
    notifyFallback: "Corporate Overview Deck",
    pdfPath: PDF_PATH,
    pdfAttachmentName: "Optimoney_Tech_Overview_September_2026.pdf",
    emailSubject: "Optimoney Corporate Overview | Optimoney Technologies",
    email: {
      docTitle: "Optimoney Corporate Overview | Optimoney Technologies",
      seriesLabel: "Compliance Operations Briefing",
      eyebrow: "September 2026",
      headlinePlain: "Optimoney",
      headlineBold: "Corporate Overview",
      subtitle: "Measured on a live bank engagement, deployed above your existing TMS and core.",
      stats: [
        { num: "-40%", label: "reduction in<br/>alert volume" },
        { num: "-28%", label: "reduction in<br/>false positives" },
        { num: "+50%", label: "STR filing<br/>quality" },
      ],
    },
  });
}
