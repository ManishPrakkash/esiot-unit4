import { CheckCircle2, HelpCircle, Award, Sparkles, BookOpen, Layers, Radio, Cloud, Zap, Flame, BrainCircuit } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table, QuizCard } from "../components/ui";

const S = "Unit IV Review & Quiz";

type QItem = { q: string; opts: string[]; a: number; why: string };

const createQuizSlide = (title: string, data: QItem): Slide => ({
  section: "Knowledge Check",
  title,
  steps: 1,
  body: () => <QuizCard {...data} />,
});

export const recapSlides: Slide[] = [
  // 0. Dedicated Energetic "QUIZ TIME!" Interstitial Slide
  {
    section: "Quiz Challenge",
    title: "🎯 QUIZ TIME: Test Your Knowledge!",
    bare: true,
    steps: 2,
    body: (s) => (
      <div className="relative flex h-full flex-col justify-between p-24 bg-[#14142a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffd23f_2px,transparent_2px)] [background-size:32px_32px]" />

        <div>
          <div className="flex items-center gap-4">
            <span className="border-2 border-white bg-pop px-6 py-2 display text-[22px] font-extrabold uppercase tracking-widest text-ink">
              Interactive Assessment
            </span>
            <span className="border-2 border-white bg-hot px-6 py-2 display text-[22px] font-extrabold uppercase tracking-widest text-white">
              5 Core Questions
            </span>
          </div>

          <h1 className="display mt-8 text-[90px] font-extrabold leading-[0.98] text-white max-w-[1300px]">
            Ready to Test Your <br />
            <span className="text-yellow-400">Unit IV Mastery?</span>
          </h1>

          <p className="mt-6 text-[34px] font-medium text-gray-300 max-w-[1200px] leading-relaxed">
            Let&apos;s check what you learned about 2G GSM cellular networks, AT commands, Cloud NIST characteristics, deployment models, and MQTT protocols!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="border-2 border-white/40 bg-white/10 p-6 rounded-lg backdrop-blur">
            <div className="flex items-center gap-3 text-yellow-300 mb-2">
              <Radio size={32} />
              <div className="display text-[26px] font-bold">Round 1: GSM &amp; AT</div>
            </div>
            <div className="text-[20px] text-gray-300">
              Modem modes, 2A peak current rules, and ASCII Ctrl+Z transmission.
            </div>
          </div>

          <div className="border-2 border-white/40 bg-white/10 p-6 rounded-lg backdrop-blur">
            <div className="flex items-center gap-3 text-cyan-300 mb-2">
              <Cloud size={32} />
              <div className="display text-[26px] font-bold">Round 2: Cloud Models</div>
            </div>
            <div className="text-[20px] text-gray-300">
              NIST characteristics, shared responsibility, and IaaS / PaaS / SaaS models.
            </div>
          </div>

          <div className="border-2 border-white/40 bg-white/10 p-6 rounded-lg backdrop-blur">
            <div className="flex items-center gap-3 text-emerald-300 mb-2">
              <Zap size={32} />
              <div className="display text-[26px] font-bold">Round 3: MQTT &amp; AIO</div>
            </div>
            <div className="text-[20px] text-gray-300">
              Pub/Sub architecture, topic namespaces, and QoS delivery guarantees.
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // Quiz 1: GSM & AT Commands
  createQuizSlide("Quick Check 1: GSM & Cellular Telemetry", {
    q: "Which AT command switches the GSM modem to SMS text mode and which ASCII character is required to trigger message transmission?",
    opts: [
      "AT+CMGF=0 and ASCII 10 (Line Feed)",
      "AT+CMGF=1 and ASCII 26 (Ctrl+Z)",
      "AT+CSQ=1 and ASCII 13 (Carriage Return)",
      "ATD and ASCII 27 (Escape)"
    ],
    a: 1,
    why: "AT+CMGF=1 configures text-mode SMS. Once the message string is sent to the modem, ASCII code 26 (Ctrl+Z) must be transmitted to tell the SIM800L/SIM900A to dispatch the SMS."
  }),

  // Quiz 2: GSM Hardware & Power
  createQuizSlide("Quick Check 2: GSM Hardware & Power Supply", {
    q: "Why should a SIM800L / SIM900A GSM module NOT be powered directly from the Arduino Uno 5V regulator pin?",
    opts: [
      "The Arduino 5V pin outputs AC voltage instead of DC",
      "GSM modules require 3.3V logic and Arduino pin has no ground",
      "GSM modules draw up to 2A peak current bursts during RF transmission, causing brownouts",
      "Arduino baud rate is too slow to supply power"
    ],
    a: 2,
    why: "During GSM network registration and cellular transmission bursts, the module draws up to 2 Amperes peak. The Arduino onboard 5V regulator can only provide ~500 mA, causing immediate voltage drop and continuous brownout resets."
  }),

  // Quiz 3: Cloud Models
  createQuizSlide("Quick Check 3: Cloud Service Models", {
    q: "In which cloud service model does the customer have responsibility over the Operating System, runtime, and application software while the provider manages physical servers and hypervisors?",
    opts: [
      "Software as a Service (SaaS)",
      "Platform as a Service (PaaS)",
      "Infrastructure as a Service (IaaS)",
      "Function as a Service (FaaS)"
    ],
    a: 2,
    why: "In IaaS (e.g. AWS EC2, Azure VMs), the cloud provider only manages physical hardware and virtualization. The user is responsible for the OS, middleware, runtime, and all applications."
  }),

  // Quiz 4: MQTT vs HTTP
  createQuizSlide("Quick Check 4: IoT Communication Protocols", {
    q: "What is the primary advantage of MQTT over HTTP for battery-powered IoT edge devices?",
    opts: [
      "MQTT uses HTTP GET requests for every sensor reading",
      "MQTT has an ultra-compact 2-byte fixed header and persistent TCP connection, saving bandwidth and battery",
      "MQTT does not require an IP address or broker",
      "MQTT only operates over satellite links"
    ],
    a: 1,
    why: "MQTT features a minimal 2-byte header and a persistent keep-alive TCP socket, eliminating the heavy HTTP request/response headers (~800+ bytes) and 3-way connection handshakes for each reading."
  }),

  // Quiz 5: Adafruit IO Topic Structure
  createQuizSlide("Quick Check 5: Adafruit IO Architecture", {
    q: "What is the standard MQTT topic naming format for publishing telemetry to Adafruit IO?",
    opts: [
      "io.adafruit.com/data/feedname",
      "feeds/username/topic",
      "username/feeds/feed-name",
      "mqtt/devices/feed-name/username"
    ],
    a: 2,
    why: "Adafruit IO strictly enforces the topic hierarchy: username/feeds/feed-name (e.g. manis/feeds/temperature). Authentication is verified via the AIO Key passed during the MQTT connection handshake."
  }),

  // Master Summary & Cheat Sheet
  {
    section: S,
    title: "Unit IV Master Summary & Exam Cheat Sheet",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-3 gap-6">
        <Reveal show={s >= 0}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-accent flex items-center gap-2">
              <Radio size={28} /> GSM &amp; Cellular
            </div>
            <div className="space-y-2 text-[20px]">
              <div>• <b>SIM800L / SIM900A:</b> 2G quad-band, 3.7–4.2V, 2A peak current bursts.</div>
              <div>• <b>Netlight LED:</b> 800ms fast blink = searching; 3s slow pulse = registered.</div>
              <div>• <b>Key AT Commands:</b> <code className="font-mono bg-pop px-1">AT</code>, <code className="font-mono bg-pop px-1">AT+CSQ</code>, <code className="font-mono bg-pop px-1">AT+CMGF=1</code>, <code className="font-mono bg-pop px-1">ATD...;</code>, <code className="font-mono bg-pop px-1">ATH</code>.</div>
              <div>• <b>End of SMS:</b> ASCII 26 (<code className="font-mono">Ctrl+Z</code>).</div>
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 1}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-warm flex items-center gap-2">
              <Cloud size={28} /> Cloud Computing
            </div>
            <div className="space-y-2 text-[20px]">
              <div>• <b>NIST 5:</b> On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.</div>
              <div>• <b>Deployments:</b> Public, Private, Hybrid, Multi-cloud.</div>
              <div>• <b>Service Models:</b> IaaS (VMs), PaaS (Runtime), SaaS (Turnkey apps like Adafruit IO).</div>
              <div>• <b>Architecture:</b> Frontend ➔ Internet ➔ Backend (Application, Service, Runtime, Storage, Infra) + Management &amp; Security.</div>
            </div>
          </div>
        </Reveal>

        <Reveal show={s >= 2}>
          <div className="hard-sm border-2 border-ink bg-white p-6 space-y-3">
            <div className="display text-[26px] font-extrabold text-sky flex items-center gap-2">
              <Zap size={28} /> Protocols &amp; Adafruit
            </div>
            <div className="space-y-2 text-[20px]">
              <div>• <b>MQTT:</b> Pub/Sub, broker, topics, QoS 0/1/2, 2-byte header, port 1883/8883.</div>
              <div>• <b>CoAP:</b> UDP-based REST for 6LoWPAN mesh.</div>
              <div>• <b>Adafruit IO:</b> Feeds (data), Dashboards (UI), Triggers (alert rules).</div>
              <div>• <b>Topic Syntax:</b> <code className="font-mono bg-pop px-1">username/feeds/feed-name</code>.</div>
            </div>
          </div>
        </Reveal>
      </div>
    ),
  },
];
