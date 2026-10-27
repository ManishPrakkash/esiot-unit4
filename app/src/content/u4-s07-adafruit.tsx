import React, { useState } from "react";
import { Cloud, Gauge, Bell, Radio, Cpu, ToggleRight, Thermometer, BarChart2, ShieldCheck, Code2, Layers, Zap } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table, CodeBlock } from "../components/ui";
import { AdafruitIOVirtualLabDemo } from "../demos/Unit4Demos";

const S = "Adafruit IO Cloud Integration";

// Tabbed Code Viewer for zero-overlap and high-engagement presentation
function AdafruitCodeViewer() {
  const [activeTab, setActiveTab] = useState<"setup" | "loop" | "reconnect">("setup");

  const codeSnippets = {
    setup: `// 1. Include Libraries & Define Credentials
#include <ESP8266WiFi.h>
#include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_Client.h>
#include <DHT.h>

#define WLAN_SSID       "MyHomeWiFi"
#define WLAN_PASS       "WiFiPassword123"

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883
#define AIO_USERNAME    "manis"
#define AIO_KEY         "aio_abc12345xyz"

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, 
                          AIO_USERNAME, AIO_KEY);

// Define Feed Publisher: username/feeds/temperature
Adafruit_MQTT_Publish tempFeed = Adafruit_MQTT_Publish(&mqtt, 
                         AIO_USERNAME "/feeds/temperature");

DHT dht(2, DHT22);

void setup() {
  Serial.begin(115200);
  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); 
    Serial.print("."); 
  }
  Serial.println("\\nWiFi Connected!");
  dht.begin();
}`,
    loop: `// 2. Publish Sensor Telemetry to Cloud Feed
void loop() {
  // Ensure active connection before publishing
  if (!mqtt.connected()) {
    reconnect();
  }

  // Read temperature from DHT22
  float temp = dht.readTemperature();

  if (!isnan(temp)) {
    Serial.print("Publishing temperature: ");
    Serial.println(temp);

    // Publish to Adafruit IO Feed over MQTT
    if (!tempFeed.publish(temp)) {
      Serial.println("Publish Failed!");
    } else {
      Serial.println("Published to io.adafruit.com successfully!");
    }
  }

  delay(3000); // Send data every 3 seconds
}`,
    reconnect: `// 3. Persistent Auto-Reconnect Logic
void reconnect() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to Adafruit IO MQTT Broker... ");
    
    // Attempt MQTT connect handshake
    if (mqtt.connect()) {
      Serial.println("Connected to io.adafruit.com!");
    } else {
      Serial.print("Failed, error code: ");
      Serial.println(mqtt.connectErrorString(mqtt.connectError()));
      Serial.println("Retrying connection in 5 seconds...");
      delay(5000);
    }
  }
}`
  };

  const tabDescriptions = {
    setup: "Initializes Wi-Fi client, sets Adafruit IO credentials, and creates the MQTT Publish instance for the 'temperature' feed.",
    loop: "Periodically samples the sensor every 3s and dispatches the telemetry float value to io.adafruit.com over TCP port 1883.",
    reconnect: "Vital IoT watchdog routine: automatically handles network dropouts and re-establishes the MQTT socket without resetting the MCU."
  };

  return (
    <div className="grid grid-cols-[1.25fr_1.1fr] gap-8 items-start">
      {/* Code Area with Tabs */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {[
            { id: "setup", label: "1. Setup & Credentials" },
            { id: "loop", label: "2. Loop & Telemetry Publish" },
            { id: "reconnect", label: "3. Auto-Reconnect Loop" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`press hard-sm px-4 py-2 border-2 border-ink font-mono text-[16px] font-bold ${
                activeTab === tab.id ? "bg-pop text-ink shadow-md" : "bg-white text-mute hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <CodeBlock
          title={activeTab === "setup" ? "adafruit_setup.ino" : activeTab === "loop" ? "adafruit_loop.ino" : "adafruit_reconnect.ino"}
          size={18}
          code={codeSnippets[activeTab]}
        />
      </div>

      {/* Explainer Card for Active Tab */}
      <div className="space-y-4">
        <div className="hard border-2 border-ink bg-accent-soft p-6 space-y-4">
          <div className="display text-[26px] font-extrabold text-accent border-b-2 border-ink pb-2">
            {activeTab === "setup" && "Step 1: Initialization & Feeds"}
            {activeTab === "loop" && "Step 2: MQTT Publish Loop"}
            {activeTab === "reconnect" && "Step 3: Fault-Tolerant Reconnect"}
          </div>
          <div className="text-[22px] leading-snug">
            {tabDescriptions[activeTab]}
          </div>
          <div className="hard-sm border-2 border-ink bg-white p-4 space-y-2 text-[19px]">
            <div className="font-bold text-ink">Key Highlights:</div>
            {activeTab === "setup" && (
              <div>
                • Topic path constructed as <code className="bg-pop px-1 font-mono">username/feeds/feed-name</code>. <br />
                • Authentication via <code className="bg-pop px-1 font-mono">AIO_KEY</code> token.
              </div>
            )}
            {activeTab === "loop" && (
              <div>
                • <code className="bg-pop px-1 font-mono">tempFeed.publish(val)</code> transmits a lightweight 2-byte MQTT packet. <br />
                • Zero web server overhead.
              </div>
            )}
            {activeTab === "reconnect" && (
              <div>
                • Non-blocking retry backoff ensures continuous edge operation even during Wi-Fi router reboot.
              </div>
            )}
          </div>
        </div>

        <Callout kind="exam">
          On Adafruit IO, your <b>AIO Key</b> acts as both password and API bearer token. Never share your private AIO Key publicly in GitHub repositories!
        </Callout>
      </div>
    </div>
  );
}

export const adafruitSlides: Slide[] = [
  // 1. Understanding Adafruit IO (Highly Engaging Master-Detail Cards)
  {
    section: S,
    title: "Understanding Adafruit IO Cloud Platform",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <div className="space-y-5">
          <Reveal show={s >= 0}>
            <p className="text-[32px] leading-snug">
              <b className="text-accent">Adafruit IO</b> is a purpose-built SaaS cloud platform designed for Internet of Things (IoT) systems. It allows embedded microcontrollers to stream sensor feeds, render live visual dashboards, and execute automated triggers with zero backend server setup.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <MasterDetail
              items={[
                {
                  title: "1. Data Feeds",
                  tone: "accent",
                  detail: (
                    <>
                      Named timeseries data streams (e.g. <code>temperature</code>, <code>humidity</code>, <code>door-lock</code>). Every sensor value published is stored with high-precision timestamps for graphing and history export.
                    </>
                  ),
                },
                {
                  title: "2. Live Dashboards",
                  tone: "sky",
                  detail: (
                    <>
                      Custom web GUIs assembled with drag-and-drop widgets: Radial Gauges, Time-series Line Charts, Color Pickers, Sliders, and Bi-directional Toggle Switches that actuate remote hardware.
                    </>
                  ),
                },
                {
                  title: "3. Reactive Triggers",
                  tone: "warm",
                  detail: (
                    <>
                      Event-driven automation rules. If a feed crosses a threshold (e.g. Temp &gt; 35°C), Adafruit IO immediately dispatches an automated Email, SMS, Webhook, or Discord alert.
                    </>
                  ),
                },
                {
                  title: "4. Dual APIs (MQTT & REST)",
                  tone: "hot",
                  detail: (
                    <>
                      Full support for low-overhead <b>MQTT</b> (pub/sub port 1883 / TLS 8883) for microcontrollers, and standard <b>REST API</b> (HTTP POST/GET) for web applications and bulk analytics.
                    </>
                  ),
                },
              ]}
            />
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal show={s >= 2}>
            <div className="hard border-2 border-ink bg-white p-6 space-y-4">
              <div className="display text-[26px] font-extrabold text-accent">Adafruit Hardware Ecosystem</div>
              <div className="space-y-3 text-[21px] text-mute">
                <div><b>• Adafruit Feather HUZZAH ESP8266:</b> Wi-Fi enabled microcontroller with built-in battery charging circuit.</div>
                <div><b>• Adafruit PyPortal:</b> Standalone IoT touchscreen display showing live cloud feeds.</div>
                <div><b>• NodeMCU / ESP32:</b> Low-cost Wi-Fi/Bluetooth SoCs using the open-source <code className="bg-pop px-1 font-mono text-ink text-[19px]">Adafruit MQTT</code> Arduino library.</div>
              </div>
            </div>
          </Reveal>

          <Reveal show={s >= 3}>
            <Callout kind="exam">
              <b>Adafruit IO MQTT Topic Format:</b> Always follows the structure: <br />
              <code className="bg-pop px-2 py-0.5 font-mono text-[21px] font-bold text-ink">username/feeds/feed-name</code> (e.g. <code className="bg-white px-1 font-mono text-[19px]">manis/feeds/temperature</code>).
            </Callout>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 2. Arduino / ESP32 Cloud Ingestion Code Walkthrough (Fixed Tabbed Zero-Overlap Viewer)
  {
    section: S,
    title: "ESP8266/ESP32 Telemetry Sketch Walkthrough",
    steps: 1,
    body: () => <AdafruitCodeViewer />,
  },

  // 3. Interactive Adafruit IO Virtual Cloud Lab & Dashboard
  {
    section: S,
    title: "Interactive Adafruit IO Cloud Virtual Lab & Dashboard",
    steps: 1,
    body: () => <AdafruitIOVirtualLabDemo />,
  },
];
