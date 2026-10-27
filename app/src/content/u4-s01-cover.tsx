import { Radio, Cloud, Cpu, ArrowRight, Layers, Wifi, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table } from "../components/ui";
import { CellularTowerAnimation, CircuitVsPacketDiagram, TdmaFrameVisualizer } from "../components/Pictorials";

const S = "Course Overview & GSM";

export const introSlides: Slide[] = [
  // 1. Full-bleed Hero Cover Slide with Animated Cellular Tower & Cloud Pipeline
  {
    section: "Unit IV Overview",
    title: "GSM, Cloud Computing & IoT",
    bare: true,
    steps: 3,
    body: (s) => (
      <div className="relative flex h-full flex-col justify-between p-20 bg-bg overflow-hidden">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1b1b2f_2px,transparent_2px)] [background-size:32px_32px]" />

        <div>
          <div className="flex items-center gap-4">
            <span className="border-2 border-ink bg-accent px-6 py-2 display text-[22px] font-extrabold uppercase tracking-widest text-white">
              ESIOT · UNIT IV
            </span>
            <span className="border-2 border-ink bg-pop px-6 py-2 display text-[22px] font-extrabold uppercase tracking-widest text-ink">
              9 Hours Curriculum
            </span>
          </div>

          <h1 className="display mt-6 text-[84px] font-extrabold leading-[0.98] text-ink max-w-[1400px]">
            GSM, Cloud Computing <br />
            <span className="text-accent">&amp; IoT Integration</span>
          </h1>
        </div>

        {/* Live Animated Hardware-to-Cloud Cellular Diagram */}
        <div className="my-2">
          <CellularTowerAnimation />
        </div>

        {/* 3 Core Topic Pillars */}
        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="hard-sm border-2 border-ink bg-accent-soft p-5">
            <div className="flex items-center gap-3 mb-1">
              <Radio size={32} className="text-accent" />
              <div className="display text-[26px] font-extrabold text-accent">Part 1: GSM &amp; GPRS</div>
            </div>
            <div className="text-[20px] leading-snug text-ink">
              SIM900A/SIM800L hardware, AT commands, voice calling, SMS alert systems &amp; remote appliance control.
            </div>
          </div>

          <div className="hard-sm border-2 border-ink bg-warm-soft p-5">
            <div className="flex items-center gap-3 mb-1">
              <Cloud size={32} className="text-warm" />
              <div className="display text-[26px] font-extrabold text-warm">Part 2: Cloud Computing</div>
            </div>
            <div className="text-[20px] leading-snug text-ink">
              NIST characteristics, deployment models (Public/Private/Hybrid), multi-tier architecture &amp; IaaS/PaaS/SaaS.
            </div>
          </div>

          <div className="hard-sm border-2 border-ink bg-sky-soft p-5">
            <div className="flex items-center gap-3 mb-1">
              <Wifi size={32} className="text-sky" />
              <div className="display text-[26px] font-extrabold text-sky">Part 3: Protocols &amp; Adafruit</div>
            </div>
            <div className="text-[20px] leading-snug text-ink">
              MQTT Pub/Sub vs HTTP, data feeds, real-time dashboards, threshold triggers &amp; ESP32 telemetry streaming.
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 2. Syllabus Roadmap
  {
    section: "Syllabus Breakdown",
    title: "Unit IV Complete Syllabus & Roadmap",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1fr] gap-12">
        <div className="space-y-6">
          <Reveal show={s >= 0}>
            <p className="text-[34px] leading-snug">
              Unit IV bridges <b>long-range cellular telecommunication</b> with <b>scalable internet cloud infrastructure</b> to power autonomous IoT networks.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <Card title="Official Syllabus Modules" tone="accent">
              <ul className="space-y-3 text-[24px]">
                <li><b>1. GSM Module &amp; Arduino:</b> SIM900A/SIM800L, UART, Calling, SMS, LED/Appliance control.</li>
                <li><b>2. Cloud Computing Fundamentals:</b> NIST definition, 5 key characteristics, challenges, deployment models.</li>
                <li><b>3. Cloud Architecture:</b> Multi-tier frontend/backend, SOA &amp; EDA, IaaS · PaaS · SaaS service models.</li>
                <li><b>4. IoT Data Protocols:</b> MQTT pub/sub, HTTP/REST, CoAP, WebSockets, AMQP.</li>
                <li><b>5. Adafruit IO Cloud:</b> Feeds, Dashboards, Triggers, ESP32/Feather cloud communication sketch.</li>
              </ul>
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal show={s >= 2}>
            <div className="hard border-2 border-ink bg-white p-8">
              <div className="display text-[30px] font-extrabold text-ink mb-4 flex items-center gap-3">
                <BookOpen className="text-warm" size={32} /> What You Will Master
              </div>
              <div className="space-y-3 text-[24px] text-mute">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-accent font-mono">01.</span>
                  <span>How to wire and send AT commands to SIM900A/SIM800L from Arduino Uno.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-accent font-mono">02.</span>
                  <span>How to build security alarms that dial phone calls and parse incoming SMS commands.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-accent font-mono">03.</span>
                  <span>The internal architecture, security, and service responsibility of modern cloud systems.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-accent font-mono">04.</span>
                  <span>Connecting ESP32 microcontrollers to Adafruit IO using MQTT for live telemetry and remote actuation.</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal show={s >= 3}>
            <Callout kind="exam">
              Unit IV carries high exam weightage in embedded systems: pay special attention to <b>AT command sequences</b>, <b>NIST cloud characteristics</b>, and <b>MQTT vs HTTP comparison</b>.
            </Callout>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 3. Introduction to GSM & GPRS (Interactive Circuit vs Packet Switching Diagram)
  {
    section: S,
    title: "Introduction to GSM & GPRS: Circuit vs Packet Switching",
    steps: 2,
    body: (s) => (
      <div className="space-y-6">
        <Reveal show={s >= 0}>
          <p className="text-[30px] leading-snug">
            <b className="text-accent">GSM (Global System for Mobile Communications)</b> was designed for circuit-switched voice calls. <b className="text-sky">GPRS (General Packet Radio Service)</b> introduced packet switching — enabling devices to share common network channels and bill by the kilobyte instead of by the minute.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <CircuitVsPacketDiagram />
        </Reveal>
      </div>
    ),
  },

  // 4. GSM Cellular Working Principles (Interactive TDMA 8-Slot Visualizer)
  {
    section: S,
    title: "GSM Radio Structure: 200 kHz Carriers & TDMA Time Slots",
    steps: 2,
    body: (s) => (
      <div className="space-y-6">
        <Reveal show={s >= 0}>
          <p className="text-[30px] leading-snug">
            Every GSM radio frequency carrier is <b>200 kHz wide</b> and divided into <b>8 time slots (TS0 to TS7)</b> using Time Division Multiple Access (TDMA). This allows 8 to 16 users or IoT sensor nodes to share the same frequency band in alternating 577 µs transmission bursts.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <TdmaFrameVisualizer />
        </Reveal>
      </div>
    ),
  },
];
