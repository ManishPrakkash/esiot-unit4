import type { Slide } from "../types";
import { Bullets, Callout, Card, CodeBlock, MasterDetail, Mono, Reveal, Table } from "../components/ui";

const S3 = "Development Stages";
const S4 = "Microcontrollers in IoT";
const S5 = "Arduino IDE";
const S6 = "Arduino Programming";

const stages: [string, string, string][] = [
  ["Use-case identification", "Define the problem, users and measurable value.", "A farmer wants to cut water use by 30 %."],
  ["Requirements", "Functional, power, range, cost, latency, environment.", "Soil readings every 15 min, battery lasts 1 year, range 500 m."],
  ["Hardware design", "Pick MCU, sensors, actuators, power; build the prototype and PCB.", "ESP32 + soil-moisture probe + relay board."],
  ["Firmware", "Write embedded code: drivers, logic, OTA-update support.", "Read the probe, average 10 samples, open the valve below 30 %."],
  ["Connectivity", "Choose Wi-Fi / BLE / LoRa / cellular and protocol (MQTT, HTTP, CoAP).", "Wi-Fi + MQTT to the farm gateway."],
  ["Cloud / backend", "Ingest, store, rules, device registry, APIs.", "Broker stores readings and runs a rule engine."],
  ["App development", "Web / mobile dashboards and control interfaces.", "Phone app shows moisture and a manual-override button."],
  ["Analytics", "Visualise, detect anomalies, predict with ML.", "Chart moisture trends; forecast when to irrigate."],
  ["Security", "Secure boot, encryption (TLS), authentication, key management.", "TLS to the cloud, signed firmware, unique device keys."],
  ["Integration & testing", "Unit, integration, range, power and field tests.", "Test in the lab, then in one field for a week."],
  ["Deployment", "Provision devices at scale, install, onboard.", "Flash and provision 200 nodes across the farm."],
  ["Monitoring & maintenance", "Health, OTA updates, support and lifecycle.", "Dashboard alerts when a node goes silent; push OTA fixes."],
];

export const dev: Slide[] = [
  {
    section: S3, title: "Why follow defined development stages?", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1.3fr_1fr] gap-16">
        <div className="space-y-8">
          <Bullets step={s} items={[
            "IoT spans hardware, firmware, network, cloud and apps: many teams, many failure points.",
            "A staged process catches design errors early, when they are cheap to fix.",
            "Security, power and scalability must be planned from the start, not added later.",
            "Devices live in the field for years, so maintenance and updates are part of the design.",
          ]} />
        </div>
        <Reveal show={s >= 3}><Callout kind="warn">A bug found after <b>deploying 10,000 devices</b> costs far more than one found on a breadboard.</Callout></Reveal>
      </div>
    ),
  },
  {
    section: S3, title: "12 stages: tap each one",
    body: () => (
      <MasterDetail cols={2} items={stages.map(([t, d, e], k) => ({
        title: `${k + 1}. ${t}`, tone: (["accent", "warm", "sky", "hot"] as const)[Math.floor(k / 3)],
        detail: <div className="space-y-6"><p>{d}</p><div className="border-2 border-ink bg-white p-5 text-[28px]"><b>Example: </b>{e}</div></div>,
      }))} />
    ),
  },
  {
    section: S3, title: "The stages as a loop", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-3 gap-8">
        <Reveal show={s >= 0}><Card title="Design" tone="sky">Use case → requirements → hardware. Decide <i>what</i> to build and <i>with what</i>.</Card></Reveal>
        <Reveal show={s >= 1}><Card title="Build" tone="accent">Firmware → connectivity → cloud → app → analytics. Make data flow end to end.</Card></Reveal>
        <Reveal show={s >= 2}><Card title="Run" tone="warm">Security & testing → deployment → monitoring. Feedback returns to design.</Card></Reveal>
        <div className="col-span-3"><Reveal show={s >= 3}><Callout kind="exam">IoT development is <b>iterative</b>: monitoring data from the field feeds the next design cycle.</Callout></Reveal></div>
      </div>
    ),
  },

  // ---------- Microcontrollers ----------
  {
    section: S4, title: "Microcontrollers used in IoT", steps: 1,
    body: (s) => (
      <div className="space-y-8">
        <Reveal show><p className="text-[34px] leading-snug">A <b className="text-accent">microcontroller (MCU)</b> is a single chip with CPU, memory (Flash + SRAM) and peripherals (GPIO, ADC, timers, UART, I²C, SPI). It is the 'brain' of an IoT node.</p></Reveal>
        <Reveal show={s >= 1}>
          <Table head={["Vendor", "Popular family", "Strength"]} rows={[
            ["Espressif", "ESP8266, ESP32", "Built-in Wi-Fi + Bluetooth, very low cost"],
            ["STMicroelectronics", "STM32", "Huge range, low power, industrial grade"],
            ["Microchip", "ATmega328 (Arduino), PIC", "Simple, robust, 5 V friendly"],
            ["Nordic", "nRF52", "Best-in-class Bluetooth Low Energy"],
            ["NXP / TI", "Kinetis, CC32xx", "Secure, wireless-ready SoCs"],
            ["Raspberry Pi", "RP2040", "Dual-core, PIO, cheap and well documented"],
          ]} />
        </Reveal>
      </div>
    ),
  },
  {
    section: S4, title: "Choosing an MCU: requirement → choice", steps: 4,
    body: (s) => (
      <Table size="text-[28px]" head={["If you need…", "Choose"]} rows={[
        ["Wi-Fi / BLE on chip, low cost", "ESP32"],
        ["Ultra-low power battery sensor (years)", "STM32L / nRF52"],
        ["Learning, prototyping, 5 V shields", "Arduino Uno (ATmega328P)"],
        ["Many I/O pins and serial ports", "Arduino Mega 2560"],
        ["Fast 32-bit DSP-like control, 3.3 V", "Arduino Due (ARM Cortex-M3)"],
      ].slice(0, s + 1)} />
    ),
  },

  // ---------- Arduino IDE ----------
  {
    section: S5, title: "What is the Arduino IDE?", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-2 gap-12">
        <Bullets step={s} items={[
          "Free, open-source editor + compiler + uploader for Arduino and many other boards.",
          "Sketches are C/C++ with Arduino helper libraries; saved as .ino files.",
          "One click: Verify (compile) → Upload (flash over USB).",
        ]} />
        <Reveal show={s >= 3}>
          <CodeBlock title="IDE workflow" size={30} code={`1. Tools > Board        -> Arduino Uno
2. Tools > Port         -> COMx
3. Write sketch
4. Verify  (checkmark)  -> compile
5. Upload  (arrow)      -> flash board
6. Tools > Serial Monitor -> debug`} />
        </Reveal>
      </div>
    ),
  },
  {
    section: S5, title: "IDE tour: the tools you will use", steps: 4,
    body: (s) => (
      <div className="grid grid-cols-2 gap-8">
        <Reveal show={s >= 0}><Card title="Board Manager" tone="sky">Installs board packages (ESP32, Due/SAM) so the IDE knows the compiler and upload method.</Card></Reveal>
        <Reveal show={s >= 1}><Card title="Library Manager" tone="accent">Search & install libraries: <Mono>Servo</Mono>, <Mono>DHT</Mono>, <Mono>PubSubClient</Mono>, <Mono>MPU6050</Mono>.</Card></Reveal>
        <Reveal show={s >= 2}><Card title="Serial Monitor" tone="warm">Text console over USB: <Mono>Serial.begin(9600)</Mono>, <Mono>Serial.println()</Mono>. Match the baud rate!</Card></Reveal>
        <Reveal show={s >= 3}><Card title="Serial Plotter" tone="hot">Live graph of values printed on Serial; ideal for sensors like the potentiometer or accelerometer.</Card></Reveal>
        <div className="col-span-2"><Reveal show={s >= 4}><Callout kind="warn">Limitations: basic debugging (no breakpoints), single-file focus, limited code completion. Move to PlatformIO / VS Code for larger IoT projects.</Callout></Reveal></div>
      </div>
    ),
  },
  {
    section: S5, title: "Arduino Uno pin map", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-2 gap-8">
        <Reveal show={s >= 0}><Table size="text-[26px]" head={["Group", "Pins"]} rows={[
          ["Digital I/O", "D0–D13 (D0 RX, D1 TX)"],
          ["PWM (~)", "3, 5, 6, 9, 10, 11"],
          ["Analog in", "A0–A5, 10-bit (0–1023)"],
        ]} /></Reveal>
        <Reveal show={s >= 1}><Table size="text-[26px]" head={["Bus", "Pins"]} rows={[
          ["I²C", "SDA = A4, SCL = A5"],
          ["SPI", "MOSI 11, MISO 12, SCK 13, SS 10"],
          ["Power", "5V, 3.3V, GND, Vin, AREF"],
        ]} /></Reveal>
        <div className="col-span-2 space-y-6">
          <Reveal show={s >= 2}><Callout kind="tip">ATmega328P · 16 MHz · 32 KB Flash · 2 KB SRAM · 1 KB EEPROM · 5 V logic · 20 mA recommended per pin.</Callout></Reveal>
          <Reveal show={s >= 3}><Callout kind="exam">Only the six pins marked <b>~</b> can output PWM with <Mono>analogWrite()</Mono>.</Callout></Reveal>
        </div>
      </div>
    ),
  },

  // ---------- Programming basics ----------
  {
    section: S6, title: "Anatomy of a sketch", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <CodeBlock size={30} title="Blink.ino" code={`const int led = 13;      // global

void setup() {           // runs ONCE
  pinMode(led, OUTPUT);
}

void loop() {            // runs FOREVER
  digitalWrite(led, HIGH);
  delay(500);            // ms
  digitalWrite(led, LOW);
  delay(500);
}`} />
        <div className="space-y-6">
          <Reveal show={s >= 1}><Card title="setup()" tone="sky">Configure pins, start Serial, initialise libraries. Runs once at power-on/reset.</Card></Reveal>
          <Reveal show={s >= 2}><Card title="loop()" tone="accent">Main program. Repeats forever, so read inputs, decide, drive outputs.</Card></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: S6, title: "Data types & core functions", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-2 gap-10">
        <Table size="text-[26px]" head={["Type", "Size", "Use"]} rows={[
          ["int", "2 B", "−32768…32767"],
          ["long", "4 B", "large counts"],
          ["byte", "1 B", "0–255"],
          ["float", "4 B", "decimals"],
          ["boolean", "1 B", "true / false"],
          ["char / String", "1 B / obj", "text"],
        ]} />
        <Reveal show={s >= 1}>
          <Table size="text-[26px]" head={["Function", "Purpose"]} rows={[
            [<Mono>pinMode(p, m)</Mono>, "INPUT / OUTPUT / INPUT_PULLUP"],
            [<Mono>digitalWrite(p, v)</Mono>, "HIGH / LOW out"],
            [<Mono>digitalRead(p)</Mono>, "read HIGH / LOW"],
            [<Mono>analogRead(A0)</Mono>, "0–1023 (10-bit ADC)"],
            [<Mono>analogWrite(p, v)</Mono>, "PWM 0–255"],
            [<Mono>delay(ms)</Mono>, "blocking wait"],
          ]} />
        </Reveal>
      </div>
    ),
  },
  {
    section: S6, title: "millis(): non-blocking timing", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <CodeBlock size={27} title="BlinkNoDelay.ino" code={`unsigned long last = 0;
const long every = 500;
bool on = false;

void setup() { pinMode(13, OUTPUT); }

void loop() {
  if (millis() - last >= every) {
    last = millis();
    on = !on;
    digitalWrite(13, on);
  }
  // other work runs here!
}`} />
        <div className="space-y-6">
          <Reveal show={s >= 1}><Callout kind="warn"><Mono>delay()</Mono> freezes the CPU. During a 500 ms delay, the board cannot read a sensor or button.</Callout></Reveal>
          <Reveal show={s >= 2}><Callout kind="tip"><Mono>millis()</Mono> returns ms since power-on. Compare timestamps instead of waiting, so the loop stays responsive.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: S6, title: "Control statements & Serial", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-2 gap-8">
        <CodeBlock size={26} title="Control flow" code={`if (temp > 30) {
  digitalWrite(fan, HIGH);
} else {
  digitalWrite(fan, LOW);
}

for (int i = 0; i < 5; i++) {
  Serial.println(i);
}

while (!digitalRead(btn)) { }

switch (mode) {
  case 1: /* ... */ break;
  default: break;
}`} />
        <Reveal show={s >= 1}>
          <CodeBlock size={26} title="Serial debugging" code={`void setup() {
  Serial.begin(9600);
}
void loop() {
  int v = analogRead(A0);
  Serial.print("ADC = ");
  Serial.println(v);
  delay(200);
}`} />
        </Reveal>
      </div>
    ),
  },
];

