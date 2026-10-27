import { Cpu, Radio, Cloud, Brain, Phone, Globe, Server, Smartphone, Wifi, Home, Factory, HeartPulse, Sprout, Building2, Car, Zap, Thermometer, Router, MonitorSmartphone } from "lucide-react";
import type { Slide } from "../types";
import { Bullets, Callout, Card, MasterDetail, Reveal } from "../components/ui";

const S1 = "IoT Evolution";
const S2 = "IoT Applications";

const phases = [
  { icon: Radio, t: "M2M", y: "1990s–2000s", d: "Machines talk to machines over private cellular/serial links. Closed, point-to-point systems (SCADA, telemetry, vending)." },
  { icon: Wifi, t: "Connected devices", y: "2008–2012", d: "Devices get IP addresses and join the Internet. Wi-Fi, ZigBee and RFID make 'things' addressable." },
  { icon: Cloud, t: "Cloud-centric IoT", y: "2012–2020", d: "Data flows to cloud platforms (AWS IoT, Azure IoT). Dashboards, analytics and remote control at scale." },
  { icon: Brain, t: "Edge AI / TinyML", y: "2020 →", d: "Intelligence moves onto the device: low latency, privacy, works offline, lower bandwidth." },
];

const stages = [
  { icon: Phone, t: "Voice & SMS", d: "Mobile phones carry voice and text only." },
  { icon: Globe, t: "Information web", d: "Static pages: read-only content (Web 1.0)." },
  { icon: Server, t: "Service web", d: "E-commerce, banking, transactions (Web 2.0)." },
  { icon: Smartphone, t: "Mobile & social web", d: "Always-on, people-to-people, app-driven." },
  { icon: Cpu, t: "Internet of Things", d: "Everyday objects join the network and sense, decide and act." },
];

export const intro: Slide[] = [
  {
    section: "Welcome", title: "", bare: true,
    body: () => (
      <div className="grid h-full grid-cols-[1.35fr_1fr] items-center gap-16 px-28">
        <div>
          <Reveal><span className="inline-block border-2 border-ink bg-pop px-5 py-1 text-[26px] font-extrabold uppercase tracking-[0.2em]">Embedded Systems &amp; IoT · ESIOT</span></Reveal>
          <Reveal><h1 className="display mt-8 text-[190px] font-extrabold leading-[0.9]">Unit <span className="text-accent">III</span></h1></Reveal>
          <Reveal><h2 className="display mt-6 text-[64px] font-bold leading-[1.05]">IoT Architecture &amp; Embedded Hardware</h2></Reveal>
          <Reveal><p className="mt-8 max-w-[1000px] text-[34px] leading-snug text-mute">From IoT evolution to wiring sensors, servos, Bluetooth and motion sensors on Arduino. Hands-on, drag-and-play.</p></Reveal>
          <Reveal><p className="mt-12 font-mono text-[24px] font-bold">→ next slide · G topics · F fullscreen</p></Reveal>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {[[Cpu, "Sense", "bg-accent text-white", "-rotate-3"], [Radio, "Connect", "bg-warm text-white", "rotate-2"], [Cloud, "Process", "bg-sky text-white", "rotate-3"], [Brain, "Act", "bg-pop text-ink", "-rotate-2"]].map(([I, t, c, r]) => {
            const Icon = I as typeof Cpu;
            return <Reveal key={t as string}><div className={`hard flex h-[300px] flex-col items-center justify-center gap-5 border-2 border-ink ${c as string} ${r as string}`}><Icon size={110} strokeWidth={1.8} /><span className="display text-[44px] font-extrabold">{t as string}</span></div></Reveal>;
          })}
        </div>
      </div>
    ),
  },
  {
    section: "Welcome", title: "What we will cover", steps: 7,
    body: (s) => (
      <div className="grid grid-cols-2 gap-x-16">
        <Bullets step={s} size="text-[32px]" items={[
          "IoT evolution & applications", "Application development stages", "Microcontrollers used in IoT", "Arduino IDE & programming basics",
        ]} />
        <Bullets step={s} start={4} size="text-[32px]" items={[
          "PWM, IR sensor, potentiometer, servo", "Bluetooth & HC-05; Arduino Mega / Due", "Accelerometer, colour sensor, gyroscope (MPU6050)",
        ]} />
      </div>
    ),
  },

  // ---------- IoT Evolution ----------
  {
    section: S1, title: "What is the Internet of Things?", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-16">
        <div className="space-y-8">
          <Reveal show={s >= 0}><p className="text-[38px] leading-snug">A network of <b className="text-accent">physical objects</b> embedded with sensors, software and connectivity that <b className="text-accent">collect and exchange data</b> over the Internet, with little or no human intervention.</p></Reveal>
          <Reveal show={s >= 1}><Card title="Sense → Connect → Process → Act" tone="sky">A thermostat senses temperature, sends it to the cloud, a rule decides, and the AC switches on.</Card></Reveal>
          <Reveal show={s >= 2}><Callout kind="exam">IoT = <b>Things</b> + <b>Connectivity</b> + <b>Data</b> + <b>Intelligence</b></Callout></Reveal>
        </div>
        <Reveal show={s >= 3}>
          <div className="flex h-full flex-col justify-center gap-5">
            {[[Thermometer, "Sensors"], [Router, "Gateway"], [Cloud, "Cloud"], [MonitorSmartphone, "App"]].map(([I, l], k) => {
              const Icon = I as typeof Cpu;
              return <div key={k} className="flex items-center gap-6 hard-sm border-2 border-ink bg-white p-6 text-[34px]"><Icon size={48} className="text-accent" /><span className="font-semibold">{l as string}</span></div>;
            })}
          </div>
        </Reveal>
      </div>
    ),
  },
  {
    section: S1, title: "Four phases of IoT evolution", steps: 4,
    body: (s) => (
      <div className="relative mt-6">
        <div className="absolute left-0 right-0 top-[58px] h-[6px] bg-ink" />
        <div className="grid grid-cols-4 gap-6">
          {phases.map((p, k) => (
            <Reveal key={p.t} show={s >= k + 1 || s >= 4}>
              <div className="relative">
                <div className="relative z-10 mx-auto flex h-[116px] w-[116px] items-center justify-center rounded-full border-4 border-ink bg-pop"><p.icon size={52} className="text-accent" /></div>
                <div className="mt-8 hard-sm border-2 border-ink bg-white p-6">
                  <div className="font-mono text-[22px] text-warm">{p.y}</div>
                  <div className="display my-2 text-[36px] font-bold">{p.t}</div>
                  <div className="text-[25px] leading-snug text-mute">{p.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },
  {
    section: S1, title: "Five stages: from voice calls to IoT", steps: 5,
    body: (s) => (
      <div>
        <div className="grid grid-cols-5 gap-5">
          {stages.map((p, k) => (
            <Reveal key={p.t} show={s >= k + 1 || s >= 5}>
              <div className={`h-[430px] hard-sm border-2 border-ink p-7 ${k === 4 ? "bg-pop" : "bg-white"}`} style={{ marginTop: (4 - k) * 20 }}>
                <p.icon size={56} className={k === 4 ? "text-accent" : "text-sky"} />
                <div className="font-mono mt-5 text-[22px] text-mute">Stage {k + 1}</div>
                <div className="display mb-3 text-[34px] font-bold leading-tight">{p.t}</div>
                <div className="text-[25px] leading-snug text-mute">{p.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><Reveal show={s >= 5}><Callout kind="tip">Each stage connected more of the world: first <b>people</b>, then <b>information</b>, then <b>services</b>, and finally <b>things</b>.</Callout></Reveal></div>
      </div>
    ),
  },

  // ---------- IoT Applications ----------
  {
    section: S2, title: "Where IoT is used", steps: 6,
    body: () => {
      const a = [
        [Home, "Smart home", "accent", ["Smart lighting & thermostats (Nest)", "Voice assistants (Alexa, Google Home)", "Door locks and security cameras", "Sensors: motion, temperature, door contacts"]],
        [Factory, "Industrial IoT", "sky", ["Predictive maintenance from vibration data", "Asset and inventory tracking", "Process monitoring on the factory floor", "Sensors: vibration, pressure, flow"]],
        [HeartPulse, "Healthcare", "hot", ["Wearables (heart rate, SpO₂)", "Remote patient monitoring", "Smart pill boxes and insulin pumps", "Sensors: ECG, temperature, accelerometer"]],
        [Sprout, "Agriculture", "accent", ["Soil-moisture-driven irrigation", "Crop and livestock monitoring", "Greenhouse climate control", "Sensors: soil moisture, humidity, light"]],
        [Building2, "Smart city", "warm", ["Adaptive street lighting", "Traffic and parking management", "Waste-bin fill-level alerts", "Sensors: air quality, noise, ultrasonic"]],
        [Car, "Automotive", "sky", ["Connected cars and OTA updates", "Fleet telematics and tracking", "Vehicle-to-everything (V2X)", "Sensors: GPS, IMU, tyre pressure"]],
        [Zap, "Energy / smart grid", "warm", ["Smart meters and billing", "Demand response and load balancing", "Solar and battery monitoring", "Sensors: current, voltage, power"]],
      ] as const;
      return (
        <MasterDetail items={a.map(([I, t, tone, pts]) => ({
          icon: <I size={34} />, title: t, tone,
          detail: <ul className="space-y-3">{pts.map((p) => <li key={p} className="flex gap-4"><span className="mt-[14px] h-[16px] w-[16px] shrink-0 rotate-45 border-2 border-ink bg-pop" />{p}</li>)}</ul>,
        }))} />
      );
    },
  },
  {
    section: S2, title: "Generic IoT architecture", steps: 6,
    body: (s) => {
      const L = [
        [Thermometer, "Sensors & actuators", "Measure the physical world / act on it", "text-accent"],
        [Cpu, "Controller (MCU)", "Signal conditioning, ADC, local logic", "text-sky"],
        [Radio, "Communication module", "Wi-Fi, BLE, ZigBee, LoRa, NB-IoT, cellular", "text-warm"],
        [Router, "Gateway / edge", "Protocol translation, filtering, local analytics", "text-hot"],
        [Cloud, "Cloud platform", "Storage, rules engine, analytics, device management", "text-sky"],
        [MonitorSmartphone, "Application / end user", "Dashboards, mobile apps, alerts, control", "text-accent"],
      ] as const;
      return (
        <div className="grid grid-cols-[1fr_auto] gap-12">
          <div className="space-y-3">
            {[...L].reverse().map(([I, t, d, c], k) => {
              const idx = 5 - k;
              return (
                <Reveal key={t} show={s >= idx}>
                  <div className="flex items-center gap-6 hard-sm border-2 border-ink bg-white px-8 py-4">
                    <I size={44} className={c} />
                    <div className="w-[470px] text-[32px] font-semibold">{t}</div>
                    <div className="text-[26px] text-mute">{d}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="flex flex-col items-center justify-between py-4 text-[22px] text-mute">
            <span>Data ↓</span><div className="w-1 flex-1 bg-gradient-to-b from-accent to-sky" /><span>Control ↑</span>
          </div>
        </div>
      );
    },
  },
];

