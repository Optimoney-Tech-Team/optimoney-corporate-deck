import LeadGate from "@/components/LeadGate";

export default function Home() {
  return (
    <LeadGate
      apiEndpoint="/api/request-overview"
      fields="basic"
      eyebrow="Compliance Operations Briefing · September 2026"
      headlinePlain="The transaction intelligence"
      headlineBold="your TMS is missing."
      subtitle="95 of every 100 AML alerts are false positives. Deployed above your existing TMS and core, live on a systemically important Indian bank, no replacement, no migration, no downtime."
      badges={["TMS-Agnostic", "CBS-Agnostic", "API-First"]}
      stats={[
        { num: "-40%", desc: "reduction in total alert volume, measured on a live bank engagement" },
        { num: "-28%", desc: "reduction in false positives, with detection coverage unchanged" },
        { num: "+50%", desc: "improvement in STR filing quality, evidenced before production" },
      ]}
      documentLabel="Optimoney Corporate Overview"
      noun="Deck"
    />
  );
}
