import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Wifi, Send, Phone, PhoneOff, PhoneCall, MessageSquare,
  ShieldCheck, ShieldAlert, Zap, Server, Cloud, Database, Lock,
  Cpu, Activity, Power, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, RefreshCw, BarChart2, Bell, Terminal, Eye, Layers,
  Thermometer, Droplets, Lightbulb, Play, RotateCcw, Volume2, Shield
} from "lucide-react";

export const DemoPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`hard border-2 border-ink bg-white p-6 ${className}`}>{children}</div>
);

export const DemoHeader = ({ title, badge, icon: Icon }: { title: string; badge?: string; icon?: any }) => (
  <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-accent shrink-0" size={28} />}
      <h3 className="display text-[26px] font-extrabold text-ink">{title}</h3>
    </div>
    {badge && (
      <span className="border-2 border-ink bg-pop px-3 py-0.5 text-[17px] font-bold text-ink uppercase tracking-wider">
        {badge}
      </span>
    )}
  </div>
);

/* =========================================================================
   1. REWORKED GSM AT COMMAND TERMINAL & HARDWARE MODULE SIMULATOR
   ========================================================================= */
export function GSMTerminalDemo() {
  const [power, setPower] = useState(true);
  const [netRegistered, setNetRegistered] = useState(true);
  const [signalQuality, setSignalQuality] = useState(24); // 0-31 CSQ
  const [smsMode, setSmsMode] = useState<"PDU" | "TEXT">("TEXT");
  const [baud, setBaud] = useState(9600);
  const [cmdInput, setCmdInput] = useState("");
  const [activeCall, setActiveCall] = useState(false);
  const [batteryMv, setBatteryMv] = useState(4140);
  const [carrier, setCarrier] = useState("Airtel 2G");
  const [lastActionDesc, setLastActionDesc] = useState("Modem ready. Click any AT test button below to observe hardware changes!");
  const [logs, setLogs] = useState<{ type: "tx" | "rx" | "info"; text: string; time: string }[]>([
    { type: "info", text: "SIM800L / SIM900A Hardware Simulator initialized.", time: "00:00:01" },
    { type: "rx", text: "RDY\r\n+CFUN: 1\r\n+CPIN: READY\r\nCall Ready\r\nSMS Ready", time: "00:00:02" }
  ]);
  const [ledFlash, setLedFlash] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTime = () => {
    const d = new Date();
    return d.toTimeString().split(" ")[0];
  };

  const executeCommand = (cmdStr: string) => {
    const clean = cmdStr.trim();
    if (!clean) return;
    if (!power) {
      setLogs((prev) => [...prev, { type: "tx", text: clean, time: getTime() }, { type: "info", text: "Module is OFF. Turn ON power first.", time: getTime() }]);
      setLastActionDesc("❌ Module is powered down! No response.");
      return;
    }

    setLedFlash(true);
    setTimeout(() => setLedFlash(false), 250);

    const now = getTime();
    const upper = clean.toUpperCase();
    let response = "OK";

    if (upper === "AT") {
      response = "OK";
      setLastActionDesc("✅ Ping OK: UART serial link between Arduino & GSM is fully responsive.");
    } else if (upper === "AT+CSQ") {
      const ber = 0;
      response = `+CSQ: ${signalQuality},${ber}\r\n\r\nOK`;
      setLastActionDesc(`📶 Signal Quality measured: ${signalQuality}/31 (${signalQuality >= 15 ? "Strong Signal" : "Weak Signal"}).`);
    } else if (upper === "AT+CREG?") {
      response = netRegistered ? "+CREG: 0,1\r\n\r\nOK" : "+CREG: 0,2\r\n\r\nOK";
      setLastActionDesc(netRegistered ? "📡 Network Status: Registered on Home Cellular Network (+CREG: 0,1)." : "🔍 Searching for cellular tower (+CREG: 0,2)...");
    } else if (upper === "AT+CPIN?") {
      response = "+CPIN: READY\r\n\r\nOK";
      setLastActionDesc("💳 SIM Card check: Subscriber SIM card detected and PIN unlocked.");
    } else if (upper === "AT+COPS?") {
      response = netRegistered ? `+COPS: 0,0,"${carrier}"\r\n\r\nOK` : "+COPS: 0\r\n\r\nOK";
      setLastActionDesc(`🏢 Cellular Operator: Connected to ${carrier}.`);
    } else if (upper === "AT+CBC") {
      response = `+CBC: 0,92,${batteryMv}\r\n\r\nOK`;
      setLastActionDesc(`🔋 Battery Status: 92% charged (${(batteryMv / 1000).toFixed(2)} V). Safe above 3.8V threshold.`);
    } else if (upper === "AT+CMGF=1") {
      setSmsMode("TEXT");
      response = "OK";
      setLastActionDesc("✉️ SMS Format configured to human-readable ASCII TEXT MODE (AT+CMGF=1).");
    } else if (upper === "AT+CMGF=0") {
      setSmsMode("PDU");
      response = "OK";
      setLastActionDesc("🔢 SMS Format switched to binary PDU mode (AT+CMGF=0).");
    } else if (upper.startsWith("ATD")) {
      setActiveCall(true);
      response = "OK\r\n\r\nRINGING...";
      setLastActionDesc("📞 Outgoing Voice Call Dialed! Active Call LED illuminated on PCB.");
    } else if (upper === "ATH") {
      setActiveCall(false);
      response = "OK\r\n\r\nNO CARRIER";
      setLastActionDesc("📴 Call Disconnected / Hung up (ATH). Active Call LED OFF.");
    } else if (upper.startsWith("AT+CMGS=")) {
      response = "> Enter text and send Ctrl+Z (ASCII 26)\r\n+CMGS: 42\r\n\r\nOK";
      setLastActionDesc("📤 SMS Dispatch buffer opened. Waiting for Ctrl+Z (0x1A) to transmit.");
    } else if (upper === "AT+CMGD=1,4") {
      response = "OK";
      setLastActionDesc("🗑️ All SMS messages deleted from SIM storage (AT+CMGD=1,4).");
    } else {
      response = "ERROR: Unknown command.";
      setLastActionDesc("⚠️ Unrecognized AT command string.");
    }

    setLogs((prev) => [
      ...prev,
      { type: "tx", text: clean, time: now },
      { type: "rx", text: response, time: now }
    ]);
    setCmdInput("");
  };

  return (
    <div className="grid grid-cols-[1.15fr_1.35fr] gap-8">
      {/* Left: Interactive Hardware Board with Live Visual State */}
      <div className="space-y-4">
        <DemoPanel className="bg-panel2">
          <DemoHeader title="SIM800L / SIM900A Hardware Lab" badge="Live PCB State" icon={Radio} />

          {/* PCB Visualizer */}
          <div className="relative border-4 border-ink bg-[#0c3924] p-5 text-white rounded-lg shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffd23f_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
              <div className="font-mono font-bold text-[18px] text-yellow-300">
                SIMCOM SIM800L QUAD-BAND
              </div>
              <button
                onClick={() => setPower(!power)}
                className={`press flex items-center gap-1.5 px-3 py-1 border-2 border-ink text-[15px] font-extrabold ${power ? "bg-pop text-ink" : "bg-white/20 text-white"}`}
              >
                <Power size={16} /> {power ? "ON (4.0V)" : "OFF"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Signal & Antenna */}
              <div className="border border-white/30 bg-black/40 p-2.5 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-mono text-gray-300">ANTENNA / CSQ</span>
                  <div className="flex gap-1 items-end h-4">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1.5 rounded-t transition-all ${
                          power && netRegistered && bar <= Math.ceil(signalQuality / 6.2)
                            ? "bg-yellow-400"
                            : "bg-white/20"
                        }`}
                        style={{ height: `${bar * 20}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="font-mono text-[14px] text-yellow-200">
                  {power ? (netRegistered ? `${carrier} (${signalQuality}/31)` : "🔍 Searching...") : "Idle"}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="border border-white/30 bg-black/40 p-2.5 rounded flex flex-col justify-between font-mono text-[13px]">
                <div className="flex justify-between">
                  <span className="text-gray-300">SMS MODE:</span>
                  <span className="text-yellow-300 font-bold">{smsMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">VBAT:</span>
                  <span className="text-emerald-300 font-bold">{(batteryMv / 1000).toFixed(2)} V</span>
                </div>
              </div>
            </div>

            {/* LEDs & Physical Status Indicators */}
            <div className="pt-2 border-t border-white/20 flex items-center justify-between font-mono text-[14px]">
              <div className="flex items-center gap-1.5">
                <div className={`h-3.5 w-3.5 rounded-full border border-black ${power ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-red-950"}`} />
                <span>PWR</span>
              </div>

              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={
                    power
                      ? netRegistered
                        ? { opacity: [1, 0, 0, 0, 0, 0] }
                        : { opacity: [1, 0, 1, 0] }
                      : { opacity: 0 }
                  }
                  transition={{ repeat: Infinity, duration: netRegistered ? 3 : 0.8 }}
                  className="h-3.5 w-3.5 rounded-full border border-black bg-emerald-400 shadow-[0_0_8px_#10b981]"
                />
                <span>NETLIGHT ({netRegistered ? "3s" : "800ms"})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className={`h-3.5 w-3.5 rounded-full border border-black ${activeCall ? "bg-amber-400 animate-ping" : "bg-amber-950"}`} />
                <span>CALL ({activeCall ? "ACTIVE" : "IDLE"})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className={`h-3.5 w-3.5 rounded-full border border-black ${ledFlash ? "bg-blue-400 shadow-[0_0_8px_#3b82f6]" : "bg-blue-950"}`} />
                <span>TX/RX</span>
              </div>
            </div>
          </div>

          {/* Dynamic Action Explainer */}
          <div className="mt-3 p-3 border-2 border-ink bg-pop-soft text-[18px] font-bold text-ink">
            {lastActionDesc}
          </div>
        </DemoPanel>

        {/* Action Buttons */}
        <div className="hard border-2 border-ink bg-white p-3.5">
          <div className="text-[16px] font-bold text-mute mb-2 uppercase">Click AT Test Command:</div>
          <div className="flex flex-wrap gap-2">
            {[
              { cmd: "AT", label: "AT (Ping UART)" },
              { cmd: "AT+CSQ", label: "AT+CSQ (Signal Quality)" },
              { cmd: "AT+CREG?", label: "AT+CREG? (Registration)" },
              { cmd: "AT+CPIN?", label: "AT+CPIN? (Check SIM)" },
              { cmd: "AT+CBC", label: "AT+CBC (Battery Level)" },
              { cmd: "AT+CMGF=1", label: "AT+CMGF=1 (Set Text SMS)" },
              { cmd: 'ATD9994442064;', label: "ATD...; (Dial Call)" },
              { cmd: "ATH", label: "ATH (Hangup Call)" },
              { cmd: "AT+CMGD=1,4", label: "AT+CMGD (Delete All SMS)" },
            ].map(({ cmd, label }) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="press hard-sm border-2 border-ink bg-accent-soft px-3 py-1 font-mono text-[15px] font-bold hover:bg-accent hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Authentic Serial Monitor Console */}
      <div className="hard border-2 border-ink bg-[#0f111a] flex flex-col h-[520px] overflow-hidden">
        <div className="border-b-2 border-ink bg-[#1a1c29] px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-mono text-[17px] font-bold text-yellow-400">
            <Terminal size={20} />
            <span>Arduino Serial Monitor (COM5 @ {baud} baud)</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="press border border-white/40 bg-white/10 px-2 py-0.5 font-mono text-[13px] text-gray-300"
          >
            Clear
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 font-mono text-[17px] overflow-y-auto space-y-2 text-green-400">
          {logs.map((l, i) => (
            <div key={i} className="leading-relaxed">
              <span className="text-gray-500 text-[13px] mr-2">[{l.time}]</span>
              {l.type === "tx" && <span className="text-yellow-300 font-bold">TX ➔ {l.text}</span>}
              {l.type === "rx" && (
                <div className="text-emerald-300 whitespace-pre-line pl-4 border-l-2 border-emerald-600/40 my-1">
                  {l.text}
                </div>
              )}
              {l.type === "info" && <span className="text-cyan-400 italic">ℹ {l.text}</span>}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(cmdInput);
          }}
          className="border-t-2 border-ink bg-[#141622] p-3 flex gap-2"
        >
          <div className="flex-1 flex items-center gap-2 border-2 border-white/30 bg-black px-3 py-1 rounded">
            <span className="text-yellow-400 font-mono font-bold text-[18px]">{">"}</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              placeholder="Type AT command and press Enter..."
              className="flex-1 bg-transparent text-white font-mono text-[17px] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="press hard-sm border-2 border-ink bg-pop px-5 py-1.5 font-bold text-[17px] text-ink flex items-center gap-1.5"
          >
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   2. REWORKED INTERACTIVE GSM SECURITY ALARM & CALLING/SMS SIMULATOR
   ========================================================================= */
export function GSMSecuritySystemDemo() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phoneCallActive, setPhoneCallActive] = useState(false);
  const [smsDelivered, setSmsDelivered] = useState(false);

  const tripSensor = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
      setPhoneCallActive(true);
    }, 1200);
  };

  const answerCall = () => {
    setPhoneCallActive(false);
    setStep(4);
    setTimeout(() => {
      setSmsDelivered(true);
    }, 1000);
  };

  const resetAll = () => {
    setStep(1);
    setPhoneCallActive(false);
    setSmsDelivered(false);
  };

  return (
    <div className="grid grid-cols-[1.25fr_1.1fr] gap-8">
      {/* Left: 4-Step Narrative Flow & 16x2 LCD */}
      <div className="space-y-4">
        <DemoPanel>
          <DemoHeader title="Exam Cell Security System (Step-by-Step)" badge={`Step ${step} of 4`} icon={ShieldAlert} />

          {/* 4 Step Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mb-4 text-center font-bold text-[15px]">
            <div className={`p-2 border-2 border-ink rounded ${step === 1 ? "bg-pop text-ink" : "bg-panel2 text-mute"}`}>
              1. Standby
            </div>
            <div className={`p-2 border-2 border-ink rounded ${step === 2 ? "bg-hot text-white" : "bg-panel2 text-mute"}`}>
              2. Sensor Trip
            </div>
            <div className={`p-2 border-2 border-ink rounded ${step === 3 ? "bg-accent text-white" : "bg-panel2 text-mute"}`}>
              3. Voice Call
            </div>
            <div className={`p-2 border-2 border-ink rounded ${step === 4 ? "bg-sky text-white" : "bg-panel2 text-mute"}`}>
              4. SMS Alert
            </div>
          </div>

          {/* Realistic 16x2 LCD Display */}
          <div className="border-4 border-ink bg-[#001830] p-4 rounded-lg shadow-lg">
            <div className="text-[12px] font-mono text-cyan-400/70 mb-1 flex justify-between">
              <span>HD44780 16x2 LCD DISPLAY</span>
              <span>PIN: 12, 11, 5, 4, 3, 2</span>
            </div>
            <div className="border-2 border-cyan-800 bg-[#002b49] p-3.5 rounded font-mono font-bold tracking-widest text-[28px] text-cyan-200 shadow-inner flex flex-col gap-1">
              <div>
                {step >= 2 ? " QUESTION PAPER " : "   EXAM CELL    "}
              </div>
              <div className="text-yellow-300">
                {step >= 2 ? "LEAKED BE ALERT " : "NORMAL CONDITION"}
              </div>
            </div>
          </div>

          {/* Interactive Control Trigger */}
          <div className="mt-4 flex items-center justify-between hard-sm border-2 border-ink bg-panel2 p-4">
            <div>
              <div className="text-[20px] font-bold text-ink">
                {step === 1 && "Locker Sensor: Secure (Pin 7 LOW)"}
                {step === 2 && "🚨 Sensor Tripped! (Pin 7 HIGH)"}
                {step === 3 && "📞 Dialing Controller (ATD9994442064;)"}
                {step === 4 && "✉️ SMS Dispatched via AT+CMGS"}
              </div>
              <div className="text-[16px] text-mute">Simulates intruder opening confidential exam vault</div>
            </div>

            {step === 1 ? (
              <button
                onClick={tripSensor}
                className="press hard-sm border-2 border-ink bg-hot text-white px-5 py-2.5 font-extrabold text-[18px] flex items-center gap-2"
              >
                <AlertTriangle size={20} /> Open Locker Door
              </button>
            ) : (
              <button
                onClick={resetAll}
                className="press hard-sm border-2 border-ink bg-sky text-white px-5 py-2.5 font-extrabold text-[18px] flex items-center gap-2"
              >
                <RotateCcw size={20} /> Reset Security
              </button>
            )}
          </div>
        </DemoPanel>
      </div>

      {/* Right: Virtual Smartphone with Live Incoming Call & SMS */}
      <div>
        <DemoPanel className="bg-panel2 flex flex-col items-center">
          <DemoHeader title="Controller's Phone" badge="Outcome Screen" icon={Phone} />

          <div className="w-[320px] border-4 border-ink bg-black p-3.5 rounded-[32px] shadow-2xl text-white">
            <div className="flex justify-center mb-2">
              <div className="h-3.5 w-24 bg-gray-800 rounded-full" />
            </div>

            <div className="border-2 border-gray-700 bg-gray-900 rounded-[20px] p-4 min-h-[380px] flex flex-col justify-between">
              <div className="flex justify-between items-center text-[12px] text-gray-400 font-mono">
                <span>Airtel 4G</span>
                <span>12:45 PM</span>
                <span>🔋 90%</span>
              </div>

              {phoneCallActive ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-3 my-auto"
                >
                  <div className="h-16 w-16 rounded-full border-2 border-hot bg-hot/20 flex items-center justify-center animate-pulse">
                    <PhoneCall size={32} className="text-hot" />
                  </div>
                  <div>
                    <div className="text-[12px] text-red-400 font-bold uppercase">Incoming Emergency Alert</div>
                    <div className="text-[20px] font-bold text-white">Exam Cell Vault</div>
                    <div className="text-[14px] font-mono text-gray-400">+91 9994442064</div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={answerCall}
                      className="press h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg"
                    >
                      <Phone size={22} />
                    </button>
                    <button
                      onClick={() => setPhoneCallActive(false)}
                      className="press h-12 w-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg"
                    >
                      <PhoneOff size={22} />
                    </button>
                  </div>
                </motion.div>
              ) : smsDelivered ? (
                <div className="space-y-3 my-auto">
                  <div className="text-[12px] font-bold text-center text-gray-400 uppercase">Emergency SMS Delivered</div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="border-2 border-red-500 bg-red-950/90 p-3 rounded-xl text-left"
                  >
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-red-400">
                      <MessageSquare size={14} /> FROM: EXAM_SECURITY
                    </div>
                    <div className="text-[15px] text-white mt-1 leading-snug">
                      🚨 Exam cell-Question paper Leaked: Alert at Locker 04! Security dispatched.
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center my-auto space-y-2 text-gray-500">
                  <ShieldCheck size={44} className="mx-auto text-emerald-400/60" />
                  <div className="text-[15px]">All security lines normal.</div>
                  <div className="text-[12px]">Trip sensor on left to initiate alert chain.</div>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <div className="h-1 w-20 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

/* =========================================================================
   3. REWORKED SMS-BASED APPLIANCE / VEHICLE CONTROLLER (PAGE 12)
   ========================================================================= */
export function SMSApplianceControlDemo() {
  const [relayState, setRelayState] = useState(false);
  const [lcdMsg, setLcdMsg] = useState({ l1: "Enter Password  ", l2: "through GSM     " });
  const [uartBuffer, setUartBuffer] = useState<string[]>([]);
  const [customSms, setCustomSms] = useState("#12");

  const sendSMS = (code: string) => {
    const fullIncoming = `+CMT: "+918344578121",,"26/10/08,15:30:00+22"\r\n${code}`;
    setUartBuffer((prev) => [...prev.slice(-2), fullIncoming]);

    if (code === "#12") {
      setLcdMsg({ l1: "PASSWORD OK     ", l2: "****************" });
      setRelayState(true);
      setTimeout(() => {
        setLcdMsg({ l1: "Safe & Security ", l2: " TWO WHEELER ON " });
      }, 2500);
    } else if (code === "#00") {
      setLcdMsg({ l1: "POWER OFF OK    ", l2: "TWO WHEELER OFF " });
      setRelayState(false);
    } else {
      setLcdMsg({ l1: "WRONG PASSWORD  ", l2: "ACCESS DENIED   " });
      setTimeout(() => {
        setLcdMsg({ l1: "Enter Password  ", l2: "through GSM     " });
      }, 2500);
    }
  };

  return (
    <div className="grid grid-cols-[1.1fr_1.3fr] gap-8">
      {/* Left: Virtual Phone to Send SMS Commands */}
      <div className="space-y-4">
        <DemoPanel>
          <DemoHeader title="Send Control SMS" badge="Remote User" icon={MessageSquare} />

          <div className="space-y-3">
            <div className="text-[19px] leading-snug">
              Select or compose an SMS command to transmit over GSM to the Arduino receiver:
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => sendSMS("#12")}
                className="press hard-sm border-2 border-ink bg-sky-soft p-3 text-left font-bold"
              >
                <div className="text-[19px] text-sky font-extrabold">Send &quot;#12&quot;</div>
                <div className="text-[15px] text-mute">Unlock Vehicle / Turn ON Relay</div>
              </button>

              <button
                onClick={() => sendSMS("#00")}
                className="press hard-sm border-2 border-ink bg-warm-soft p-3 text-left font-bold"
              >
                <div className="text-[19px] text-warm font-extrabold">Send &quot;#00&quot;</div>
                <div className="text-[15px] text-mute">Lock Vehicle / Turn OFF Relay</div>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSms}
                onChange={(e) => setCustomSms(e.target.value)}
                placeholder="Type SMS (e.g. #12)"
                className="flex-1 border-2 border-ink px-3 py-1.5 text-[18px] font-mono font-bold"
              />
              <button
                onClick={() => sendSMS(customSms)}
                className="press hard-sm border-2 border-ink bg-pop px-5 py-1.5 text-[17px] font-extrabold flex items-center gap-1.5"
              >
                <Send size={16} /> Send SMS
              </button>
            </div>
          </div>

          {/* Incoming Serial Stream Trace */}
          <div className="mt-4 border-t-2 border-ink pt-3">
            <div className="text-[15px] font-bold text-mute uppercase mb-1">
              Raw GSM UART Feed (AT+CNMI=2,2,0,0):
            </div>
            <div className="border-2 border-ink bg-[#14142a] p-2.5 font-mono text-[14px] text-emerald-300 min-h-[75px]">
              {uartBuffer.length === 0 ? (
                <span className="text-gray-500">Awaiting incoming SMS packets...</span>
              ) : (
                uartBuffer.map((b, i) => <div key={i} className="whitespace-pre-line border-b border-white/10 pb-1">{b}</div>)
              )}
            </div>
          </div>
        </DemoPanel>
      </div>

      {/* Right: Arduino Controller, 16x2 LCD & High-Voltage Relay/Appliance */}
      <div className="space-y-4">
        <DemoPanel className="bg-panel2">
          <DemoHeader title="Appliance / Two-Wheeler Receiver" badge="Arduino Pin A0 / 13" icon={Zap} />

          {/* LCD Display */}
          <div className="border-4 border-ink bg-[#001830] p-3.5 rounded-lg shadow-md mb-4">
            <div className="text-[12px] font-mono text-cyan-400/70 mb-1 flex justify-between">
              <span>HD44780 16x2 LCD</span>
              <span>check1() String Parser</span>
            </div>
            <div className="border-2 border-cyan-800 bg-[#002b49] p-3 rounded font-mono font-bold tracking-widest text-[24px] text-cyan-200 shadow-inner flex flex-col gap-1">
              <div>{lcdMsg.l1}</div>
              <div className="text-yellow-300">{lcdMsg.l2}</div>
            </div>
          </div>

          {/* Actuator & Relay Section */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="hard-sm border-2 border-ink bg-white p-3.5">
              <div className="text-[15px] font-bold text-mute mb-1">5V OPTO-ISOLATED RELAY</div>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded border-2 border-ink flex items-center justify-center font-bold text-[14px] ${relayState ? "bg-sky text-white" : "bg-gray-300 text-gray-700"}`}>
                  {relayState ? "ON" : "OFF"}
                </div>
                <div className="font-mono text-[15px]">
                  <div>Pin A0: <b>{relayState ? "HIGH (5V)" : "LOW (0V)"}</b></div>
                  <div className="text-gray-500">{relayState ? "Contacts CLOSED" : "Contacts OPEN"}</div>
                </div>
              </div>
            </div>

            <div className={`hard-sm border-2 border-ink p-3.5 flex items-center gap-3 transition-all ${relayState ? "bg-pop-soft" : "bg-white"}`}>
              <div className={`h-14 w-14 rounded-full border-2 border-ink flex items-center justify-center transition-all ${relayState ? "bg-yellow-400 shadow-[0_0_20px_#facc15]" : "bg-gray-200"}`}>
                <Lightbulb size={32} className={relayState ? "text-ink" : "text-gray-400"} />
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-ink">
                  {relayState ? "⚡ Appliance ACTIVE" : "⚪ Appliance OFF"}
                </div>
                <div className="text-[14px] text-mute">
                  {relayState ? "Ignition unlocked" : "System locked"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 border-2 border-ink bg-white text-[16px] leading-snug">
            <b>Parsing Logic:</b> Detects <code className="bg-pop px-1 font-mono">#</code> ➔ verifies next bytes <code className="bg-pop px-1 font-mono">1</code> &amp; <code className="bg-pop px-1 font-mono">2</code> ➔ fires <code className="bg-pop px-1 font-mono">digitalWrite(A0, HIGH)</code> ➔ purges SIM with <code className="bg-pop px-1 font-mono">AT+CMGD=1,4</code>.
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

/* =========================================================================
   4. CLOUD COMPUTING ARCHITECTURE EXPLORER (PDF Page 21)
   ========================================================================= */
export function CloudArchitectureDemo() {
  const [selectedLayer, setSelectedLayer] = useState<string>("saas");

  const layersInfo: Record<string, { title: string; category: string; desc: string; examples: string; iotRole: string; color: string }> = {
    frontend: {
      title: "Client Infrastructure (Frontend)",
      category: "Frontend Platform",
      desc: "User interfaces, web browsers, and client devices used to interact with cloud services.",
      examples: "Google Chrome, Mobile Apps, Dashboards, Thin Clients",
      iotRole: "Displays real-time sensor graphs, provides operator buttons to actuate remote machines.",
      color: "bg-sky-soft text-sky"
    },
    internet: {
      title: "Internet / Network Bridge",
      category: "Network Medium",
      desc: "The global interconnection medium that connects frontend clients and edge devices to backend cloud datacenters.",
      examples: "TLS/HTTPS, WebSockets, MQTT Broker over Port 1883/8883, Cellular 4G/5G Gateways",
      iotRole: "Transports sensor packets from remote GSM/ESP32 devices to cloud ingestion servers.",
      color: "bg-warm-soft text-warm"
    },
    application: {
      title: "Application Layer (Backend)",
      category: "Backend Platform",
      desc: "Software and platforms that clients access to execute business logic, rules, and telemetry processing.",
      examples: "REST APIs, GraphQL endpoints, Alert Rules Engine, Video stream processing",
      iotRole: "Evaluates threshold rules (e.g. if Temperature > 45°C, send Telegram alert).",
      color: "bg-accent-soft text-accent"
    },
    service: {
      title: "Service Layer (SaaS · PaaS · IaaS)",
      category: "Cloud Delivery Services",
      desc: "Orchestrates service distribution across IaaS (virtualized hardware), PaaS (app runtime), and SaaS (ready software).",
      examples: "Adafruit IO, AWS Elastic Beanstalk, Google Cloud Functions, Azure App Services",
      iotRole: "Provides plug-and-play IoT ingestion feeds without needing manual server provisioning.",
      color: "bg-pop-soft text-ink"
    },
    runtime: {
      title: "Cloud Runtime",
      category: "Execution Environment",
      desc: "Provides the virtualized execution environment and runtime platform for virtual machines and containerized tasks.",
      examples: "KVM, Docker Containers, Kubernetes clusters, JVM / Node.js runtimes",
      iotRole: "Executes microservices handling real-time data streaming and AI model inference on sensor data.",
      color: "bg-sky-soft text-sky"
    },
    storage: {
      title: "Cloud Storage",
      category: "Data & Persistence",
      desc: "Scalable, redundant storage services for persistent structured, unstructured, and time-series sensor data.",
      examples: "Amazon S3, MongoDB, InfluxDB (Time-series), Google Cloud SQL, Azure Blob",
      iotRole: "Stores millions of historical sensor readings for trend analysis, predictive maintenance, and compliance.",
      color: "bg-warm-soft text-warm"
    },
    infrastructure: {
      title: "Cloud Infrastructure",
      category: "Physical & Virtual Hardware",
      desc: "Physical servers, enterprise storage arrays, high-speed networking switches, and hypervisors inside datacenters.",
      examples: "AWS EC2 instances, Google Datacenters, Bare-metal Xeon/EPYC clusters, SAN storage",
      iotRole: "Provides the raw compute horsepower and multi-gigabit network pipes underpinning the entire cloud.",
      color: "bg-accent-soft text-accent"
    },
    management: {
      title: "Management Component",
      category: "Governance & Orchestration",
      desc: "Coordinates resources, allots compute to specific tasks, manages traffic routing, and monitors health.",
      examples: "AWS CloudWatch, Kubernetes Control Plane, Auto-scaling Groups, Cost billing dashboards",
      iotRole: "Dynamically spins up new broker instances when a million new smart meters connect simultaneously.",
      color: "bg-hot-soft text-hot"
    },
    security: {
      title: "Security Component",
      category: "Protection & Compliance",
      desc: "Implements security management, virtual firewalls, TLS certificate auth, and encryption to prevent data loss.",
      examples: "AWS IAM, OAuth 2.0 / JWT, Cloudflare DDoS shield, Hardware Security Modules (HSM)",
      iotRole: "Ensures only authorized hardware with valid AIO Keys or certificates can publish telemetry.",
      color: "bg-hot-soft text-hot"
    }
  };

  const active = layersInfo[selectedLayer] || layersInfo.frontend;

  return (
    <div className="grid grid-cols-[1.3fr_1.1fr] gap-8 items-start">
      <DemoPanel className="bg-panel2">
        <DemoHeader title="Internal Architecture of Cloud Computing" badge="Multi-Tier Core" icon={Layers} />

        <div className="space-y-3 font-sans">
          <div className="border-2 border-ink bg-white p-3 rounded hard-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-[17px] text-sky uppercase">FRONTEND</span>
              <span className="text-[13px] text-mute">Client Side GUI</span>
            </div>
            <button
              onClick={() => setSelectedLayer("frontend")}
              className={`press w-full border-2 border-ink py-2 text-[19px] font-bold ${selectedLayer === "frontend" ? "bg-sky text-white" : "bg-sky-soft text-ink"}`}
            >
              💻 Client Infrastructure (Browser / Mobile / Devices)
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => setSelectedLayer("internet")}
              className={`press px-5 py-1.5 border-2 border-ink rounded-full text-[16px] font-bold flex items-center gap-2 ${selectedLayer === "internet" ? "bg-warm text-white" : "bg-warm-soft text-ink"}`}
            >
              ☁️ Internet Medium &amp; Protocols (MQTT / HTTP / TLS) ☁️
            </button>
          </div>

          <div className="border-4 border-ink bg-white p-4 rounded-lg hard relative">
            <div className="text-center font-extrabold text-[17px] text-accent uppercase mb-2">
              BACKEND PLATFORM (Cloud Service Provider)
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-stretch">
              <button
                onClick={() => setSelectedLayer("management")}
                className={`press border-2 border-ink px-3 py-3 flex flex-col items-center justify-center font-extrabold text-[16px] rounded ${selectedLayer === "management" ? "bg-hot text-white" : "bg-hot-soft text-ink"}`}
                style={{ writingMode: "vertical-rl" }}
              >
                ⚙️ MANAGEMENT
              </button>

              <div className="space-y-2">
                {[
                  { key: "application", label: "📱 Application", color: "bg-accent-soft text-ink" },
                  { key: "service", label: "🛠️ Service (SaaS / PaaS / IaaS)", color: "bg-pop-soft text-ink" },
                  { key: "runtime", label: "⚡ Cloud Runtime", color: "bg-sky-soft text-ink" },
                  { key: "storage", label: "💾 Storage (S3 / DB)", color: "bg-warm-soft text-ink" },
                  { key: "infrastructure", label: "🏢 Infrastructure (Servers & VM)", color: "bg-accent-soft text-ink" },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedLayer(key)}
                    className={`press w-full border-2 border-ink py-1.5 text-[18px] font-bold rounded ${selectedLayer === key ? "bg-accent text-white" : color}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedLayer("security")}
                className={`press border-2 border-ink px-3 py-3 flex flex-col items-center justify-center font-extrabold text-[16px] rounded ${selectedLayer === "security" ? "bg-hot text-white" : "bg-hot-soft text-ink"}`}
                style={{ writingMode: "vertical-rl" }}
              >
                🔒 SECURITY
              </button>
            </div>
          </div>
        </div>
      </DemoPanel>

      <div className="space-y-4">
        <DemoPanel className="min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-ink pb-2 mb-3">
              <span className="text-[15px] font-mono text-mute uppercase">{active.category}</span>
              <span className="border border-ink bg-pop px-2 py-0.5 font-bold text-[13px]">Selected Layer</span>
            </div>

            <h4 className="display text-[30px] font-extrabold text-ink mb-2">{active.title}</h4>

            <div className="space-y-3 text-[21px] leading-snug">
              <div>
                <b>Role &amp; Function:</b> {active.desc}
              </div>

              <div className="border-2 border-ink bg-panel2 p-2.5 text-[19px]">
                <b>Common Technologies:</b> <span className="font-mono text-[17px]">{active.examples}</span>
              </div>

              <div className="border-2 border-ink bg-pop-soft p-2.5 text-[19px]">
                <b>Role in IoT Systems:</b> {active.iotRole}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-ink text-mute text-[17px]">
            💡 Tap any block on the left to inspect its responsibility and architectural role.
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

/* =========================================================================
   5. SHARED RESPONSIBILITY STACK (IaaS vs PaaS vs SaaS vs On-Prem)
   ========================================================================= */
export function CloudServiceStackDemo() {
  const [model, setModel] = useState<"onprem" | "iaas" | "paas" | "saas">("iaas");

  const layers = [
    { name: "Applications", onprem: "user", iaas: "user", paas: "user", saas: "provider" },
    { name: "Data & Feeds", onprem: "user", iaas: "user", paas: "user", saas: "provider" },
    { name: "Runtime Environment", onprem: "user", iaas: "user", paas: "provider", saas: "provider" },
    { name: "Middleware & Queues", onprem: "user", iaas: "user", paas: "provider", saas: "provider" },
    { name: "Operating System", onprem: "user", iaas: "user", paas: "provider", saas: "provider" },
    { name: "Virtualization / Hypervisor", onprem: "user", iaas: "provider", paas: "provider", saas: "provider" },
    { name: "Physical Servers", onprem: "user", iaas: "provider", paas: "provider", saas: "provider" },
    { name: "Storage Hardware", onprem: "user", iaas: "provider", paas: "provider", saas: "provider" },
    { name: "Datacenter Networking", onprem: "user", iaas: "provider", paas: "provider", saas: "provider" },
  ];

  const modelDetails = {
    onprem: {
      name: "On-Premises Private DC",
      sub: "You manage 100% of everything.",
      cost: "Very high upfront CapEx",
      examples: "Private Server Rack, VMware ESXi",
      iotUse: "High security defense systems requiring zero external internet exposure."
    },
    iaas: {
      name: "IaaS (Infrastructure as a Service)",
      sub: "Provider manages hardware; You manage OS upwards.",
      cost: "Pay-as-you-go per VM/hour",
      examples: "AWS EC2, Microsoft Azure VMs, Google Compute Engine",
      iotUse: "Custom large-scale MQTT brokers (Mosquitto/EMQX) with custom clustering."
    },
    paas: {
      name: "PaaS (Platform as a Service)",
      sub: "Provider manages OS & runtime; You focus only on code & data.",
      cost: "Pay per execution / container memory",
      examples: "Google App Engine, Heroku, AWS Elastic Beanstalk, Azure App Service",
      iotUse: "Rapidly deploying IoT API ingestion servers without server maintenance."
    },
    saas: {
      name: "SaaS (Software as a Service)",
      sub: "Provider manages the entire application stack.",
      cost: "Subscription / per-device tier",
      examples: "Adafruit IO, Microsoft 365, Salesforce, ThingSpeak",
      iotUse: "Plug-and-play dashboards, feeds, charts, and triggers with zero code."
    }
  };

  const cur = modelDetails[model];

  return (
    <div className="grid grid-cols-[1.1fr_1.3fr] gap-8">
      <div className="space-y-4">
        <DemoPanel>
          <DemoHeader title="Service Model Selector" badge="Cloud Taxonomy" icon={Server} />

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { id: "onprem", label: "On-Premises" },
              { id: "iaas", label: "IaaS (VMs)" },
              { id: "paas", label: "PaaS (Platform)" },
              { id: "saas", label: "SaaS (Adafruit IO)" },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setModel(b.id as any)}
                className={`press hard-sm border-2 border-ink py-2.5 text-[21px] font-extrabold ${model === b.id ? "bg-accent text-white" : "bg-white text-ink"}`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="hard-sm border-2 border-ink bg-panel2 p-4 space-y-2 text-[19px]">
            <div className="display text-[26px] font-extrabold text-accent">{cur.name}</div>
            <div><b>Summary:</b> {cur.sub}</div>
            <div><b>Pricing Model:</b> {cur.cost}</div>
            <div><b>Examples:</b> <span className="font-mono text-[17px]">{cur.examples}</span></div>
            <div className="border-t border-ink/20 pt-1.5 text-mute">
              <b>IoT Application:</b> {cur.iotUse}
            </div>
          </div>
        </DemoPanel>
      </div>

      <div>
        <DemoPanel className="bg-panel2">
          <DemoHeader title="Shared Responsibility Breakdown" badge={model.toUpperCase()} icon={Layers} />

          <div className="space-y-1.5">
            {layers.map((layer) => {
              const owner = layer[model];
              const isUser = owner === "user";
              return (
                <div
                  key={layer.name}
                  className={`flex items-center justify-between border-2 border-ink px-4 py-1.5 text-[19px] font-bold rounded transition-all ${
                    isUser ? "bg-sky-soft text-ink" : "bg-accent text-white"
                  }`}
                >
                  <span>{layer.name}</span>
                  <span
                    className={`border border-ink px-2.5 py-0.5 text-[14px] font-extrabold uppercase rounded ${
                      isUser ? "bg-white text-sky" : "bg-pop text-ink"
                    }`}
                  >
                    {isUser ? "👤 You Manage" : "☁️ Provider Manages"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between text-[15px] font-bold">
            <span className="flex items-center gap-1 text-sky">
              <span className="h-3 w-3 rounded-full bg-sky-soft border border-ink inline-block" /> You Manage
            </span>
            <span className="flex items-center gap-1 text-accent">
              <span className="h-3 w-3 rounded-full bg-accent border border-ink inline-block" /> Cloud Provider Manages
            </span>
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

/* =========================================================================
   6. IOT PROTOCOL PACKET BENCHMARK & WIRE INSPECTOR
   ========================================================================= */
export function IoTRuntimeProtocolsDemo() {
  const [selectedProto, setSelectedProto] = useState<"mqtt" | "http" | "coap" | "ws">("mqtt");
  const [packetCount, setPacketCount] = useState(1);
  const [tempVal, setTempVal] = useState(26.4);

  const protoData = {
    mqtt: {
      name: "MQTT (Message Queuing Telemetry Transport)",
      headerSize: 2,
      transport: "TCP (Port 1883 / 8883 TLS)",
      pattern: "Publish / Subscribe",
      qos: "0, 1 (At least once), 2 (Exactly once)",
      batteryImpact: "Lowest (Persistent keep-alive, tiny overhead)",
      samplePacket: `0x30 0x16 0x00 0x0C "sensors/temp" 0x32 0x36 0x2E 0x34`,
      overheadPct: "8%",
      idealFor: "Telemetry streaming from low-power Arduino/ESP32 devices."
    },
    http: {
      name: "HTTP / REST API",
      headerSize: 850,
      transport: "TCP (Port 80 / 443 HTTPS)",
      pattern: "Request / Response (Client Pull)",
      qos: "None built-in (Application retry required)",
      batteryImpact: "Heavy (3-way TCP handshake + TLS negotiation every POST)",
      samplePacket: `POST /api/v2/feeds/temp HTTP/1.1\\r\\nHost: io.adafruit.com\\r\\nX-AIO-Key: aio_123\\r\\nContent-Type: application/json\\r\\nContent-Length: 17\\r\\n\\r\\n{"value": 26.4}`,
      overheadPct: "98%",
      idealFor: "Occasional bulk firmware uploads or web browser queries."
    },
    coap: {
      name: "CoAP (Constrained Application Protocol)",
      headerSize: 4,
      transport: "UDP (Port 5683 / 5684 DTLS)",
      pattern: "Req/Res + Pub/Sub over UDP",
      qos: "Confirmable (CON) / Non-confirmable (NON)",
      batteryImpact: "Very Low (No TCP handshake overhead)",
      samplePacket: `0x40 0x02 0x12 0x34 "temp" 0xFF 0x32 0x36 0x2E 0x34`,
      overheadPct: "14%",
      idealFor: "Extremely constrained 8-bit MCUs and 6LoWPAN mesh networks."
    },
    ws: {
      name: "WebSocket",
      headerSize: 6,
      transport: "TCP (Port 80 / 443)",
      pattern: "Full-Duplex Bidirectional Stream",
      qos: "TCP reliable streaming",
      batteryImpact: "Medium (Requires open TCP socket)",
      samplePacket: `0x81 0x85 0x37 0xFA 0x21 0x3D 0x53 0x7E 0x48`,
      overheadPct: "12%",
      idealFor: "Live real-time dashboards in web browsers."
    }
  };

  const p = protoData[selectedProto];
  const payloadSize = 16;
  const totalPerMsg = p.headerSize + payloadSize;
  const totalTransferred = (totalPerMsg * packetCount) / 1024;

  return (
    <div className="grid grid-cols-[1.1fr_1.3fr] gap-8">
      <div className="space-y-4">
        <DemoPanel>
          <DemoHeader title="IoT Protocol Shootout" badge="Benchmark" icon={Activity} />

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { id: "mqtt", label: "MQTT (Pub/Sub)" },
              { id: "http", label: "HTTP / REST" },
              { id: "coap", label: "CoAP (UDP)" },
              { id: "ws", label: "WebSocket" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedProto(item.id as any)}
                className={`press hard-sm border-2 border-ink py-2 text-[19px] font-bold ${selectedProto === item.id ? "bg-pop text-ink" : "bg-white text-ink"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 border-2 border-ink bg-panel2 p-4 text-[19px]">
            <div className="display text-[24px] font-extrabold text-accent">{p.name}</div>
            <div className="flex justify-between border-b border-ink/20 pb-1">
              <span className="text-mute">Header Overhead:</span>
              <span className="font-mono font-bold text-accent">{p.headerSize} Bytes</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 pb-1">
              <span className="text-mute">Transport:</span>
              <span className="font-mono font-bold text-ink">{p.transport}</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 pb-1">
              <span className="text-mute">Architecture:</span>
              <span className="font-bold text-ink">{p.pattern}</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 pb-1">
              <span className="text-mute">QoS Guarantees:</span>
              <span className="font-bold text-sky">{p.qos}</span>
            </div>
            <div className="pt-1 text-[17px]">
              <b>Best For:</b> {p.idealFor}
            </div>
          </div>
        </DemoPanel>
      </div>

      <div className="space-y-4">
        <DemoPanel className="bg-panel2">
          <DemoHeader title="Packet Inspector & Payload Visualizer" badge="Wire Frame" icon={Terminal} />

          <div className="space-y-2 mb-3">
            <div className="text-[15px] font-bold text-mute uppercase">Packet Header vs Data Payload:</div>
            <div className="flex border-2 border-ink rounded overflow-hidden text-center font-mono font-bold text-[15px]">
              <div
                className="bg-accent text-white p-2 flex items-center justify-center"
                style={{ width: `${Math.max(15, Math.min(85, (p.headerSize / totalPerMsg) * 100))}%` }}
              >
                Header ({p.headerSize}B)
              </div>
              <div className="bg-pop text-ink p-2 flex-1 flex items-center justify-center">
                Payload ({payloadSize}B: {tempVal}°C)
              </div>
            </div>
          </div>

          <div className="border-2 border-ink bg-[#14142a] p-3 rounded font-mono text-[14px] text-emerald-300 overflow-x-auto">
            <div className="text-gray-400 text-[12px] mb-1">// Raw Frame Sent Over Wire:</div>
            <pre className="whitespace-pre-wrap">{p.samplePacket}</pre>
          </div>

          <div className="mt-3 border-2 border-ink bg-white p-3.5 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[17px] font-bold">Transmit Frequency:</span>
              <span className="font-mono font-bold text-[19px] text-accent">
                {packetCount.toLocaleString()} readings / day
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={500}
              value={packetCount}
              onChange={(e) => setPacketCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ink/20">
              <div className="hard-sm border-2 border-ink bg-accent-soft p-2 text-center">
                <div className="text-[13px] text-mute font-bold">Daily Cellular Data</div>
                <div className="display text-[24px] font-extrabold text-accent">
                  {totalTransferred > 1024 ? `${(totalTransferred / 1024).toFixed(2)} MB` : `${totalTransferred.toFixed(1)} KB`}
                </div>
              </div>

              <div className="hard-sm border-2 border-ink bg-sky-soft p-2 text-center">
                <div className="text-[13px] text-mute font-bold">Efficiency Score</div>
                <div className="display text-[24px] font-extrabold text-sky">
                  {selectedProto === "mqtt" ? "99.2% (Optimal)" : selectedProto === "http" ? "14.1% (Wasteful)" : "92.5% (High)"}
                </div>
              </div>
            </div>
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

/* =========================================================================
   7. REWORKED ADAFRUIT IO CLOUD VIRTUAL LAB & LIVE DASHBOARD
   ========================================================================= */
export function AdafruitIOVirtualLabDemo() {
  const [temperature, setTemperature] = useState(29.5);
  const [humidity, setHumidity] = useState(64);
  const [ledControlFeed, setLedControlFeed] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [thresholdAlert, setThresholdAlert] = useState(35.0);
  const [history, setHistory] = useState<number[]>([27, 28, 28.5, 29, 29.5]);
  const [cloudLogs, setCloudLogs] = useState<{ topic: string; payload: string; time: string }[]>([
    { topic: "manis/feeds/temperature", payload: "29.5 °C", time: "12:00:01" },
    { topic: "manis/feeds/humidity", payload: "64 %", time: "12:00:01" },
  ]);

  const alertTriggered = temperature >= thresholdAlert;

  useEffect(() => {
    let timer: any;
    if (autoPublish) {
      timer = setInterval(() => {
        const newTemp = Number((26 + Math.random() * 12).toFixed(1));
        const newHum = Math.round(50 + Math.random() * 25);
        setTemperature(newTemp);
        setHumidity(newHum);
        setHistory((prev) => [...prev.slice(-7), newTemp]);
        publishData(newTemp, newHum);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [autoPublish]);

  const publishData = (t: number, h: number) => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    setCloudLogs((prev) => [
      ...prev.slice(-3),
      { topic: "manis/feeds/temperature", payload: `${t} °C`, time: timeStr },
      { topic: "manis/feeds/humidity", payload: `${h} %`, time: timeStr }
    ]);
  };

  const toggleCloudLed = () => {
    const nextState = !ledControlFeed;
    setLedControlFeed(nextState);
    const timeStr = new Date().toTimeString().split(" ")[0];
    setCloudLogs((prev) => [
      ...prev.slice(-3),
      { topic: "manis/feeds/led", payload: nextState ? "ON (1)" : "OFF (0)", time: timeStr }
    ]);
  };

  return (
    <div className="grid grid-cols-[1.1fr_1.35fr] gap-8">
      {/* Left: ESP32 Edge Hardware Node */}
      <div className="space-y-4">
        <DemoPanel className="bg-panel2">
          <DemoHeader title="ESP32 / Feather Node" badge="MQTT Client" icon={Cpu} />

          <div className="space-y-3.5">
            <div className="border-2 border-ink bg-white p-3.5 rounded space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-[19px] font-bold">
                  <Thermometer className="text-warm" size={22} /> DHT22 Temperature:
                </span>
                <span className="font-mono text-[24px] font-extrabold text-warm">{temperature}°C</span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={0.5}
                value={temperature}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setTemperature(v);
                  setHistory((prev) => [...prev.slice(-7), v]);
                  if (!autoPublish) publishData(v, humidity);
                }}
                className="w-full accent-orange-500"
              />

              <div className="flex justify-between items-center pt-1">
                <span className="flex items-center gap-1.5 text-[19px] font-bold">
                  <Droplets className="text-sky" size={22} /> DHT22 Humidity:
                </span>
                <span className="font-mono text-[24px] font-extrabold text-sky">{humidity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={95}
                value={humidity}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setHumidity(v);
                  if (!autoPublish) publishData(temperature, v);
                }}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Hardware Actuator Response: Bi-directional link */}
            <div className="border-2 border-ink bg-white p-3.5 rounded flex items-center justify-between">
              <div>
                <div className="text-[19px] font-bold text-ink">On-Board Actuator LED:</div>
                <div className="text-[15px] text-mute">Subscribed to <code>manis/feeds/led</code></div>
              </div>
              <div
                className={`h-14 w-14 rounded-full border-2 border-ink flex items-center justify-center transition-all ${
                  ledControlFeed ? "bg-yellow-400 shadow-[0_0_24px_#facc15]" : "bg-gray-200"
                }`}
              >
                <Lightbulb size={32} className={ledControlFeed ? "text-ink" : "text-gray-400"} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => publishData(temperature, humidity)}
                className="press hard-sm flex-1 border-2 border-ink bg-accent text-white py-2.5 text-[17px] font-extrabold flex items-center justify-center gap-1.5"
              >
                <Send size={18} /> Publish Telemetry
              </button>
              <button
                onClick={() => setAutoPublish(!autoPublish)}
                className={`press hard-sm border-2 border-ink px-4 py-2.5 text-[17px] font-extrabold flex items-center gap-1.5 ${
                  autoPublish ? "bg-pop text-ink" : "bg-white text-ink"
                }`}
              >
                <RefreshCw size={18} className={autoPublish ? "animate-spin" : ""} />
                {autoPublish ? "Auto (3s)" : "Manual"}
              </button>
            </div>
          </div>
        </DemoPanel>
      </div>

      {/* Right: io.adafruit.com Cloud Dashboard */}
      <div className="space-y-4">
        <DemoPanel className="bg-[#141724] text-white">
          <DemoHeader title="io.adafruit.com Cloud Dashboard" badge="Live MQTT" icon={Cloud} />

          {/* Trigger Alert Notification Banner */}
          <AnimatePresence>
            {alertTriggered && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="border-2 border-hot bg-hot/30 p-2.5 rounded mb-3 flex items-center justify-between text-hot"
              >
                <div className="flex items-center gap-2 font-bold text-[16px]">
                  <Bell className="animate-bounce" size={20} />
                  <span>AIO TRIGGER: Temp &gt; {thresholdAlert}°C! Email &amp; Webhook Dispatched.</span>
                </div>
                <span className="text-[12px] bg-hot text-white px-2 py-0.5 rounded font-mono">Alert Fired</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Widgets Grid */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="border border-white/20 bg-black/40 p-2.5 rounded text-center">
              <div className="text-[13px] text-gray-400 font-mono">FEED: temperature</div>
              <div className="display text-[34px] font-extrabold text-orange-400 my-0.5">{temperature}°C</div>
              <div className="text-[11px] text-gray-400">Radial Gauge Block</div>
            </div>

            <div className="border border-white/20 bg-black/40 p-2.5 rounded text-center">
              <div className="text-[13px] text-gray-400 font-mono">FEED: humidity</div>
              <div className="display text-[34px] font-extrabold text-emerald-400 my-0.5">{humidity}%</div>
              <div className="text-[11px] text-gray-400">Time-series stream</div>
            </div>

            <div className="border border-white/20 bg-black/40 p-2.5 rounded text-center flex flex-col justify-between">
              <div className="text-[13px] text-gray-400 font-mono">FEED: led (Actuator)</div>
              <button
                onClick={toggleCloudLed}
                className={`press border-2 border-ink py-1.5 text-[16px] font-extrabold rounded ${
                  ledControlFeed ? "bg-pop text-ink shadow-[0_0_15px_#facc15]" : "bg-white/10 text-white"
                }`}
              >
                {ledControlFeed ? "💡 Switch ON" : "⚪ Switch OFF"}
              </button>
              <div className="text-[11px] text-gray-400">Publishes to ESP32</div>
            </div>
          </div>

          {/* Real-time Telemetry History Chart Canvas */}
          <div className="border border-white/20 bg-black p-3 rounded mb-3">
            <div className="flex justify-between items-center text-[12px] text-gray-400 font-mono mb-2">
              <span>LIVE TELEMETRY CHART (Last 8 Readings)</span>
              <span>Topic: manis/feeds/temperature</span>
            </div>
            <div className="flex items-end gap-2 h-14 pt-2">
              {history.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 to-yellow-400 rounded-t transition-all"
                    style={{ height: `${Math.min(100, Math.max(15, (val / 50) * 100))}%` }}
                  />
                  <span className="font-mono text-[11px] text-gray-400">{val}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live MQTT Stream Log */}
          <div className="border border-white/20 bg-black p-2.5 rounded font-mono text-[13px] space-y-1 text-emerald-400">
            <div className="text-gray-400 text-[11px] flex justify-between border-b border-white/10 pb-0.5">
              <span>MQTT INGESTION (io.adafruit.com:1883)</span>
              <span>Auth: manis / AIO_KEY</span>
            </div>
            {cloudLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-yellow-300">[{log.time}] PUB {log.topic}</span>
                <span className="text-white font-bold">{log.payload}</span>
              </div>
            ))}
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}
