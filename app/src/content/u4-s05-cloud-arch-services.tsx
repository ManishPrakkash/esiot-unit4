import { Layers, Server, Database, Shield, Zap, Cpu, Code2, CheckCircle2 } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table } from "../components/ui";
import { CloudArchitectureDemo, CloudServiceStackDemo } from "../demos/Unit4Demos";

const S = "Cloud Architecture & Services";

export const cloudArchSlides: Slide[] = [
  // 1. Cloud Architecture Overview (SOA & EDA)
  {
    section: S,
    title: "Cloud Computing Architecture Overview",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <div className="space-y-6">
          <Reveal show={s >= 0}>
            <p className="text-[34px] leading-snug">
              Cloud computing architecture combines <b className="text-accent">SOA (Service-Oriented Architecture)</b> and <b className="text-accent">EDA (Event-Driven Architecture)</b>. It is partitioned into two major domains connected by the Internet: <b>Frontend</b> and <b>Backend</b>.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <div className="hard border-2 border-ink bg-white p-6 space-y-4 text-[24px]">
              <div className="display text-[28px] font-extrabold text-accent">Architectural Subsystems</div>
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-accent">1.</span>
                <span><b>Frontend:</b> Client devices (PCs, phones, IoT gateways) and user interfaces (web browsers, mobile apps).</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-accent">2.</span>
                <span><b>Internet Medium:</b> Bridges client requests to cloud datacenters via secure protocols (TLS/HTTPS, WebSockets, MQTT).</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-accent">3.</span>
                <span><b>Backend:</b> Application logic, services (IaaS/PaaS/SaaS), cloud runtime, storage systems, and physical infrastructure.</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal show={s >= 2}>
            <Card title="Management & Security Wrapper" tone="hot">
              <div className="space-y-3 text-[23px]">
                <div><b>• Management:</b> Allocates resources, coordinates task scheduling, provisions auto-scaling, and manages traffic load balancing.</div>
                <div className="border-t border-ink/20 pt-2">
                  <b>• Security:</b> Implements virtual firewalls, IAM role-based access, data encryption (at rest &amp; in transit), and threat mitigation.
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal show={s >= 3}>
            <Callout kind="exam">
              <b>Exam Architecture Question:</b> Always sketch the 3-part diagram: <i>Frontend</i> at top ➔ <i>Internet cloud</i> in center ➔ <i>Backend Core</i> (Application, Service, Runtime, Storage, Infrastructure) bounded by <i>Management</i> and <i>Security</i> pillars.
            </Callout>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 2. Interactive Architecture Visualizer
  {
    section: S,
    title: "Interactive Cloud Multi-Tier Architecture Explorer",
    steps: 1,
    body: () => <CloudArchitectureDemo />,
  },

  // 3. Cloud Service Models: IaaS, PaaS, SaaS
  {
    section: S,
    title: "Cloud Service Models: IaaS · PaaS · SaaS",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-3 gap-6">
        <Reveal show={s >= 0}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-4">
            <div className="display text-[30px] font-extrabold text-accent">1. IaaS</div>
            <div className="text-[20px] font-bold text-mute uppercase">Infrastructure as a Service</div>
            <div className="text-[22px] leading-snug">
              Provides raw virtualized compute, storage, and networking hardware. You install and manage the operating system, middleware, and applications.
            </div>
            <div className="border-t border-ink/20 pt-2 text-[20px] font-mono">
              <b>Examples:</b> AWS EC2, Azure VMs, Google Compute Engine.
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 1}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-4">
            <div className="display text-[30px] font-extrabold text-sky">2. PaaS</div>
            <div className="text-[20px] font-bold text-mute uppercase">Platform as a Service</div>
            <div className="text-[22px] leading-snug">
              Provides a pre-configured development and deployment environment with runtime libraries, databases, and message queues. No server or OS management required.
            </div>
            <div className="border-t border-ink/20 pt-2 text-[20px] font-mono">
              <b>Examples:</b> Google App Engine, Heroku, AWS Elastic Beanstalk.
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 2}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-4">
            <div className="display text-[30px] font-extrabold text-warm">3. SaaS</div>
            <div className="text-[20px] font-bold text-mute uppercase">Software as a Service</div>
            <div className="text-[22px] leading-snug">
              Fully managed end-user applications delivered over the Internet on a subscription basis. You manage zero infrastructure, code, or middleware.
            </div>
            <div className="border-t border-ink/20 pt-2 text-[20px] font-mono">
              <b>Examples:</b> Adafruit IO, Microsoft 365, Google Workspace, Salesforce.
            </div>
          </div>
        </Reveal>
      </div>
    ),
  },

  // 4. Interactive Shared Responsibility Stack
  {
    section: S,
    title: "Interactive Shared Responsibility Stack Explorer",
    steps: 1,
    body: () => <CloudServiceStackDemo />,
  },
];
