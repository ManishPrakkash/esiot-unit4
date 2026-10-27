import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Wifi, ArrowRight, Server, Cloud, Cpu, Database,
  Lock, Shield, Zap, RefreshCw, CheckCircle2, Clock, Globe,
  AlertTriangle, DollarSign, Layers, Activity, Smartphone, Eye,
  Check, ArrowDown, Bell, Sparkles
} from "lucide-react";

/* =========================================================================
   1. PICTORIAL CELLULAR TOWER & RADIO WAVE ANIMATION (Hero & GSM)
   ========================================================================= */
export function CellularTowerAnimation() {
  return (
    <div className="hard border-2 border-ink bg-[#0c1a2e] p-6 rounded-lg text-white relative overflow-hidden h-[290px] flex items-center justify-between">
      {/* Background constellation grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* 1. IoT Edge Device */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
        <div className="h-20 w-20 rounded-xl border-2 border-yellow-400 bg-black/60 flex items-center justify-center shadow-[0_0_15px_#facc15]">
          <Cpu size={40} className="text-yellow-400 animate-pulse" />
        </div>
        <div className="font-mono text-[16px] font-bold text-yellow-300">Arduino + SIM800L</div>
        <div className="text-[13px] text-gray-400">Sensors: DHT22 / GPS</div>
      </div>

      {/* 2. Animated Radio Wave Path */}
      <div className="relative flex-1 mx-6 flex flex-col items-center">
        <div className="text-[14px] font-mono text-cyan-300 font-bold mb-1">
          2G Cellular Uplink (850 / 900 / 1800 / 1900 MHz)
        </div>
        <div className="w-full relative flex items-center justify-center h-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-8 w-8 rounded-full border-2 border-cyan-400"
              initial={{ scale: 0.2, opacity: 1, x: -120 }}
              animate={{ scale: 2.2, opacity: 0, x: 120 }}
              transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.8, ease: "linear" }}
            />
          ))}
          <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-cyan-400 to-sky-400" />
        </div>
        <div className="text-[12px] font-mono text-gray-400">200 kHz FDMA Carrier · 8 TDMA Time Slots</div>
      </div>

      {/* 3. Base Station Cellular Tower (BTS) */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
        <div className="h-24 w-20 rounded-xl border-2 border-cyan-400 bg-black/60 flex items-center justify-center shadow-[0_0_20px_#38bdf8]">
          <Radio size={46} className="text-cyan-400" />
        </div>
        <div className="font-mono text-[16px] font-bold text-cyan-300">GSM BTS Tower</div>
        <div className="text-[13px] text-gray-400">BSS Subsystem</div>
      </div>

      {/* 4. Internet / Cloud Bridge */}
      <div className="relative flex-1 mx-6 flex flex-col items-center">
        <div className="text-[14px] font-mono text-emerald-300 font-bold mb-1">
          GPRS Packet Backbone ➔ TCP/IP Gateway
        </div>
        <div className="w-full relative flex items-center justify-center h-12">
          <div className="w-full h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400" />
          <motion.div
            className="absolute h-3 w-8 bg-yellow-300 rounded-full shadow-[0_0_8px_#facc15]"
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
        </div>
        <div className="text-[12px] font-mono text-gray-400">Port 1883 / TLS 8883 MQTT</div>
      </div>

      {/* 5. Cloud Platform (Adafruit IO) */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
        <div className="h-20 w-20 rounded-xl border-2 border-indigo-400 bg-black/60 flex items-center justify-center shadow-[0_0_20px_#818cf8]">
          <Cloud size={44} className="text-indigo-400 animate-bounce" />
        </div>
        <div className="font-mono text-[16px] font-bold text-indigo-300">Adafruit IO Cloud</div>
        <div className="text-[13px] text-gray-400">Feeds &amp; Dashboards</div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. REWORKED PICTORIAL: CIRCUIT-SWITCHED VS PACKET-SWITCHED (GPRS)
   ========================================================================= */
export function CircuitVsPacketDiagram() {
  const [activeMode, setActiveMode] = useState<"circuit" | "packet">("packet");

  return (
    <div className="space-y-4">
      {/* Selector Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveMode("circuit")}
          className={`press hard-sm flex-1 border-2 border-ink py-3 text-[22px] font-extrabold flex items-center justify-center gap-3 ${activeMode === "circuit" ? "bg-warm text-white" : "bg-white text-ink"}`}
        >
          📞 Traditional Circuit-Switched GSM (Voice Era)
        </button>
        <button
          onClick={() => setActiveMode("packet")}
          className={`press hard-sm flex-1 border-2 border-ink py-3 text-[22px] font-extrabold flex items-center justify-center gap-3 ${activeMode === "packet" ? "bg-sky text-white" : "bg-white text-ink"}`}
        >
          📦 Packet-Switched GPRS (Modern IoT Standard)
        </button>
      </div>

      {/* Diagram Canvas */}
      <div className="hard border-2 border-ink bg-white p-6 min-h-[310px]">
        {activeMode === "circuit" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[20px] font-bold text-warm border-b-2 border-ink/20 pb-2">
              <span className="flex items-center gap-2">
                <Lock size={22} /> Dedicated Physical Circuit (Locked for entire duration)
              </span>
              <span className="flex items-center gap-2 text-red-600 font-mono text-[18px]">
                <Clock size={20} className="animate-spin" /> Continuous Per-Minute Billing 💸
              </span>
            </div>

            {/* Visual dedicated copper pipe */}
            <div className="relative border-4 border-dashed border-warm bg-warm-soft p-5 rounded-lg flex items-center justify-between">
              <div className="text-center font-bold text-[18px]">
                <div className="h-14 w-14 bg-white border-2 border-ink rounded-full mx-auto flex items-center justify-center text-warm font-extrabold">Node A</div>
                <div className="mt-1 text-ink font-bold">IoT Sensor</div>
              </div>

              {/* Locked channel pipe with animated continuous wave */}
              <div className="flex-1 mx-6 relative flex flex-col items-center justify-center">
                <div className="w-full h-10 bg-warm border-2 border-ink rounded flex items-center justify-center text-white font-mono font-extrabold text-[16px] shadow-md">
                  🔒 100% BANDWIDTH RESERVED (Other nodes blocked &amp; denied access)
                </div>
                <div className="text-[13px] font-mono text-red-700 font-bold mt-1">
                  Line remains locked even when 0 bytes are being transmitted!
                </div>
              </div>

              <div className="text-center font-bold text-[18px]">
                <div className="h-14 w-14 bg-white border-2 border-ink rounded-full mx-auto flex items-center justify-center text-ink font-extrabold">Server</div>
                <div className="mt-1 text-ink font-bold">Receiver</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-[18px] pt-1">
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-warm">Call Setup Latency:</b> Takes 5–15 seconds to dial and establish dedicated circuit.
              </div>
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-warm">Resource Utilization:</b> Heavy wastage during idle telemetry gaps.
              </div>
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-warm">Cost Penalty:</b> Highly inefficient for periodic 10-byte sensor readings.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[20px] font-bold text-sky border-b-2 border-ink/20 pb-2">
              <span className="flex items-center gap-2">
                <Zap size={22} className="text-sky" /> Dynamic Packet Multiplexing (Shared Common Pool)
              </span>
              <span className="text-emerald-700 font-mono font-bold text-[18px]">
                ✅ Pay Only per Kilobyte Transferred
              </span>
            </div>

            {/* Visual multiplexed packet queue */}
            <div className="relative border-4 border-sky bg-sky-soft p-5 rounded-lg flex items-center justify-between">
              <div className="space-y-2 text-center font-bold text-[15px]">
                <div className="h-8 px-2 bg-accent text-white border-2 border-ink rounded flex items-center justify-center">Node 1 (Temp)</div>
                <div className="h-8 px-2 bg-warm text-white border-2 border-ink rounded flex items-center justify-center">Node 2 (GPS)</div>
                <div className="h-8 px-2 bg-hot text-white border-2 border-ink rounded flex items-center justify-center">Node 3 (Relay)</div>
              </div>

              {/* Shared Multiplexed Data Pipe */}
              <div className="flex-1 mx-6 space-y-1">
                <div className="w-full h-12 bg-white border-2 border-ink rounded flex items-center px-3 gap-2 overflow-hidden shadow-inner">
                  <motion.div
                    className="h-8 px-3 bg-accent text-white font-mono text-[14px] font-bold rounded flex items-center shrink-0 border border-ink"
                    animate={{ x: [-20, 240, 500] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                  >
                    P1: 24.5°C
                  </motion.div>
                  <motion.div
                    className="h-8 px-3 bg-warm text-white font-mono text-[14px] font-bold rounded flex items-center shrink-0 border border-ink"
                    animate={{ x: [-20, 240, 500] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: "linear" }}
                  >
                    P2: Lat: 13.08
                  </motion.div>
                  <motion.div
                    className="h-8 px-3 bg-hot text-white font-mono text-[14px] font-bold rounded flex items-center shrink-0 border border-ink"
                    animate={{ x: [-20, 240, 500] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: 1.4, ease: "linear" }}
                  >
                    P3: LED: ON
                  </motion.div>
                </div>
                <div className="text-center font-mono text-[13px] text-sky font-extrabold">
                  ⚡ Dynamic Packet Flow · Packets interleaved seamlessly over shared carrier
                </div>
              </div>

              <div className="h-20 w-24 bg-white border-2 border-ink rounded flex flex-col items-center justify-center font-bold text-[15px]">
                <Server size={28} className="text-sky" />
                <span>Cloud Host</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-[18px] pt-1">
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-sky">Always-On Connection:</b> Instantaneous packet delivery with zero dialing delay.
              </div>
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-sky">High Multi-Tenancy:</b> Thousands of devices share common cellular towers.
              </div>
              <div className="p-3 border-2 border-ink bg-panel2 rounded">
                <b className="text-sky">Low IoT Cost:</b> Billed purely on small data volume, saving up to 99% cost.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   3. PICTORIAL TDMA 8-TIME-SLOT FRAME VISUALIZER (PDF Page 2)
   ========================================================================= */
export function TdmaFrameVisualizer() {
  const [slot, setSlot] = useState(2);

  const slotLabels = [
    { name: "TS0: Broadcast Control (BCCH)", user: "Cellular System Sync", color: "bg-red-500 text-white" },
    { name: "TS1: Voice / Audio User 1", user: "Mobile User A", color: "bg-blue-500 text-white" },
    { name: "TS2: GPRS Sensor Node (Telemetry)", user: "Arduino SIM800L Node", color: "bg-yellow-400 text-ink font-extrabold" },
    { name: "TS3: Voice / Audio User 2", user: "Mobile User B", color: "bg-blue-500 text-white" },
    { name: "TS4: SMS Traffic Channel (SDCCH)", user: "Security SMS Alarm Dispatch", color: "bg-emerald-500 text-white" },
    { name: "TS5: Voice / Audio User 3", user: "Mobile User C", color: "bg-blue-500 text-white" },
    { name: "TS6: GPRS Smart Meter Telemetry", user: "Grid Energy Meter", color: "bg-yellow-400 text-ink font-extrabold" },
    { name: "TS7: Voice / Audio User 4", user: "Mobile User D", color: "bg-blue-500 text-white" },
  ];

  return (
    <div className="hard border-2 border-ink bg-white p-6 space-y-4">
      <div className="flex justify-between items-center border-b-2 border-ink pb-2">
        <div>
          <h4 className="display text-[26px] font-extrabold text-ink">
            GSM TDMA Frame Structure (200 kHz Carrier Bandwidth)
          </h4>
          <p className="text-[18px] text-mute">1 TDMA Frame = 4.615 ms · 8 Time Slots of 577 µs each</p>
        </div>
        <span className="border-2 border-ink bg-pop px-3 py-1 font-mono text-[18px] font-bold">
          Active Slot: TS{slot} (577 µs)
        </span>
      </div>

      {/* 8-Slot Horizontal Bar */}
      <div className="grid grid-cols-8 gap-2 border-2 border-ink bg-black p-2 rounded">
        {slotLabels.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSlot(idx)}
            className={`press h-18 rounded border-2 border-ink p-1 flex flex-col items-center justify-between text-center transition-all ${
              idx === slot ? "scale-105 ring-4 ring-yellow-400 " + s.color : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="font-mono text-[14px] font-bold">TS{idx}</span>
            <span className="text-[11px] leading-tight font-medium line-clamp-2">{s.user}</span>
            <span className="text-[10px] opacity-70">577 µs</span>
          </button>
        ))}
      </div>

      {/* Active Time-slot Details */}
      <div className="hard-sm border-2 border-ink bg-accent-soft p-4 flex items-center justify-between">
        <div>
          <div className="text-[22px] font-extrabold text-accent">{slotLabels[slot].name}</div>
          <div className="text-[18px] text-ink">
            <b>Active Transceiver:</b> {slotLabels[slot].user} transmits in burst mode during this 577 microsecond window.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={7}
            value={slot}
            onChange={(e) => setSlot(Number(e.target.value))}
            className="w-40 accent-indigo-600"
          />
          <span className="font-mono font-bold text-[20px]">TS{slot}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. REWORKED PICTORIAL ARDUINO <-> GSM HARDWARE WIRING SCHEMATIC (PAGE 6)
   ========================================================================= */
export function HardwareWiringSchematic() {
  const [selectedWire, setSelectedWire] = useState<string>("txrx");

  const wireDetails: Record<string, { name: string; visualColor: string; pinFrom: string; pinTo: string; desc: string; danger: string; why: string }> = {
    txrx: {
      name: "UART Serial Communication (TX / RX)",
      visualColor: "bg-blue-500",
      pinFrom: "Arduino Pin 2 (Soft RX) & Pin 3 (Soft TX)",
      pinTo: "GSM TXD Pin & GSM RXD Pin",
      desc: "Full-duplex serial data bridge for sending AT commands and receiving ASCII response strings.",
      danger: "Arduino TX outputs 5V TTL logic! SIM800L RX is rated for 3.3V logic. Connecting directly will cause long-term chip degradation or damage.",
      why: "Always insert a 1kΩ / 2kΩ resistor divider or bi-directional logic level shifter on the Arduino TX -> GSM RX line."
    },
    gnd: {
      name: "Common Reference Ground (GND)",
      visualColor: "bg-black",
      pinFrom: "Arduino GND Pin",
      pinTo: "GSM Module GND Pin & Power Supply (-)",
      desc: "Establishes a unified 0V ground voltage reference across all decoupled power supplies and microcontroller pins.",
      danger: "Floating ground causes voltage offsets, garbage ASCII characters in the serial monitor, and unparseable AT command errors.",
      why: "Every component in the circuit MUST share a common physical ground plane."
    },
    power: {
      name: "External 4.0V @ 2A DC Power Source",
      visualColor: "bg-red-500",
      pinFrom: "LM2596 DC-DC Buck / 12V 2A Adapter",
      pinTo: "GSM Module VCC / VBAT Pin",
      desc: "Supplies the heavy 2-Ampere burst current needed when the GSM radio frequency transmitter activates.",
      danger: "Arduino 5V onboard linear regulator cannot supply more than 500 mA. Powering GSM from Arduino 5V causes brownout reboots during call/SMS!",
      why: "Use an external dedicated LM2596 buck converter tuned to 4.0V DC with minimum 2A output rating."
    },
    cap: {
      name: "1000 µF Low-ESR Buffer Decoupling Capacitor",
      visualColor: "bg-amber-500",
      pinFrom: "Directly Across GSM VCC (+)",
      pinTo: "Directly Across GSM GND (-)",
      desc: "Acts as a local instantaneous energy reservoir during the 577 µs GSM TDMA transmission bursts.",
      danger: "Without this capacitor, transmission burst current dips battery voltage below 3.4V, triggering emergency under-voltage shutdown.",
      why: "A 1000 µF electrolytic or tantalum low-ESR capacitor smooths out the severe 2A current spikes."
    }
  };

  const cur = wireDetails[selectedWire];

  return (
    <div className="grid grid-cols-[1.25fr_1.15fr] gap-8 items-start">
      {/* Visual Interactive Breadboard Schematic */}
      <div className="hard border-2 border-ink bg-[#0f172a] p-5 rounded-lg text-white space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/20 pb-2">
          <span className="font-mono text-[16px] text-yellow-400 font-bold">
            INTERACTIVE CIRCUIT SCHEMATIC: ARDUINO UNO + GSM
          </span>
          <span className="text-[13px] bg-yellow-400 text-ink px-2 py-0.5 rounded font-extrabold">
            Active: {cur.name.split(" ")[0]}
          </span>
        </div>

        {/* Schematic Circuit Canvas */}
        <div className="grid grid-cols-2 gap-4 items-center relative">
          {/* Arduino Board */}
          <div className={`border-3 p-4 rounded-lg transition-all ${selectedWire === "txrx" || selectedWire === "gnd" ? "border-cyan-400 bg-cyan-950 shadow-[0_0_15px_#38bdf8]" : "border-gray-700 bg-gray-900/80"}`}>
            <div className="font-bold text-[17px] text-cyan-300 flex items-center justify-between">
              <span>Arduino Uno R3</span>
              <span className="text-[12px] text-gray-400 font-mono">5V MCU</span>
            </div>
            <div className="space-y-1 font-mono text-[14px] mt-2">
              <div className={`px-2 py-0.5 rounded ${selectedWire === "txrx" ? "bg-blue-600 text-white font-bold" : "text-gray-300"}`}>
                ➔ Pin 2 (SoftSerial RX)
              </div>
              <div className={`px-2 py-0.5 rounded ${selectedWire === "txrx" ? "bg-blue-600 text-white font-bold" : "text-gray-300"}`}>
                ➔ Pin 3 (SoftSerial TX)
              </div>
              <div className={`px-2 py-0.5 rounded ${selectedWire === "gnd" ? "bg-gray-700 text-white font-bold" : "text-gray-400"}`}>
                ➔ Pin GND (0V)
              </div>
            </div>
          </div>

          {/* SIM800L / SIM900A Board */}
          <div className={`border-3 p-4 rounded-lg transition-all ${selectedWire === "power" || selectedWire === "cap" || selectedWire === "txrx" ? "border-yellow-400 bg-yellow-950 shadow-[0_0_15px_#facc15]" : "border-gray-700 bg-gray-900/80"}`}>
            <div className="font-bold text-[17px] text-yellow-300 flex items-center justify-between">
              <span>SIM800L / SIM900A</span>
              <span className="text-[12px] text-gray-400 font-mono">3.7–4.2V</span>
            </div>
            <div className="space-y-1 font-mono text-[14px] mt-2">
              <div className={`px-2 py-0.5 rounded ${selectedWire === "txrx" ? "bg-blue-600 text-white font-bold" : "text-gray-300"}`}>
                ➔ Pin TXD (To Pin 2)
              </div>
              <div className={`px-2 py-0.5 rounded ${selectedWire === "txrx" ? "bg-blue-600 text-white font-bold" : "text-gray-300"}`}>
                ➔ Pin RXD (3.3V Divider)
              </div>
              <div className={`px-2 py-0.5 rounded ${selectedWire === "power" ? "bg-red-600 text-white font-bold" : "text-gray-300"}`}>
                ➔ Pin VCC (4.0V @ 2A)
              </div>
              <div className={`px-2 py-0.5 rounded ${selectedWire === "gnd" ? "bg-gray-700 text-white font-bold" : "text-gray-400"}`}>
                ➔ Pin GND (Common)
              </div>
            </div>
          </div>
        </div>

        {/* Power Supply + Decoupling Capacitor Box */}
        <div className={`border-2 p-3 rounded text-center font-mono text-[14px] transition-all ${selectedWire === "power" || selectedWire === "cap" ? "border-red-400 bg-red-950 text-red-200 shadow-[0_0_15px_#ef4444]" : "border-gray-700 bg-gray-900 text-gray-400"}`}>
          🔋 External LM2596 Regulator (4.0V @ 2A) + 1000 µF Low-ESR Decoupling Capacitor
        </div>

        {/* Wire Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { key: "txrx", label: "🔵 1. UART TX/RX Lines" },
            { key: "gnd", label: "⚫ 2. Common GND Rail" },
            { key: "power", label: "🔴 3. External 2A Power" },
            { key: "cap", label: "🟡 4. 1000µF Buffer Cap" },
          ].map((w) => (
            <button
              key={w.key}
              onClick={() => setSelectedWire(w.key)}
              className={`press px-3 py-2 border-2 rounded font-mono text-[14px] font-bold text-left ${
                selectedWire === w.key ? "bg-pop text-ink border-ink shadow-md" : "bg-white/10 text-white border-white/30 hover:bg-white/20"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wire Inspector Details & Dynamic Diagnostics */}
      <div className="hard border-2 border-ink bg-white p-5 space-y-3">
        <div className="display text-[24px] font-extrabold text-ink border-b-2 border-ink pb-1 flex items-center justify-between">
          <span>{cur.name}</span>
        </div>

        <div className="text-[20px] leading-snug">
          <b>Connection Path:</b> <br />
          <span className="font-mono text-[17px] bg-panel2 p-1 border border-ink/40 inline-block mt-1">
            {cur.pinFrom} ➔ {cur.pinTo}
          </span>
        </div>

        <div className="text-[19px] leading-snug text-mute">
          <b>Function:</b> {cur.desc}
        </div>

        <div className="hard-sm border-2 border-ink bg-hot-soft p-3 text-[18px] text-red-950 space-y-1">
          <div className="font-extrabold flex items-center gap-1.5 text-red-800">
            <AlertTriangle size={20} /> Danger / Failure Mode:
          </div>
          <div>{cur.danger}</div>
        </div>

        <div className="hard-sm border-2 border-ink bg-sky-soft p-3 text-[18px] text-sky-950 space-y-1">
          <div className="font-extrabold flex items-center gap-1.5 text-sky-800">
            <Check size={20} /> Correct Engineering Practice:
          </div>
          <div>{cur.why}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. PICTORIAL NIST 5 CHARACTERISTICS INTERACTIVE WHEEL (PDF Page 12)
   ========================================================================= */
export function NistWheel() {
  const [selectedChar, setSelectedChar] = useState(0);

  const nistItems = [
    {
      title: "1. On-Demand Self-Service",
      icon: Zap,
      desc: "Consumers can provision compute, storage, and network access automatically via web console or API without human intervention from the service provider.",
      iotExample: "Spinning up a new MQTT broker instance in 30 seconds when deploying 5,000 new smart meters.",
      tone: "accent"
    },
    {
      title: "2. Broad Network Access",
      icon: Globe,
      desc: "Capabilities are available over standard network mechanisms and accessible across heterogeneous thin and thick client platforms (smartphones, laptops, embedded IoT nodes).",
      iotExample: "Accessing temperature telemetry and actuator controls from anywhere in the world using HTTPS and MQTT.",
      tone: "sky"
    },
    {
      title: "3. Resource Pooling (Multi-Tenancy)",
      icon: Layers,
      desc: "The provider's computing resources are pooled to serve multiple consumers using a multi-tenant model with different physical and virtual resources dynamically assigned.",
      iotExample: "Hundreds of independent companies running IoT dashboards securely on the same physical datacenter hardware.",
      tone: "warm"
    },
    {
      title: "4. Rapid Elasticity",
      icon: Activity,
      desc: "Resources can be elastically provisioned and released, automatically scaling outward during peak sensor ingest traffic and inward during quiet hours.",
      iotExample: "Auto-scaling ingestion servers during a sudden flood disaster when 100,000 emergency water sensors report simultaneously.",
      tone: "hot"
    },
    {
      title: "5. Measured Service",
      icon: DollarSign,
      desc: "Cloud systems automatically meter and control resource usage at a granular level (storage, compute hours, bandwidth transferred), providing transparent billing.",
      iotExample: "Paying $0.001 per 10,000 MQTT telemetry messages published to Adafruit IO / AWS IoT Core.",
      tone: "accent"
    }
  ];

  const it = nistItems[selectedChar];

  return (
    <div className="grid grid-cols-[1.1fr_1.3fr] gap-8">
      {/* Characteristics Selector list */}
      <div className="space-y-2">
        {nistItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setSelectedChar(idx)}
              className={`press hard-sm w-full border-2 border-ink p-3 text-left flex items-center gap-4 text-[21px] font-bold ${
                idx === selectedChar ? "bg-accent text-white" : "bg-white text-ink"
              }`}
            >
              <Icon size={26} className={idx === selectedChar ? "text-yellow-300" : "text-accent"} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Card */}
      <div className="hard border-2 border-ink bg-accent-soft p-6 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b-2 border-ink pb-2 mb-3">
            <span className="text-[15px] font-mono font-bold text-accent uppercase">NIST SP 800-145 STANDARD</span>
          </div>
          <h3 className="display text-[32px] font-extrabold text-accent mb-2">{it.title}</h3>
          <div className="text-[22px] leading-snug mb-3">{it.desc}</div>
          <div className="hard-sm border-2 border-ink bg-pop-soft p-3 text-[20px]">
            <b>IoT Case Study:</b> {it.iotExample}
          </div>
        </div>
        <div className="text-mute text-[16px]">
          💡 Click through all 5 NIST characteristics to study their IoT implementations.
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. PICTORIAL CLUSTER DEPLOYMENT ARCHITECTURE (Public / Private / Hybrid)
   ========================================================================= */
export function CloudDeploymentDiagram() {
  const [model, setModel] = useState<"public" | "private" | "hybrid" | "multi">("hybrid");

  return (
    <div className="space-y-4">
      {/* 4 Model Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { id: "public", label: "Public Cloud (AWS/Azure)" },
          { id: "private", label: "Private On-Prem Cloud" },
          { id: "hybrid", label: "Hybrid Cloud (Bridge)" },
          { id: "multi", label: "Multi-Cloud Strategy" },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => setModel(b.id as any)}
            className={`press hard-sm border-2 border-ink py-2 text-[19px] font-extrabold ${model === b.id ? "bg-pop text-ink" : "bg-white text-ink"}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Visual Topology Diagram */}
      <div className="hard border-2 border-ink bg-white p-5 min-h-[320px]">
        {model === "hybrid" && (
          <div className="space-y-4">
            <div className="text-[19px] font-bold text-sky border-b-2 border-ink/20 pb-2">
              Hybrid Topology: Private Data Center + Secure IPsec VPN / AWS Direct Connect + Public Cloud
            </div>
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="border-3 border-warm bg-warm-soft p-4 rounded-lg text-center space-y-2">
                <div className="font-extrabold text-[19px] text-warm">🏢 Private DC (On-Premises)</div>
                <div className="text-[15px] text-mute">Confidential Medical Records &amp; Local Edge InfluxDB</div>
                <div className="border border-ink bg-white p-1.5 font-mono text-[13px]">High Security · Fixed CapEx</div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-[13px] font-mono text-center font-bold text-accent">
                  🔒 Dedicated VPN / DirectConnect
                </div>
                <div className="w-full h-3 bg-gradient-to-r from-warm via-accent to-sky rounded-full" />
                <div className="text-[12px] text-center text-mute">Standardized Data Portability (Google Anthos)</div>
              </div>

              <div className="border-3 border-sky bg-sky-soft p-4 rounded-lg text-center space-y-2">
                <div className="font-extrabold text-[19px] text-sky">☁️ Public Cloud (AWS / Azure)</div>
                <div className="text-[15px] text-mute">Massive Elastic Compute &amp; AI Model Training</div>
                <div className="border border-ink bg-white p-1.5 font-mono text-[13px]">Infinite Scalability · Pay-as-you-go</div>
              </div>
            </div>
          </div>
        )}

        {model === "public" && (
          <div className="space-y-4 text-center">
            <div className="text-[19px] font-bold text-accent border-b-2 border-ink/20 pb-2 text-left">
              Public Cloud Architecture: Multi-tenant shared infrastructure over global Internet
            </div>
            <div className="border-3 border-accent bg-accent-soft p-5 rounded-lg grid grid-cols-3 gap-4">
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Cloud size={32} className="mx-auto text-accent mb-1" />
                <div className="font-bold text-[17px]">AWS / Azure / GCP</div>
                <div className="text-[13px] text-mute">Global Datacenters</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Database size={32} className="mx-auto text-sky mb-1" />
                <div className="font-bold text-[17px]">Shared S3 &amp; DBaaS</div>
                <div className="text-[13px] text-mute">High Redundancy</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Zap size={32} className="mx-auto text-warm mb-1" />
                <div className="font-bold text-[17px]">Zero CapEx</div>
                <div className="text-[13px] text-mute">Pure OpEx Billing</div>
              </div>
            </div>
          </div>
        )}

        {model === "private" && (
          <div className="space-y-4 text-center">
            <div className="text-[19px] font-bold text-warm border-b-2 border-ink/20 pb-2 text-left">
              Private Cloud Architecture: Dedicated single-tenant enterprise infrastructure
            </div>
            <div className="border-3 border-warm bg-warm-soft p-5 rounded-lg grid grid-cols-3 gap-4">
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Server size={32} className="mx-auto text-warm mb-1" />
                <div className="font-bold text-[17px]">Internal Data Center</div>
                <div className="text-[13px] text-mute">OpenStack / VMware</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Shield size={32} className="mx-auto text-hot mb-1" />
                <div className="font-bold text-[17px]">100% Data Sovereignty</div>
                <div className="text-[13px] text-mute">Air-gapped Security</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <Lock size={32} className="mx-auto text-accent mb-1" />
                <div className="font-bold text-[17px]">High Initial CapEx</div>
                <div className="text-[13px] text-mute">Internal IT Management</div>
              </div>
            </div>
          </div>
        )}

        {model === "multi" && (
          <div className="space-y-4 text-center">
            <div className="text-[19px] font-bold text-hot border-b-2 border-ink/20 pb-2 text-left">
              Multi-Cloud Architecture: Distributing workloads across distinct providers to prevent lock-in
            </div>
            <div className="border-3 border-hot bg-hot-soft p-5 rounded-lg grid grid-cols-3 gap-4">
              <div className="border-2 border-ink bg-white p-3 rounded">
                <div className="font-bold text-[17px] text-accent">AWS S3</div>
                <div className="text-[13px] text-mute">Long-term Telemetry Storage</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <div className="font-bold text-[17px] text-sky">Google Cloud (GCP)</div>
                <div className="text-[13px] text-mute">TensorFlow / AI Model Training</div>
              </div>
              <div className="border-2 border-ink bg-white p-3 rounded">
                <div className="font-bold text-[17px] text-warm">Microsoft Azure</div>
                <div className="text-[13px] text-mute">Enterprise App Hosting</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   7. PICTORIAL PROTOCOL LAYER STACK DIAGRAM
   ========================================================================= */
export function ProtocolStackDiagram() {
  return (
    <div className="hard border-2 border-ink bg-white p-6 space-y-4">
      <div className="display text-[26px] font-extrabold text-ink border-b-2 border-ink pb-2">
        IoT Protocol Stack Mapping vs Traditional Web Stack
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="text-center font-bold text-[20px] text-warm">Traditional Web / Cloud Stack</div>
          <div className="border-2 border-ink bg-warm-soft p-3 rounded text-center font-mono font-bold text-[18px]">
            Application: HTTP / HTTPS / REST (Port 80/443)
          </div>
          <div className="border-2 border-ink bg-panel2 p-3 rounded text-center font-mono font-bold text-[18px]">
            Security: SSL / TLS 1.3
          </div>
          <div className="border-2 border-ink bg-accent-soft p-3 rounded text-center font-mono font-bold text-[18px]">
            Transport: TCP (3-Way Handshake)
          </div>
          <div className="border-2 border-ink bg-panel2 p-3 rounded text-center font-mono font-bold text-[18px]">
            Network: IPv4 / IPv6
          </div>
          <div className="text-[15px] text-mute text-center">High overhead (~800 B header), heavy for battery MCUs</div>
        </div>

        <div className="space-y-2">
          <div className="text-center font-bold text-[20px] text-sky">Lightweight Constrained IoT Stack</div>
          <div className="border-2 border-ink bg-sky-soft p-3 rounded text-center font-mono font-bold text-[18px] text-sky">
            Application: MQTT (Port 1883) · CoAP (Port 5683)
          </div>
          <div className="border-2 border-ink bg-panel2 p-3 rounded text-center font-mono font-bold text-[18px]">
            Security: TLS (MQTT) / DTLS (CoAP)
          </div>
          <div className="border-2 border-ink bg-pop-soft p-3 rounded text-center font-mono font-bold text-[18px] text-ink">
            Transport: TCP (MQTT) · UDP (CoAP)
          </div>
          <div className="border-2 border-ink bg-panel2 p-3 rounded text-center font-mono font-bold text-[18px]">
            Network: 6LoWPAN / IPv6 / 2G GPRS
          </div>
          <div className="text-[15px] text-sky font-bold text-center">Ultra-compact (2-byte header), years of battery life</div>
        </div>
      </div>
    </div>
  );
}
