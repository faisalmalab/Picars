import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { 
  ShieldAlert, LayoutDashboard, Sliders, ScanFace, Database, 
  Terminal, Video, Trash2, RefreshCw, Zap, Users, Activity,
  Cpu, Wifi, ShieldCheck, Compass, CheckCircle2, AlertTriangle,
  Lock, Unlock, Settings, Search, HardDrive, Globe, Server
} from "lucide-react";

const socket = io("http://localhost:5000");

export default function App() {
  const [activeTab, setActiveTab] = useState("live");
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);
  const [inZoneCount, setInZoneCount] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  
  // Interactive state configurations for other tabs
  const [sensitivity, setSensitivity] = useState(75);
  const [zoneScale, setZoneScale] = useState(85);
  const [autoLockdown, setAutoLockdown] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [logs, setLogs] = useState([
    "[SYSTEM] Neural weights verified. YOLOv8 active.",
    "[SEC] Spatial polygon boundary matrix locked.",
    "[WEBSOCKET] Establishing secure handshakes..."
  ]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      setLogs(prev => [`[NET] Secure uplink established (${socket.id})`, ...prev]);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setLogs(prev => [`[NET] Uplink severed. Running offline cache.`, ...prev]);
    });

    socket.on("telemetry:intrusion_alert", (data) => {
      if (data?.fps !== undefined) setFps(data.fps);
      if (data?.in_zone_count !== undefined) setInZoneCount(data.in_zone_count);
      if (data?.total_detected !== undefined) setTotalObjects(data.total_detected);
      
      if (data?.status === 'BREACH' || data?.status === 'BREACH_ALERT') {
        setLogs(prev => [`[CRITICAL] Perimeter breach flagged! Targets in zone: ${data.in_zone_count}`, ...prev]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("telemetry:intrusion_alert");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      
      {/* Cinematic Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      {/* Ambient Cyber Lighting Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* GLOBAL HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b0f19]/90 backdrop-blur-2xl border border-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 rounded-xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  VORTEX // COMMAND
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  ENTERPRISE v2.4
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-wide">SECURE_ZONE: AMMAN_HQ_SECTOR_01</p>
            </div>
          </div>

          {/* Interactive Nav Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#05070d] p-1.5 rounded-xl border border-slate-800/90">
            {[
              { id: "live", label: "Live Ops", icon: LayoutDashboard },
              { id: "rules", label: "Perimeter", icon: Sliders },
              { id: "face", label: "Biometrics", icon: ScanFace },
              { id: "logs", label: "Telemetry DB", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border backdrop-blur-md ${
              isConnected 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
              {isConnected ? "SYSTEM SECURE" : "UPLINK LOST"}
            </div>
          </div>
        </header>

        {/* METRICS HUD GRID (Always visible across views for command feel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              label: "Perimeter State", 
              val: inZoneCount > 0 ? "BREACH DETECTED" : "NOMINAL / SAFE", 
              icon: inZoneCount > 0 ? ShieldAlert : ShieldCheck, 
              color: inZoneCount > 0 ? "text-rose-400" : "text-emerald-400", 
              border: inZoneCount > 0 ? "border-rose-500/30" : "border-emerald-500/30", 
              bg: inZoneCount > 0 ? "bg-rose-500/5" : "bg-emerald-500/5" 
            },
            { label: "Active Zone Targets", val: inZoneCount, icon: Users, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/5" },
            { label: "Edge Inference Rate", val: `${fps} FPS`, icon: Zap, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" },
            { label: "Tracked Entities", val: totalObjects, icon: Activity, color: "text-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/5" },
          ].map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border ${m.border} ${m.bg} flex items-center justify-between shadow-xl transition-all duration-300 hover:scale-[1.02] group`}>
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">{m.label}</p>
                  <p className={`text-xl font-bold font-mono mt-1.5 ${m.color} tracking-tight`}>{m.val}</p>
                </div>
                <div className={`p-3 rounded-xl ${m.bg} border ${m.border} shadow-inner group-hover:rotate-6 transition-transform`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* TAB 1: LIVE OPS VIEW */}
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Main Camera Feed Viewport */}
            <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-5 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200">OPTICAL_FEED // LIVE BROWSER INGESTION</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    CV_STREAM ACTIVE
                  </span>
                </div>
              </div>

              {/* Video Viewport with HUD Tech Overlay */}
              <div className="relative aspect-video rounded-xl bg-[#030712] border border-slate-800/90 overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.05)_50%)] bg-[size:100%_4px] pointer-events-none z-10"></div>
                <video 
                  ref={(el) => {
                    if (el && !el.srcObject) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => { el.srcObject = stream; })
                        .catch(err => console.error("Webcam access denied:", err));
                    }
                  }}
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-95"
                />
                <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30 z-20 flex items-center gap-1.5 shadow-lg">
                  <Compass className="w-3 h-3 animate-spin" /> CAM_01 // 1280x720 60FPS
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[10px] text-emerald-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30 z-20 shadow-lg">
                  YOLOv8n ACTIVE TRACKING
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button onClick={() => { setInZoneCount(0); setTotalObjects(0); }} className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700/80 flex items-center gap-2 transition-all shadow-md">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Purge State Counters
                </button>
                <button onClick={() => setLogs([])} className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono border border-rose-500/30 flex items-center gap-2 transition-all shadow-md">
                  <Trash2 className="w-3.5 h-3.5" /> Flush Buffer Logs
                </button>
              </div>
            </div>

            {/* Telemetry Log Terminal Panel */}
            <div className="rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold tracking-wider text-slate-200">TELEMETRY_STREAM_LOG</span>
                  </div>
                  <Wifi className={`w-3.5 h-3.5 ${isConnected ? "text-emerald-400" : "text-slate-600"}`} />
                </div>

                <div className="h-[285px] font-mono text-[11px] bg-[#030712] rounded-xl p-3.5 border border-slate-800/90 overflow-y-auto space-y-2 text-slate-400 shadow-inner">
                  {logs.map((log, index) => (
                    <p key={index} className={log.includes("Connected") || log.includes("uplink") ? "text-emerald-400" : log.includes("CRITICAL") ? "text-rose-400 animate-pulse font-bold" : "text-slate-300"}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="p-3.5 rounded-xl bg-[#05070d] border border-slate-800/80 flex items-center justify-between shadow-inner">
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Neural Framework</p>
                    <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">PyTorch // TensorRT CUDA</p>
                  </div>
                  <Cpu className="w-5 h-5 text-cyan-500/40 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERIMETER RULES CONFIGURATION */}
        {activeTab === "rules" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-wide text-white">SPATIAL ZONE CONFIGURATION</h2>
                  <p className="text-xs font-mono text-slate-400">Adjust polygon threshold parameters and neural sensitivity.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">YOLO Confidence Threshold</span>
                    <span className="text-cyan-400 font-bold">{sensitivity}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="95" value={sensitivity} 
                    onChange={(e) => setSensitivity(e.target.value)}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">Polygon Grid Scale Boundary</span>
                    <span className="text-cyan-400 font-bold">{zoneScale}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="100" value={zoneScale} 
                    onChange={(e) => setZoneScale(e.target.value)}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#030712] border border-slate-800">
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-200">Automatic Breach Lockdown</p>
                    <p className="text-[10px] font-mono text-slate-400">Trigger backend relay signals instantly upon intrusion.</p>
                  </div>
                  <button 
                    onClick={() => setAutoLockdown(!autoLockdown)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      autoLockdown ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    {autoLockdown ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-wide text-white">ACTIVE SECURE SECTORS</h2>
                  <p className="text-xs font-mono text-slate-400">Sub-nodes reporting status across Amman facility.</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: "AMMAN_HQ_SECTOR_01", status: "ONLINE", latency: "14ms", load: "12%" },
                  { name: "GATEWAY_NORTH_02", status: "ONLINE", latency: "19ms", load: "8%" },
                  { name: "PERIMETER_WEST_03", status: "STANDBY", latency: "--", load: "0%" }
                ].map((node, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-200">{node.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Latency: {node.latency} | CPU Load: {node.load}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${node.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                      {node.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIOMETRICS & FACIAL RECOGNITION */}
        {activeTab === "face" && (
          <div className="rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <ScanFace className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-wide text-white">BIOMETRIC RECOGNITION DATABASE</h2>
                  <p className="text-xs font-mono text-slate-400">Authorized personnel and visitor identification logs.</p>
                </div>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input 
                  type="text" placeholder="Search entity ID or name..." 
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#030712] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
                    <th className="pb-3 px-4">Entity ID</th>
                    <th className="pb-3 px-4">Name / Class</th>
                    <th className="pb-3 px-4">Confidence</th>
                    <th className="pb-3 px-4">Access Level</th>
                    <th className="pb-3 px-4">Last Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {[
                    { id: "TRK-01", name: "Faisal Abu Hajar (Admin)", conf: "98.4%", access: "Level 5 (Full)", time: "Just now" },
                    { id: "TRK-02", name: "Authorized Tech Staff", conf: "94.1%", access: "Level 3", time: "2m ago" },
                    { id: "TRK-05", name: "Unknown Visitor / Unregistered", conf: "82.9%", access: "Restricted", time: "14m ago" }
                  ]
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 text-cyan-400 font-bold">{row.id}</td>
                      <td className="py-3 px-4">{row.name}</td>
                      <td className="py-3 px-4 text-emerald-400">{row.conf}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${row.access.includes('Level 5') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                          {row.access}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY DATABASE (SQL AUDIT LOGS) */}
        {activeTab === "logs" && (
          <div className="rounded-2xl bg-[#0b0f19]/80 backdrop-blur-xl border border-slate-800/90 p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-wide text-white">POSTGRESQL TELEMETRY ENGINE // AUDIT STREAM</h2>
                  <p className="text-xs font-mono text-slate-400">Permanent event storage and historical matrix records.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400">DB Connected (Port 5432)</span>
              </div>
            </div>

            <div className="font-mono text-xs bg-[#030712] p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-slate-500 text-[10px] uppercase tracking-wider pb-2 border-b border-slate-800/80 flex justify-between">
                <span>SQL Query Payload Statement</span>
                <span>Rows: 1,482</span>
              </div>
              <p className="text-cyan-400">SELECT * FROM telemetry_events WHERE timestamp &gt; NOW() - INTERVAL '1 hour' ORDER BY id DESC;</p>
              
              <div className="space-y-2 pt-2">
                {[
                  { query: "INSERT INTO telemetry_alerts (node_id, fps, in_zone) VALUES ('EDGE_AMMAN_01', 29.4, 0);", time: "1.2s ago" },
                  { query: "INSERT INTO telemetry_alerts (node_id, fps, in_zone) VALUES ('EDGE_AMMAN_01', 30.1, 1);", time: "1.7s ago" },
                  { query: "UPDATE node_heartbeat SET status = 'ACTIVE' WHERE node_id = 'EDGE_AMMAN_01';", time: "3.5s ago" }
                ].map((sql, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300 font-mono">{sql.query}</span>
                    <span className="text-slate-500 text-[10px]">{sql.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}