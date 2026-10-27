import type { Slide } from "../types";
import { Bullets, Callout, Card, CodeBlock, Mono, QuizCard, Reveal, Table } from "../components/ui";
import { Wiring } from "../demos/Wiring";
import { AccelDemo, ColorDemo, GyroDemo } from "../demos/Demos2";

const AC = "Accelerometer";
const CS = "Colour Sensor";
const GY = "Gyroscope";

const accelSteps: [string, string][] = [
  ["Read ADC", "analogRead() on X, Y, Z → 0–1023"],
  ["ADC → voltage", "V = ADC × 5 / 1024"],
  ["Remove zero-g offset", "V − 1.65 V (calibrated per axis)"],
  ["Divide by sensitivity", "g = (V − offset) / 0.330 V/g"],
  ["Collect ax, ay, az", "acceleration in g"],
  ["Roll", "atan2(ay, az)"],
  ["Pitch", "atan2(−ax, √(ay²+az²))"],
  ["Radians → degrees", "× 180 / π"],
  ["Apply offset if needed", "e.g. +180 to shift range"],
  ["Print / use", "Serial.println() or drive an actuator"],
  ["Repeat", "delay and loop"],
];

type Q = { q: string; opts: string[]; a: number; why: string };
const quiz = (section: string, n: number, d: Q): Slide => ({
  section, title: `Quick check ${n}`,
  body: () => <QuizCard {...d} />,
});

export const motion: Slide[] = [
  // ---------- Accelerometer ----------
  {
    section: AC, title: "What is an accelerometer?", steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1fr] gap-12">
        <Bullets step={s} items={[
          "Measures acceleration, including gravity (1 g = 9.81 m/s²), along X, Y and Z.",
          "MEMS: a tiny proof mass on springs; movement changes capacitance between fixed and moving plates.",
          "Static tilt → gravity splits across axes, so tilt angle can be computed.",
          "Used in phones (auto-rotate), drones, gaming, fall detection, vehicle crash sensors.",
        ]} />
        <Reveal show={s >= 4}><Table size="text-[26px]" head={["ADXL335", ""]} rows={[["Axes", "3 (analog out)"], ["Supply", "1.8 – 3.6 V (3.3 V)"], ["Range", "±3 g"], ["Sensitivity", "≈ 330 mV/g"], ["Zero-g", "≈ 1.65 V"]]} /></Reveal>
      </div>
    ),
  },
  {
    section: AC, title: "Wiring the ADXL335", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-[1fr_1.1fr] gap-10">
        <div>
          <Wiring left="Arduino Uno" right="ADXL335" wires={[
            { from: "3.3V", to: "VCC", color: "#ef4444" },
            { from: "GND", to: "GND", color: "#94a3b8" },
            { from: "A1", to: "X-out", color: "#22c55e" },
            { from: "A2", to: "Y-out", color: "#60a5fa" },
            { from: "A3", to: "Z-out", color: "#fbbf24" },
          ]} />
        </div>
        <div className="space-y-6">
          <Reveal show><Callout kind="warn">ADXL335 is a 3.3 V part. Power from the Uno <b>3.3V</b> pin. Outputs are ratiometric to supply voltage, so for best accuracy connect <Mono>AREF</Mono> to 3.3 V and use <Mono>analogReference(EXTERNAL)</Mono>.</Callout></Reveal>
          <Reveal show={s >= 1}><Callout kind="tip">Our sketch assumes a 5 V ADC reference, so the formulas use 5/1024; if you change AREF, change the constant too.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: AC, title: "From ADC reading to tilt angle: 11 steps", steps: 11,
    body: (s) => (
      <div className="grid grid-cols-3 gap-4">
        {accelSteps.map(([t, d], k) => (
          <Reveal key={t} show={s >= k + 1}>
            <div className="h-[200px] hard-sm border-2 border-ink bg-white p-5">
              <div className="flex items-center gap-3"><span className="display flex h-11 w-11 items-center justify-center border-2 border-ink bg-accent text-[24px] font-bold text-white">{k + 1}</span><span className="text-[26px] font-semibold leading-tight">{t}</span></div>
              <p className="mt-3 font-mono text-[22px] leading-snug text-mute">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    ),
  },
  { section: AC, title: "Live demo: tilt the sensor", body: () => <AccelDemo /> },
  {
    section: AC, title: "Accelerometer code", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-[1.4fr_1fr] gap-8">
        <CodeBlock size={20} title="ADXL335.ino" code={`const int xp = A1, yp = A2, zp = A3;
const float zeroG = 1.65;   // calibrate per axis
const float sens  = 0.330;  // V per g

float toG(int adc) {
  return ((adc * 5.0 / 1024.0) - zeroG) / sens;
}

void setup() { Serial.begin(9600); }

void loop() {
  float ax = toG(analogRead(xp));
  float ay = toG(analogRead(yp));
  float az = toG(analogRead(zp));
  float roll  = atan2(ay, az) * 180.0 / PI;
  float pitch = atan2(-ax, sqrt(ay*ay + az*az)) * 180.0 / PI;
  Serial.print("Roll: ");  Serial.print(roll);
  Serial.print("  Pitch: "); Serial.println(pitch);
  delay(1000);
}`} />
        <div className="space-y-6">
          <Reveal show><Callout kind="exam">Use <Mono>PI</Mono>, not 3.14: Arduino defines it with full precision.</Callout></Reveal>
          <Reveal show={s >= 1}><Callout kind="warn">An accelerometer cannot measure <b>yaw</b> (rotation about the vertical axis); gravity does not change. For yaw you need a gyroscope or magnetometer.</Callout></Reveal>
        </div>
      </div>
    ),
  },

  // ---------- Colour sensor ----------
  {
    section: CS, title: "TCS230 colour sensor: principle", steps: 4,
    body: (s) => (
      <div className="grid grid-cols-2 gap-10">
        <Bullets step={s} items={[
          "An 8×8 array of photodiodes: 16 red-filtered, 16 green, 16 blue, 16 clear.",
          "A current-to-frequency converter turns light intensity into a square wave.",
          "S2/S3 choose which filter is read; S0/S1 scale the output frequency.",
          <>Read the frequency with <Mono>pulseIn()</Mono>: more of a colour → higher frequency → shorter pulse.</>,
        ]} />
        <Reveal show={s >= 4}><Table size="text-[26px]" head={["S2", "S3", "Filter"]} rows={[["LOW", "LOW", "Red"], ["HIGH", "HIGH", "Green"], ["LOW", "HIGH", "Blue"], ["HIGH", "LOW", "Clear"]]} /></Reveal>
      </div>
    ),
  },
  {
    section: CS, title: "Wiring and frequency scaling", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-[1fr_1fr] gap-10">
        <Wiring left="Arduino Uno" right="TCS230" wires={[
          { from: "5V", to: "VCC", color: "#ef4444" },
          { from: "GND", to: "GND", color: "#94a3b8" },
          { from: "D4", to: "S0", color: "#a78bfa" },
          { from: "D5", to: "S1", color: "#a78bfa" },
          { from: "D6", to: "S2", color: "#22c55e" },
          { from: "D7", to: "S3", color: "#22c55e" },
          { from: "D8", to: "OUT", color: "#fbbf24" },
        ]} />
        <div className="space-y-6">
          <Reveal show><Table size="text-[26px]" head={["S0", "S1", "Output scaling"]} rows={[["LOW", "LOW", "power down"], ["LOW", "HIGH", "2 %"], ["HIGH", "LOW", "20 % (used here)"], ["HIGH", "HIGH", "100 %"]]} /></Reveal>
          <Reveal show={s >= 1}><Callout kind="tip">20 % scaling is the sweet spot for Arduino: fast enough to be accurate, slow enough for <Mono>pulseIn()</Mono>.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: CS, title: "Calibrate before you read", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-2 gap-10">
        <Reveal show><Card title="Calibration procedure" tone="warm"><ol className="list-decimal space-y-3 pl-8"><li>Hold a <b>white</b> object near the sensor: note the smallest pulse width for each filter (<Mono>min</Mono>).</li><li>Hold a <b>black</b> object: note the largest (<Mono>max</Mono>).</li><li>Put the six numbers in the sketch.</li></ol></Card></Reveal>
        <div className="space-y-6">
          <Reveal show={s >= 1}><Callout kind="warn">Values differ with every sensor and lighting condition. Re-calibrate in the classroom, not from a PDF.</Callout></Reveal>
          <Reveal show={s >= 2}><Callout kind="tip">Then <Mono>map(pw, min, max, 255, 0)</Mono> converts a pulse width to 0–255: short pulse → bright → high value.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: CS, title: "Reading RGB: the sketch", steps: 1,
    body: (s) => (
      <div className="grid grid-cols-2 gap-8">
        <CodeBlock size={20} title="ColorSensor.ino (1/2): setup" code={`const int S0=4, S1=5, S2=6, S3=7, OUT=8;
// from calibration (example values)
int rMin=30, rMax=300;
int gMin=30, gMax=300;
int bMin=30, bMax=300;

int readPW(bool s2, bool s3) {
  digitalWrite(S2, s2);
  digitalWrite(S3, s3);
  return pulseIn(OUT, LOW);
}

void setup() {
  pinMode(S0,OUTPUT); pinMode(S1,OUTPUT);
  pinMode(S2,OUTPUT); pinMode(S3,OUTPUT);
  pinMode(OUT,INPUT);
  digitalWrite(S0,HIGH);   // 20 %
  digitalWrite(S1,LOW);
  Serial.begin(9600);
}`} />
        <Reveal show={s >= 1}>
          <CodeBlock size={20} title="ColorSensor.ino (2/2): loop" code={`void loop() {
  int r = map(readPW(LOW, LOW),
              rMin, rMax, 255, 0);
  int g = map(readPW(HIGH, HIGH),
              gMin, gMax, 255, 0);
  int b = map(readPW(LOW, HIGH),
              bMin, bMax, 255, 0);

  Serial.print("R="); Serial.print(r);
  Serial.print(" G="); Serial.print(g);
  Serial.print(" B="); Serial.println(b);
  delay(300);
}`} />
        </Reveal>
      </div>
    ),
  },
  { section: CS, title: "Live demo: colour → pulse width → RGB", body: () => <ColorDemo /> },

  // ---------- Gyroscope ----------
  {
    section: GY, title: "What is a gyroscope?", steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.1fr_1fr] gap-12">
        <Bullets step={s} items={[
          "Measures angular velocity (rate of rotation) in °/s about X, Y and Z.",
          <>MEMS gyros use the <b className="text-accent">Coriolis effect</b>: a vibrating mass is pushed sideways when the chip rotates; that force is sensed.</>,
          "Integrate rate over time to get angle: angle += ω × dt.",
          "Used in drones, camera gimbals, VR headsets and phones.",
        ]} />
        <Reveal show={s >= 4}><Table size="text-[26px]" head={["", "Accelerometer", "Gyroscope"]} rows={[["Measures", "linear accel (g)", "rotation rate (°/s)"], ["Good at", "static tilt", "fast rotation"], ["Weak at", "vibration noise", "drift over time"], ["Yaw?", "no", "yes"]]} /></Reveal>
      </div>
    ),
  },
  {
    section: GY, title: "MPU6050: 3-axis gyro + 3-axis accelerometer", steps: 3,
    body: (s) => (
      <div className="grid grid-cols-[1fr_1fr] gap-10">
        <Wiring left="Arduino Uno" right="MPU6050" wires={[
          { from: "5V", to: "VCC", color: "#ef4444" },
          { from: "GND", to: "GND", color: "#94a3b8" },
          { from: "A4", to: "SDA", color: "#22c55e", note: "I²C data" },
          { from: "A5", to: "SCL", color: "#fbbf24", note: "I²C clock" },
        ]} />
        <div className="space-y-6">
          <Reveal show={s >= 1}><Card title="I²C interface" tone="sky">Two-wire bus. MPU6050 address <Mono>0x68</Mono> (<Mono>0x69</Mono> if AD0 = HIGH). On Mega: SDA 20, SCL 21.</Card></Reveal>
          <Reveal show={s >= 2}><Card title="Ranges" tone="accent">Gyro ±250 / 500 / 1000 / 2000 °/s · Accel ±2 / 4 / 8 / 16 g · 16-bit ADC per axis.</Card></Reveal>
          <Reveal show={s >= 3}><Callout kind="tip">GY-521 breakout boards have an on-board regulator, so 5 V on VCC is safe.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  {
    section: GY, title: "MPU6050 code", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-[1.3fr_1fr] gap-8">
        <CodeBlock size={20} title="Gyro.ino" code={`#include <Wire.h>
#include <MPU6050.h>
MPU6050 mpu;
int16_t gx, gy, gz;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection())
    Serial.println("MPU6050 not found!");
}

void loop() {
  mpu.getRotation(&gx, &gy, &gz);   // raw 16-bit
  Serial.print(gx / 131.0); Serial.print("  ");  // deg/s
  Serial.print(gy / 131.0); Serial.print("  ");
  Serial.println(gz / 131.0);
  delay(100);
}`} />
        <div className="space-y-6">
          <Reveal show><Callout kind="exam">At the default ±250 °/s range, <b>131 LSB = 1 °/s</b>. Raw ÷ 131 = degrees per second.</Callout></Reveal>
          <Reveal show={s >= 1}><Card title="Angle from rate" tone="sky"><Mono>yaw += (gz/131.0) * dt;</Mono><br />where <Mono>dt</Mono> = seconds since last sample.</Card></Reveal>
          <Reveal show={s >= 2}><Callout kind="warn">Install the <b>MPU6050</b> library (Jeff Rowberg / I2Cdevlib) from Library Manager.</Callout></Reveal>
        </div>
      </div>
    ),
  },
  { section: GY, title: "Live demo: rate → angle, and drift", body: () => <GyroDemo /> },
  {
    section: GY, title: "Fusing accelerometer + gyroscope", steps: 2,
    body: (s) => (
      <div className="grid grid-cols-2 gap-10">
        <Reveal show><Card title="The problem" tone="hot">Accelerometer: noisy but no drift. Gyroscope: smooth but drifts. Neither alone gives a perfect angle.</Card></Reveal>
        <Reveal show={s >= 1}><Card title="Complementary filter" tone="accent"><Mono>angle = 0.98 × (angle + gyro × dt) + 0.02 × accelAngle</Mono><br /><br />Trust the gyro short-term and the accelerometer long-term.</Card></Reveal>
        <div className="col-span-2"><Reveal show={s >= 2}><Callout kind="exam">The MPU6050 gives both sensors on one chip, which is why it is the standard IMU for balancing robots and drones.</Callout></Reveal></div>
      </div>
    ),
  },
];

// ---------- Recap + quiz ----------
const R = "Recap & Quiz";
export const recap: Slide[] = [
  {
    section: R, title: "Unit III at a glance", steps: 5,
    body: (s) => (
      <div className="grid grid-cols-3 gap-6">
        <Reveal show={s >= 0}><Card title="IoT concepts" tone="sky">Evolution (M2M → Edge AI), applications, 6-layer architecture, 12 development stages.</Card></Reveal>
        <Reveal show={s >= 1}><Card title="Platform" tone="accent">MCUs for IoT, Arduino IDE, <Mono>setup/loop</Mono>, I/O functions, <Mono>millis()</Mono>.</Card></Reveal>
        <Reveal show={s >= 2}><Card title="Signals" tone="warm">PWM (<Mono>analogWrite</Mono>), ADC (<Mono>analogRead</Mono>), pot, servo pulses 1–2 ms.</Card></Reveal>
        <Reveal show={s >= 3}><Card title="Sensors" tone="hot">IR (active-LOW), ADXL335 (analog tilt), TCS230 (frequency), MPU6050 (I²C).</Card></Reveal>
        <Reveal show={s >= 4}><Card title="Wireless & boards" tone="sky">HC-05 SPP over SoftwareSerial; Uno vs Mega vs Due (3.3 V!).</Card></Reveal>
        <Reveal show={s >= 5}><Card title="Patterns" tone="accent">read → <Mono>map()</Mono> → write; compare thresholds; calibrate; avoid <Mono>delay()</Mono>.</Card></Reveal>
      </div>
    ),
  },
  quiz(R, 1, { q: "Which Arduino Uno pins can output PWM with analogWrite()?", opts: ["0, 1, 2, 3, 4, 5", "3, 5, 6, 9, 10, 11", "A0 – A5", "7, 8, 12, 13"], a: 1, why: "Hardware timers drive the six pins marked ~: 3, 5, 6, 9, 10, 11." }),
  quiz(R, 2, { q: "A 50 % duty cycle on a 5 V PWM pin gives an average voltage of:", opts: ["1.25 V", "2.5 V", "3.3 V", "5 V"], a: 1, why: "Vavg = duty × Vmax = 0.5 × 5 V = 2.5 V." }),
  quiz(R, 3, { q: "analogRead(A0) returns 512. Approximately what voltage is on the pin?", opts: ["1.25 V", "2.5 V", "3.3 V", "5 V"], a: 1, why: "V = 512 × 5 / 1023 ≈ 2.5 V." }),
  quiz(R, 4, { q: "What servo pulse width corresponds to 90°?", opts: ["0.5 ms", "1.0 ms", "1.5 ms", "2.0 ms"], a: 2, why: "1 ms = 0°, 1.5 ms = 90°, 2 ms = 180°, repeated every 20 ms." }),
  quiz(R, 5, { q: "An IR obstacle sensor's OUT pin is ___ when an object is detected.", opts: ["HIGH", "LOW", "floating", "PWM"], a: 1, why: "The module output is active-LOW." }),
  quiz(R, 6, { q: "Why use a voltage divider on the HC-05 RXD pin?", opts: ["To increase range", "Arduino TX is 5 V; HC-05 RXD is 3.3 V", "To set the baud rate", "To enable AT mode"], a: 1, why: "5 V logic can damage the HC-05's 3.3 V input; 1 kΩ + 2 kΩ gives ≈ 3.3 V." }),
  quiz(R, 7, { q: "Which sensor can measure rotation about the vertical axis (yaw)?", opts: ["Accelerometer", "Gyroscope", "IR sensor", "Colour sensor"], a: 1, why: "Gravity does not change with yaw, so only a gyroscope (or magnetometer) sees it." }),
  quiz(R, 8, { q: "Which board runs at 3.3 V logic and has a 32-bit ARM core?", opts: ["Uno", "Mega 2560", "Due", "Nano"], a: 2, why: "The Arduino Due uses the SAM3X8E Cortex-M3 at 84 MHz, 3.3 V logic." }),
  {
    section: R, title: "Thank you", bare: true,
    body: () => (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Reveal><div className="hard -rotate-2 border-2 border-ink bg-pop px-16 py-8"><h1 className="display text-[170px] font-extrabold leading-none">Questions?</h1></div></Reveal>
        <Reveal><p className="mt-14 text-[40px] font-semibold">Unit III · IoT Architecture &amp; Embedded Hardware</p></Reveal>
        <Reveal><p className="mt-8 font-mono text-[24px] font-bold text-mute">G to jump to any topic · Home to restart</p></Reveal>
      </div>
    ),
  },
];
