import { Cloud, Globe, Building2, Lock, ShieldCheck, ShieldAlert, AlertTriangle, Database, Zap, DollarSign, RefreshCw } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table } from "../components/ui";
import { NistWheel, CloudDeploymentDiagram } from "../components/Pictorials";

const S = "Cloud Computing Fundamentals";

export const cloudIntroSlides: Slide[] = [
  // 1. Definition & NIST 5 Characteristics Interactive Wheel
  {
    section: S,
    title: "What is Cloud Computing? (NIST 5 Characteristics)",
    steps: 2,
    body: (s) => (
      <div className="space-y-4">
        <Reveal show={s >= 0}>
          <p className="text-[28px] leading-snug">
            <b className="text-accent">Cloud Computing</b> is the on-demand delivery of computing services — compute, storage, databases, networking, software, and analytics — over the Internet with <b>pay-as-you-go pricing</b> without owning physical infrastructure.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <NistWheel />
        </Reveal>
      </div>
    ),
  },

  // 2. Cloud Deployment Models (Visual Network Architecture Topology)
  {
    section: S,
    title: "Cloud Deployment Models (Public · Private · Hybrid · Multi-Cloud)",
    steps: 2,
    body: (s) => (
      <div className="space-y-4">
        <Reveal show={s >= 0}>
          <p className="text-[28px] leading-snug">
            Deployment models define the boundary of infrastructure ownership, network accessibility, and multi-tenant isolation.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <CloudDeploymentDiagram />
        </Reveal>
      </div>
    ),
  },

  // 3. Deployment Models Comparison Table
  {
    section: S,
    title: "Comparison of Cloud Deployment Models",
    steps: 2,
    body: (s) => (
      <div className="space-y-6">
        <Reveal show={s >= 0}>
          <Table
            head={["Deployment Model", "Accessibility", "Security & Privacy", "Customization", "Cost Model"]}
            rows={[
              ["Public Cloud", "General public via Internet", "Shared security responsibility", "Limited customization", "Pay-as-you-go (OpEx)"],
              ["Private Cloud", "Restricted to authorized org", "Complete internal control", "High customization", "High initial CapEx + OpEx"],
              ["Hybrid Cloud", "Mixed public & private access", "Flexible tiered security", "High customization", "Balanced CapEx & OpEx"],
              ["Community Cloud", "Shared by specific group (e.g. banks)", "Shared among members", "Customized to community", "Shared capital costs"],
            ]}
          />
        </Reveal>

        <Reveal show={s >= 1}>
          <Callout kind="tip">
            <b>IoT Architecture Rule:</b> Smart healthcare and defense IoT use <b>Private or Hybrid Cloud</b> to maintain patient privacy regulations (HIPAA/GDPR), while consumer smart home gadgets use <b>Public Cloud</b> (AWS IoT/Adafruit IO) for maximum cost efficiency.
          </Callout>
        </Reveal>
      </div>
    ),
  },

  // 4. Challenges in Cloud Computing (Clean Title without PDF citation)
  {
    section: S,
    title: "Major Challenges in Cloud Computing",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-2 gap-8">
        <Reveal show={s >= 0}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-hot flex items-center gap-2">
              <ShieldAlert size={30} /> 1. Security &amp; Data Breaches
            </div>
            <div className="text-[23px] text-mute">
              Storing sensitive IoT data on shared multi-tenant infrastructure introduces risks of cyber-attacks, eavesdropping, and compliance hurdles across differing national data sovereignty laws (GDPR).
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 1}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-warm flex items-center gap-2">
              <AlertTriangle size={30} /> 2. Downtime &amp; Network Dependency
            </div>
            <div className="text-[23px] text-mute">
              Cloud systems require constant internet connectivity. Cloud provider outages or cellular coverage dropouts completely halt IoT actuation and real-time monitoring.
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 2}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-accent flex items-center gap-2">
              <Zap size={30} /> 3. Latency &amp; Bandwidth Costs
            </div>
            <div className="text-[23px] text-mute">
              Round-trip cloud transmission latency (100–300 ms) is too slow for real-time industrial robotics and autonomous vehicles. Ingesting terabytes of raw telemetry incurs massive bandwidth egress fees.
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 3}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-sky flex items-center gap-2">
              <Lock size={30} /> 4. Vendor Lock-In &amp; Governance
            </div>
            <div className="text-[23px] text-mute">
              Proprietary APIs and differing data formatting make migrating large IoT pipelines between AWS, Azure, and Google Cloud difficult and costly. Requires strict API standardization.
            </div>
          </div>
        </Reveal>
      </div>
    ),
  },
];
