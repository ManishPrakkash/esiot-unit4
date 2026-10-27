import { Phone, MessageSquare, ShieldAlert, Zap, Cpu, Lightbulb, Code2, CheckCircle2 } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table, CodeBlock } from "../components/ui";
import { GSMSecuritySystemDemo, SMSApplianceControlDemo } from "../demos/Unit4Demos";

const S = "GSM Calling, SMS & Control";

export const gsmAppSlides: Slide[] = [
  // 1. Voice Calling with GSM (Slide 9A - Dedicated Spacious Slide)
  {
    section: S,
    title: "Automated Voice Calling with Arduino Uno",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1.1fr] gap-10">
        <div className="space-y-5">
          <Reveal show={s >= 0}>
            <p className="text-[32px] leading-snug">
              When an embedded sensor detects an alert (e.g. tamper intrusion, fire, industrial leakage), the Arduino automatically commands the GSM modem to <b>dial voice calls</b> to emergency contacts.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <Card title="Voice Calling Execution Steps" tone="accent">
              <ol className="space-y-2 list-decimal list-inside text-[23px]">
                <li><b>Check Modem:</b> Send <code className="bg-pop px-1 font-mono">AT</code> and wait for <code className="bg-white px-1 font-mono">OK</code>.</li>
                <li><b>Dial Voice Call:</b> Send <code className="bg-pop px-1 font-mono">ATD&lt;phone_number&gt;;</code> (semicolon is required!).</li>
                <li><b>Ringing Interval:</b> Allow phone to ring for 15–20 seconds using <code className="bg-pop px-1 font-mono">delay(20000)</code>.</li>
                <li><b>Hang Up:</b> Disconnect the call by sending <code className="bg-pop px-1 font-mono">ATH</code>.</li>
              </ol>
            </Card>
          </Reveal>

          <Reveal show={s >= 2}>
            <Callout kind="exam">
              <b>Mandatory Voice Syntax:</b> If you omit the semicolon in <code className="bg-white px-1 font-mono">ATD9994442064;</code>, the modem attempts a CSD data connection instead of a voice call!
            </Callout>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal show={s >= 3}>
            <CodeBlock
              title="gsm_voice_call.ino"
              size={19}
              code={`#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
const int ledpin = 13;

void setup() {
  pinMode(7, INPUT);        // Tamper sensor pin
  pinMode(ledpin, OUTPUT);
  lcd.begin(16, 2);
  Serial.begin(9600);       // GSM UART baud rate
  lcd.print("  EXAM CELL     ");
  lcd.setCursor(0, 1);
  lcd.print("SECURITY SYSTEM ");
  delay(3000);
}

void callsomeone() {
  Serial.println("AT");
  delay(900);
  // Dial primary security number
  Serial.println("ATD9994442064;");
  delay(20000);             // Ring for 20 seconds
  Serial.println("ATH");    // Hang up active call
  delay(1000);
}`}
            />
          </Reveal>
        </div>
      </div>
    ),
  },

  // 2. SMS Messaging with GSM (Slide 9B - Dedicated Spacious Slide)
  {
    section: S,
    title: "SMS Messaging & Alert Dispatching with Arduino",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1.1fr] gap-10">
        <div className="space-y-5">
          <Reveal show={s >= 0}>
            <p className="text-[32px] leading-snug">
              SMS messages provide asynchronous text alerts to security personnel, sending precise location telemetry and status updates even when the recipient phone is busy.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <Card title="5-Step SMS Transmission Sequence" tone="sky">
              <ol className="space-y-2 list-decimal list-inside text-[23px]">
                <li><b>Set Text Mode:</b> Send <code className="bg-pop px-1 font-mono">AT+CMGF=1</code></li>
                <li><b>Specify Target Number:</b> Send <code className="bg-pop px-1 font-mono">AT+CMGS=&quot;+918344578121&quot;</code></li>
                <li><b>Wait for &apos;&gt;&apos; Prompt:</b> Delay ~500 ms for modem buffer.</li>
                <li><b>Write Message Content:</b> Send <code className="bg-pop px-1 font-mono">Serial.print(&quot;Alert Msg&quot;)</code></li>
                <li><b>Send End-of-Message:</b> Send <b>Ctrl+Z (ASCII 26)</b> via <code className="bg-pop px-1 font-mono">Serial.write(byte(26))</code>.</li>
              </ol>
            </Card>
          </Reveal>

          <Reveal show={s >= 2}>
            <Callout kind="exam">
              <b>ASCII 26 (Ctrl+Z):</b> The GSM module will NOT send the SMS until it receives ASCII 26 (<code className="bg-white px-1 font-mono">0x1A</code>). Always use <code className="bg-white px-1 font-mono">Serial.write(byte(26));</code> or <code className="bg-white px-1 font-mono">Serial.write(26);</code>.
            </Callout>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal show={s >= 3}>
            <CodeBlock
              title="gsm_send_sms.ino"
              size={19}
              code={`void textsomeone() {
  Serial.println();
  // 1. Switch modem to Text Mode
  Serial.println("AT+CMGF=1;");
  delay(1000);

  // 2. Set recipient mobile number
  Serial.print("AT+CMGS=\\"8344578121\\"\\r\\n");
  delay(1000);

  // 3. Send SMS message body
  Serial.print("Exam cell-Question paper Leaked: Alert at Room 204");
  delay(500);

  // 4. Send ASCII 26 (Ctrl+Z) to trigger send
  Serial.write(byte(26));
  delay(5000); // Allow modem to transmit over RF
}`}
            />
          </Reveal>
        </div>
      </div>
    ),
  },

  // 3. Interactive Simulator: Exam Cell GSM Alarm System
  {
    section: S,
    title: "Interactive Security System: Live Call & SMS Alert",
    steps: 1,
    body: () => <GSMSecuritySystemDemo />,
  },

  // 4. Controlling Appliances via GSM SMS (Spacious Non-Overflowing Layout)
  {
    section: S,
    title: "Controlling Appliances & Vehicles via GSM SMS",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1.1fr] gap-10">
        <div className="space-y-4">
          <Reveal show={s >= 0}>
            <p className="text-[30px] leading-snug">
              GSM modules allow remote actuation of appliances and vehicle ignitions by <b>receiving SMS text commands</b> and parsing character codes inside the Arduino UART buffer.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <Card title="Direct Serial Routing (AT+CNMI)" tone="warm">
              <div className="space-y-2 text-[22px]">
                <div>
                  Sending <code className="bg-pop px-1 font-mono">AT+CNMI=2,2,0,0</code> routes incoming SMS strings directly to the serial output stream without saving to SIM memory.
                </div>
                <div className="border-t border-ink/20 pt-1 font-mono text-[16px] text-emerald-800">
                  Modem Output: +CMT: &quot;+918344578121&quot;,,&quot;26/10/08&quot;\r\n#12
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal show={s >= 2}>
            <Callout kind="tip">
              <b>Passcode Parsing Algorithm:</b> The Arduino detects delimiter <code className="bg-pop px-1 font-mono">&apos;#&apos;</code>, then verifies the next two passcode characters (<code className="bg-pop px-1 font-mono">&apos;1&apos;</code> and <code className="bg-pop px-1 font-mono">&apos;2&apos;</code>) before setting <code className="bg-pop px-1 font-mono">digitalWrite(A0, HIGH)</code>.
            </Callout>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal show={s >= 3}>
            <CodeBlock
              title="home_appliance_gsm.ino"
              size={18}
              code={`#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 10, 9, 8, 7);
char inchar;

void setup() {
  lcd.begin(16, 2);
  pinMode(A0, OUTPUT);        // Relay Control Pin
  digitalWrite(A0, LOW);
  Serial.begin(9600);
  delay(3000);
  Serial.println("AT+CMGF=1");         // Text mode
  delay(200);
  Serial.println("AT+CNMI=2,2,0,0");   // Direct UART output
}

void check1() {
  if (Serial.available() > 0) {
    inchar = Serial.read();
    if (inchar == '#') {              // Start delimiter
      delay(10);
      inchar = Serial.read();
      if (inchar == '1') {            // Digit 1
        delay(10);
        inchar = Serial.read();
        if (inchar == '2') {          // Digit 2 -> '#12'
          lcd.setCursor(0, 0);
          lcd.print("PASSWORD OK     ");
          digitalWrite(A0, HIGH);     // Turn ON Relay / Vehicle
          delay(2000);
        }
      }
      Serial.println("AT+CMGD=1,4");  // Clear SIM SMS buffer
    }
  }
}`}
            />
          </Reveal>
        </div>
      </div>
    ),
  },

  // 5. Interactive Simulator: SMS Appliance / Vehicle Controller
  {
    section: S,
    title: "Interactive SMS Appliance & Vehicle Ignition Controller",
    steps: 1,
    body: () => <SMSApplianceControlDemo />,
  },
];
