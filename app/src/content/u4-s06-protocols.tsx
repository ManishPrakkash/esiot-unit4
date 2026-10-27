import { Wifi, Radio, ArrowRight, Server, ShieldCheck, Zap, Activity, Database, Check } from "lucide-react";
import type { Slide } from "../types";
import { Reveal, Bullets, Callout, Card, MasterDetail, Table } from "../components/ui";
import { IoTRuntimeProtocolsDemo } from "../demos/Unit4Demos";
import { ProtocolStackDiagram } from "../components/Pictorials";

const S = "IoT Communication Protocols";

export const protocolSlides: Slide[] = [
  // 1. Data Protocols in Cloud & IoT Overview (Visual Protocol Stack Diagram)
  {
    section: S,
    title: "IoT Communication Protocols & OSI Stack Mapping",
    steps: 2,
    body: (s) => (
      <div className="space-y-4">
        <Reveal show={s >= 0}>
          <p className="text-[28px] leading-snug">
            Constrained IoT devices replace bloated HTTP/TCP stacks with ultra-lightweight protocols like <b>MQTT (TCP/TLS)</b> and <b>CoAP (UDP/DTLS)</b> to minimize packet headers and power consumption.
          </p>
        </Reveal>

        <Reveal show={s >= 1}>
          <ProtocolStackDiagram />
        </Reveal>
      </div>
    ),
  },

  // 2. MQTT Architecture & Topic Hierarchy
  {
    section: S,
    title: "MQTT Architecture: Topics, Wildcards & QoS Levels",
    steps: 4,
    body: (s) => (
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        <div className="space-y-6">
          <Reveal show={s >= 0}>
            <p className="text-[32px] leading-snug">
              MQTT decouples the <b>Publisher</b> (sensor node) from the <b>Subscriber</b> (dashboard) via a central <b>Broker</b> that filters and routes messages using hierarchical topic strings.
            </p>
          </Reveal>

          <Reveal show={s >= 1}>
            <Card title="Topic Hierarchy & Wildcards" tone="accent">
              <div className="space-y-3 text-[23px]">
                <div>
                  <b>Topic Path Example:</b> <code className="bg-pop px-1 font-mono">campus/blockA/room204/temperature</code>
                </div>
                <div>
                  <b>Single-Level Wildcard ( + ):</b> Matches exactly one level. <br />
                  <code className="bg-white px-1 font-mono text-[20px]">campus/blockA/+/temperature</code> (matches room101, room204, etc.)
                </div>
                <div>
                  <b>Multi-Level Wildcard ( # ):</b> Matches all remaining subtree levels. <br />
                  <code className="bg-white px-1 font-mono text-[20px]">campus/blockA/#</code> (matches all sensors in block A)
                </div>
              </div>
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal show={s >= 2}>
            <Card title="MQTT Quality of Service (QoS)" tone="sky">
              <div className="space-y-3 text-[23px]">
                <div><b>• QoS 0 (At most once):</b> Fire and forget. No acknowledgement or retransmission. Minimal latency.</div>
                <div><b>• QoS 1 (At least once):</b> Handshake with PUBACK. Guarantees delivery, but duplicate packets may occur.</div>
                <div><b>• QoS 2 (Exactly once):</b> 4-step handshake (PUBLISH, PUBREC, PUBREL, PUBCOMP). Zero duplicates. Critical for financial/billing IoT.</div>
              </div>
            </Card>
          </Reveal>

          <Reveal show={s >= 3}>
            <Callout kind="exam">
              <b>Exam Rule:</b> Adafruit IO uses MQTT QoS 0 and QoS 1. The default connection port is <b>1883</b> (unencrypted) or <b>8883</b> (SSL/TLS encrypted).
            </Callout>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 3. Protocol Comparison Matrix
  {
    section: S,
    title: "Protocol Comparison: MQTT vs HTTP vs CoAP vs WebSocket",
    steps: 2,
    body: (s) => (
      <div className="space-y-6">
        <Reveal show={s >= 0}>
          <Table
            head={["Metric", "MQTT", "HTTP / REST", "CoAP", "WebSocket"]}
            rows={[
              ["Transport Layer", "TCP", "TCP", "UDP", "TCP"],
              ["Communication", "Publish / Subscribe", "Request / Response", "Req/Res + Pub/Sub", "Full-Duplex Stream"],
              ["Header Overhead", "2 Bytes (Ultra-compact)", "~800+ Bytes (Bloated)", "4 Bytes (Binary)", "~6 Bytes (Framed)"],
              ["Power & Battery", "Extremely Low", "High (Repeated connects)", "Lowest (No handshake)", "Medium"],
              ["Connection State", "Persistent Keep-Alive", "Stateless / Disconnected", "Connectionless (UDP)", "Persistent State"],
              ["Ideal Use Case", "Sensor telemetry & control", "Web browsing & file download", "Low-power 6LoWPAN mesh", "Live browser dashboards"],
            ]}
          />
        </Reveal>

        <Reveal show={s >= 1}>
          <Callout kind="tip">
            <b>Why MQTT wins for IoT:</b> A 2-byte MQTT packet uses ~98% less cellular data bandwidth than an HTTP POST request sending the exact same 10-byte sensor reading!
          </Callout>
        </Reveal>
      </div>
    ),
  },

  // 4. Interactive Protocol Benchmark & Packet Inspector
  {
    section: S,
    title: "Interactive IoT Protocol Shootout & Wire Inspector",
    steps: 1,
    body: () => <IoTRuntimeProtocolsDemo />,
  },
];
