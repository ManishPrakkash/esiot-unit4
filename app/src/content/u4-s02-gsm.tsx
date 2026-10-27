import { Radio, Zap, AlertTriangle, Cpu, Terminal, CheckCircle2, Sliders } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table, CodeBlock } from "../components/ui";
import { GSMTerminalDemo } from "../demos/Unit4Demos";
import { HardwareWiringSchematic } from "../components/Pictorials";

const S = "GSM Hardware & AT Commands";

export const gsmHardwareSlides: Slide[] = [
  // 1. GSM Modem Hardware Components & 2A Warning
  {
    section: S,
    title: "GSM-SIM900A & SIM800L Hardware Overview",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <div className="space-y-6">
          <Reveal show={s >= 0}>
            <p className="text-[34px] leading-snug">
              A <b className="text-accent">GSM GPRS MODEM</b> integrates a cellular baseband chip (SIMCom SIM900A / SIM800L) with a communication interface (UART/RS-232), SIM tray, antenna, and power supply circuitry.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <MasterDetail
              items={[
                {
                  title: "1. SIM900A / SIM800L Core",
                  tone: "accent",
                  detail: (
                    <>
                      The central baseband processor running GSM protocol firmware. Handles quad-band radio frequencies (850/900/1800/1900 MHz), audio processing, SMS engines, and GPRS TCP/IP stacks.
                    </>
                  ),
                },
                {
                  title: "2. SIM Card Slot",
                  tone: "sky",
                  detail: (
                    <>
                      Holds the Subscriber Identity Module (Micro-SIM or Nano-SIM with adapter). Stores IMSI (International Mobile Subscriber Identity), cryptographic authentication keys (Ki), and phonebook/SMS storage.
                    </>
                  ),
                },
                {
                  title: "3. SMA / IPX Antenna",
                  tone: "warm",
                  detail: (
                    <>
                      Ensures optimal RF reception (-108 dBm sensitivity). An omnidirectional helical or duck antenna prevents dropped calls and high packet error rates in GPRS transmission.
                    </>
                  ),
                },
                {
                  title: "4. UART Serial Interface",
                  tone: "hot",
                  detail: (
                    <>
                      Full-duplex serial communication interface (TX, RX, GND). Communicates with microcontrollers (Arduino Uno, ESP32, STM32) using standard ASCII AT commands at default 9600 or 115200 baud.
                    </>
                  ),
                },
              ]}
            />
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal show={s >= 2}>
            <Card title="⚡ Critical Power Supply Rules" tone="hot">
              <div className="space-y-3 text-[24px]">
                <div className="font-bold text-red-600">Peak Current Warning (2 Amperes):</div>
                <div>
                  GSM modules draw up to <b>2A peak current bursts</b> during RF transmission.
                </div>
                <div className="border-t border-ink/20 pt-2 text-[22px]">
                  <b>❌ DO NOT</b> power directly from the Arduino Uno 5V pin (regulator max is ~500 mA). It will cause brownouts and continuous reboots.
                </div>
                <div className="border-t border-ink/20 pt-2 text-[22px]">
                  <b>✅ USE</b> an external 12V 2A DC adapter or a 3.7V–4.2V LiPo battery / LM2596 buck converter with a 1000 µF low-ESR capacitor.
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal show={s >= 3}>
            <Callout kind="warn">
              Always tie the <b>GND pin of the GSM module</b> to the <b>GND pin of Arduino</b> to establish a common reference voltage for UART logic!
            </Callout>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 2. Interfacing GSM with Arduino Uno (Interactive Hardware Wiring Schematic)
  {
    section: S,
    title: "Interfacing GSM with Arduino Uno (Hardware Wiring Schematic)",
    steps: 2,
    body: (s) => (
      <div className="space-y-4">
        <Reveal show={s >= 0}>
          <p className="text-[28px] leading-snug">
            Interactive circuit schematic: Arduino connects to the GSM module via UART SoftwareSerial (Pins 2 &amp; 3) with common GND and external 4.0V 2A peak power buffering.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <HardwareWiringSchematic />
        </Reveal>
      </div>
    ),
  },

  // 3. Reworked Clean AT Commands Reference (Zero Overflow)
  {
    section: S,
    title: "Mastering GSM AT Commands (Attention Commands)",
    steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1.1fr] gap-8">
        <div className="space-y-4">
          <Reveal show={s >= 0}>
            <div className="hard border-2 border-ink bg-white p-5 space-y-3">
              <div className="display text-[24px] font-extrabold text-accent border-b-2 border-ink pb-1">
                Diagnostic &amp; Network Commands
              </div>
              <Table
                size="text-[20px]"
                head={["Command", "Expected", "Description"]}
                rows={[
                  ["AT", "OK", "Ping modem serial connectivity"],
                  ["AT+CSQ", "+CSQ: 24,0", "Signal quality (0-31; 15+ is strong)"],
                  ["AT+CREG?", "+CREG: 0,1", "Network registration status (1 = registered)"],
                  ["AT+CPIN?", "+CPIN: READY", "Verify SIM card is unlocked and ready"],
                  ["AT+CBC", "+CBC: 0,92,4140", "Battery status and voltage level (in mV)"],
                ]}
              />
            </div>
          </Reveal>

          <Reveal show={s >= 1}>
            <Callout kind="tip">
              Every AT command must be terminated with a Carriage Return (<code className="bg-pop px-1 font-mono">\r</code>) or Newline (<code className="bg-pop px-1 font-mono">\n</code>), which <code className="bg-pop px-1 font-mono">Serial.println()</code> automatically appends.
            </Callout>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal show={s >= 2}>
            <div className="hard border-2 border-ink bg-white p-5 space-y-3">
              <div className="display text-[24px] font-extrabold text-warm border-b-2 border-ink pb-1">
                Calling &amp; Messaging Commands
              </div>
              <Table
                size="text-[20px]"
                head={["Command", "Action", "Key Syntax Detail"]}
                rows={[
                  ["ATD<number>;", "Voice Dial Call", "Mandatory trailing semicolon for voice!"],
                  ["ATH", "Hang Up Call", "Disconnects active voice connection"],
                  ["AT+CMGF=1", "Set Text SMS", "Switches from binary PDU to ASCII text"],
                  ['AT+CMGS=".."', "Send SMS", "Requires Ctrl+Z (ASCII 26) to complete"],
                  ["AT+CNMI=2,2,0,0", "Stream SMS", "Directly outputs received SMS to UART"],
                  ["AT+CMGD=1,4", "Clear SIM SMS", "Deletes all messages from SIM memory"],
                ]}
              />
            </div>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 4. Interactive Live Simulator: GSM AT Command Terminal
  {
    section: S,
    title: "Interactive GSM AT Terminal & Hardware Lab",
    steps: 1,
    body: () => <GSMTerminalDemo />,
  },
];
