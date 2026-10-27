import type { Slide } from "../types";
import { Bullets, Callout, Card, CodeBlock, Mono, Reveal, Table } from "../components/ui";
import { Wiring } from "../demos/Wiring";

const BT = "Bluetooth & HC-05";
const BD = "Arduino Boards";

export const wireless: Slide[] = [
  {
    section: BT, title: "Introduction to Bluetooth", steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1fr] gap-12">
        <Bullets step={s} items={[
          "Short-range wireless standard in the 2.4 GHz ISM band (IEEE 802.15.1).",
          "Uses frequency hopping (79 channels) to avoid interference.",
          "Typical range 10 m (Class 2), up to 100 m (Class 1); data rate up to ~3 Mbps (Classic EDR).",
          "Master–slave topology: a master can connect to up to 7 active slaves (a piconet).",
        ]} />
        <Reveal show={s >= 4}>
          <Table size="text-[26px]" head={["", "Classic", "BLE"]} rows={[
            ["Power", "higher", "very low"],
            ["Data", "streaming (SPP)", "small bursts"],
            ["Use", "audio, serial link", "wearables, beacons"],
            ["Module", "HC-05 / HC-06", "HM-10, nRF52"],
          ]} />
        </Reveal>
      </div>
    ),
  },
  {
    section: BT, title: "HC-05 Bluetooth module", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-2 gap-10">
        <Reveal show><Table size="text-[26px]" head={["Pin", "Function"]} rows={[
          ["VCC", "5 V supply (module has 3.3 V regulator)"],
          ["GND", "Ground"],
          ["TXD", "Module → Arduino (3.3 V logic)"],
          ["RXD", "Arduino → Module (needs 3.3 V!)"],
          ["EN / KEY", "HIGH at power-up → AT command mode"],
          ["STATE", "Connection status"],
        ]} /></Reveal>
        <div className="space-y-6">
          <Reveal show={s >= 1}><Card title="Serial Port Profile (SPP)" tone="sky">Behaves like a wireless UART cable: whatever you send over serial appears on the other device.</Card></Reveal>
          <Reveal show={s >= 2}><Card title="Roles" tone="accent">HC-05 can be <b>master or slave</b>; HC-06 is slave-only. Default data baud 9600, pairing PIN 1234 or 0000.</Card></Reveal>
          <Reveal show={s >= 3}><Callout kind="warn">Arduino TX is 5 V but the HC-05 RXD pin is 3.3 V. Use a divider: 1 kΩ in series, 2 kΩ to GND.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: BT, title: "Wiring HC-05 to Arduino Uno", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1fr] gap-10">
        <Wiring left="Arduino Uno" right="HC-05" wires={[
          { from: "5V", to: "VCC", color: "#ef4444" },
          { from: "GND", to: "GND", color: "#94a3b8" },
          { from: "D10 (RX)", to: "TXD", color: "#22c55e", note: "direct" },
          { from: "D11 (TX)", to: "RXD", color: "#60a5fa", note: "via 1k + 2k divider" },
        ]} />
        <div className="space-y-6">
          <Reveal show={s >= 1}><Callout kind="tip">We use <Mono>SoftwareSerial</Mono> on D10/D11 so the hardware serial (D0/D1) stays free for USB debugging and uploads.</Callout></Reveal>
          <Reveal show={s >= 2}><Callout kind="warn">If you wire HC-05 to D0/D1, <b>disconnect it while uploading</b> sketches.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: BT, title: "Control an LED from your phone", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-10">
        <CodeBlock size={20} title="BT_LED.ino" code={`#include <SoftwareSerial.h>

SoftwareSerial bt(10, 11);   // RX, TX
const int led = 13;

void setup() {
  pinMode(led, OUTPUT);
  bt.begin(9600);
  Serial.begin(9600);
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    Serial.println(c);
    if (c == '1') digitalWrite(led, HIGH);
    if (c == '0') digitalWrite(led, LOW);
  }
}`} />
        <div className="space-y-6">
          <Reveal show={s >= 0}><Card title="Phone steps" tone="sky"><ol className="list-decimal space-y-1 pl-8"><li>Pair with HC-05 (PIN 1234)</li><li>Open a Bluetooth serial terminal app</li><li>Connect, then send <Mono>1</Mono> or <Mono>0</Mono></li></ol></Card></Reveal>
          <Reveal show={s >= 1}><Callout kind="exam">Data path: Phone → Bluetooth → HC-05 TXD → Arduino D10 → <Mono>bt.read()</Mono> → LED.</Callout></Reveal>
          <Reveal show={s >= 2}><Table size="text-[20px]" head={["AT command", "Meaning"]} rows={[[<Mono>AT</Mono>, "test (→ OK)"], [<Mono>AT+NAME=Lab</Mono>, "set name"], [<Mono>AT+UART=9600,0,0</Mono>, "set baud"], [<Mono>AT+ROLE=0</Mono>, "0 slave / 1 master"]]} /></Reveal>
        </div>
      </div>
    ),
  },

  // ---------- Boards ----------
  {
    section: BD, title: "The Arduino family", steps: 5,
    body: (s) => (
      <Table size="text-[25px]" head={["Board", "MCU", "Logic", "Highlights"]} rows={[
        ["Uno R3", "ATmega328P", "5 V", "The standard starter board"],
        ["Nano", "ATmega328P", "5 V", "Breadboard-friendly, tiny"],
        ["Leonardo / Micro", "ATmega32U4", "5 V", "Native USB (acts as keyboard/mouse)"],
        ["Pro Mini", "ATmega328P", "3.3/5 V", "Minimal, no USB, for embedded builds"],
        ["LilyPad", "ATmega328P", "3.3 V", "Sewable, wearable projects"],
        ["Mega 2560", "ATmega2560", "5 V", "Lots of pins and memory"],
        ["Due", "SAM3X8E (ARM)", "3.3 V", "32-bit, 84 MHz, fastest"],
      ].slice(0, s + 3)} />
    ),
  },
  {
    section: BD, title: "Arduino Mega 2560", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1fr_1fr] gap-10">
        <Reveal show><Table size="text-[26px]" head={["Feature", "Mega 2560"]} rows={[
          ["Microcontroller", "ATmega2560 (8-bit)"],
          ["Clock", "16 MHz"],
          ["Operating / input V", "5 V / 7–12 V"],
          ["Digital I/O", "54 (15 PWM)"],
          ["Analog inputs", "16"],
          ["Flash / SRAM / EEPROM", "256 KB / 8 KB / 4 KB"],
          ["UARTs", "4 (Serial 0–3)"],
        ]} /></Reveal>
        <div className="space-y-6">
          <Reveal show={s >= 1}><Card title="Special pins" tone="sky">I²C: SDA 20, SCL 21 · SPI: 50–53 · Built-in LED: 13 · External interrupts: <b>2, 3, 18, 19, 20, 21</b>.</Card></Reveal>
          <Reveal show={s >= 2}><Card title="Why Mega?" tone="accent">Four hardware serials let you talk to HC-05, GPS and GSM at once without SoftwareSerial. Ideal for robots and 3D printers.</Card></Reveal>
          <Reveal show={s >= 3}><Callout kind="tip">Mega is pin-compatible with Uno shields for D0–D13 and A0–A5.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: BD, title: "Arduino Due", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1fr_1fr] gap-10">
        <Reveal show><Table size="text-[26px]" head={["Feature", "Arduino Due"]} rows={[
          ["Microcontroller", "Atmel SAM3X8E, ARM Cortex-M3 (32-bit)"],
          ["Clock", "84 MHz"],
          ["Operating voltage", "3.3 V (pins are NOT 5 V tolerant)"],
          ["Digital I/O", "54 (12 PWM)"],
          ["Analog in / out", "12 ADC (12-bit) / 2 DAC"],
          ["Flash / SRAM", "512 KB / 96 KB"],
          ["USB", "Programming + Native (host)"],
        ]} /></Reveal>
        <div className="space-y-6">
          <Reveal show={s >= 1}><Card title="What is special?" tone="accent">First Arduino with a 32-bit ARM core, a true DAC (analog output), CAN bus and DMA. Great for audio and fast control loops.</Card></Reveal>
          <Reveal show={s >= 2}><Callout kind="warn">Applying 5 V to any Due pin can <b>permanently damage</b> the board. Level-shift 5 V sensors.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: BD, title: "Uno vs Mega vs Due", steps: 1,
    body: (s) => (
      <div className="space-y-8">
        <Table size="text-[26px]" head={["", "Uno R3", "Mega 2560", "Due"]} rows={[
          ["CPU", "8-bit AVR 16 MHz", "8-bit AVR 16 MHz", "32-bit ARM 84 MHz"],
          ["Logic level", "5 V", "5 V", "3.3 V"],
          ["Digital pins (PWM)", "14 (6)", "54 (15)", "54 (12)"],
          ["Analog in", "6 × 10-bit", "16 × 10-bit", "12 × 12-bit"],
          ["Flash", "32 KB", "256 KB", "512 KB"],
          ["SRAM", "2 KB", "8 KB", "96 KB"],
          ["Serial ports", "1", "4", "4"],
        ]} />
        <Reveal show={s >= 1}><Callout kind="exam">Choose by need: <b>Uno</b> learning · <b>Mega</b> many I/O · <b>Due</b> speed &amp; precision (3.3 V!).</Callout></Reveal>
      </div>
    ),
  },
];
