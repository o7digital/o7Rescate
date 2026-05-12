import React, { useMemo, useState } from "react";

const regions = ["Alta montaña", "Playas", "Parques", "Todos"];

const iconMap = {
  activity: "⌁",
  alert: "⚠",
  battery: "▰",
  binoculars: "◌",
  chevron: "›",
  cloud: "◐",
  compass: "✦",
  drone: "◆",
  fingerprint: "◈",
  gauge: "◷",
  heart: "♥",
  map: "⌖",
  mountain: "△",
  radio: "◉",
  route: "〰",
  satellite: "✧",
  shield: "⬟",
  ship: "⌁",
  siren: "!",
  thermo: "☼",
  waves: "≈",
  wind: "≋",
};

function Icon({ name, className = "", size = "text-2xl" }) {
  return <span className={`inline-flex items-center justify-center font-black leading-none ${size} ${className}`}>{iconMap[name] || "•"}</span>;
}

const missionStats = [
  { label: "Zonas monitoreadas", value: "24", delta: "+8 nuevas rutas", icon: "map" },
  { label: "Guías conectados Garmin", value: "186", delta: "92% con tracking activo", icon: "satellite" },
  { label: "Drones listos", value: "17", delta: "4 bases operativas", icon: "drone" },
  { label: "Alertas críticas hoy", value: "6", delta: "2 requieren rescate", icon: "siren" },
];

const commandSignals = [
  {
    area: "Pico de Orizaba",
    tag: "Alta montaña",
    title: "Grupo con retraso en ruta glaciar",
    body: "Tracking Garmin con velocidad anómala, altitud estable y última comunicación hace 38 minutos.",
    status: "Atención",
    icon: "mountain",
  },
  {
    area: "Iztaccíhuatl",
    tag: "Trekking",
    title: "Ventana climática cerrando",
    body: "Ráfagas superiores al umbral recomendado. Se sugiere retorno antes del cruce de cresta.",
    status: "Preventivo",
    icon: "wind",
  },
  {
    area: "Costa Oaxaca",
    tag: "Playas",
    title: "Corriente de retorno detectada",
    body: "Dron costero identifica patrón de corriente y bañistas dentro de zona amarilla.",
    status: "Activo",
    icon: "waves",
  },
];

const workflows = [
  {
    code: "MEX-HM-014",
    title: "Rescate en alta montaña",
    region: "Pico de Orizaba",
    due: "SLA 18 min",
    progress: 72,
    status: "Dron en ruta",
    steps: [
      ["alerta", "SOS Garmin/InReach recibido", "aprobado"],
      ["validación", "Geocerca y altitud confirmadas", "aprobado"],
      ["drone", "Reconocimiento térmico aéreo", "en curso"],
      ["brigada", "Equipo terrestre activado", "en curso"],
      ["autoridad", "Parque y Protección Civil", "pendiente"],
    ],
  },
  {
    code: "MEX-BEACH-031",
    title: "Monitoreo de playa y rescate acuático",
    region: "Puerto Escondido",
    due: "SLA 9 min",
    progress: 48,
    status: "Riesgo moderado",
    steps: [
      ["detección", "Corriente de retorno localizada", "aprobado"],
      ["dron", "Patrullaje visual activo", "en curso"],
      ["salvavidas", "Equipo notificado", "en curso"],
      ["turistas", "Señalización preventiva", "pendiente"],
      ["reporte", "Bitácora para autoridades", "pendiente"],
    ],
  },
  {
    code: "MEX-PARK-008",
    title: "Control preventivo de senderos",
    region: "Nevado de Toluca",
    due: "SLA 30 min",
    progress: 61,
    status: "Operación estable",
    steps: [
      ["guías", "Check-in de grupos", "aprobado"],
      ["clima", "Cambio de temperatura", "aprobado"],
      ["rutas", "Zona de hielo marcada", "en curso"],
      ["dron", "Barrido de ruta secundaria", "pendiente"],
      ["cierre", "Recomendación de acceso", "pendiente"],
    ],
  },
];

const fleet = [
  { name: "DR-Águila 01", base: "Orizaba", battery: 84, mission: "Térmico / Altitud", status: "Disponible" },
  { name: "DR-Volcán 04", base: "Iztaccíhuatl", battery: 62, mission: "Ruta glaciar", status: "En misión" },
  { name: "DR-Costa 02", base: "Oaxaca", battery: 91, mission: "Corrientes / playa", status: "Disponible" },
  { name: "DR-Parque 07", base: "Toluca", battery: 44, mission: "Senderos", status: "Carga rápida" },
];

const aiAlerts = [
  {
    title: "Riesgo de hipotermia",
    place: "Pico de Orizaba",
    confidence: 86,
    detail: "Baja temperatura, inmovilidad relativa y altitud alta. Priorizar cámara térmica y contacto satelital.",
    action: "Enviar dron térmico y activar protocolo médico.",
    severity: "Crítico",
  },
  {
    title: "Grupo fuera de ruta",
    place: "Nevado de Toluca",
    confidence: 73,
    detail: "El track Garmin se separó 420 m del sendero autorizado durante 14 minutos.",
    action: "Enviar notificación al guía y marcar waypoint seguro.",
    severity: "Atención",
  },
  {
    title: "Ráfagas peligrosas",
    place: "Iztaccíhuatl",
    confidence: 79,
    detail: "Modelo meteorológico sugiere cierre de ventana en menos de 50 minutos.",
    action: "Recomendar descenso y bloquear nuevas salidas.",
    severity: "Preventivo",
  },
];

const zones = [
  { name: "Pico de Orizaba", type: "Alta montaña", risk: "Alto", guides: 22, devices: 41, color: "bg-rose-500/10 text-rose-700 ring-rose-200", icon: "mountain" },
  { name: "Iztaccíhuatl", type: "Alta montaña", risk: "Medio", guides: 18, devices: 36, color: "bg-amber-500/10 text-amber-700 ring-amber-200", icon: "mountain" },
  { name: "Nevado de Toluca", type: "Parque", risk: "Medio", guides: 31, devices: 52, color: "bg-amber-500/10 text-amber-700 ring-amber-200", icon: "binoculars" },
  { name: "Puerto Escondido", type: "Playa", risk: "Variable", guides: 14, devices: 27, color: "bg-sky-500/10 text-sky-700 ring-sky-200", icon: "waves" },
  { name: "Tulum / Caribe", type: "Playa", risk: "Bajo", guides: 9, devices: 19, color: "bg-emerald-500/10 text-emerald-700 ring-emerald-200", icon: "waves" },
];

function StatusPill({ children, tone = "dark" }) {
  const classes = {
    dark: "bg-slate-950 text-white shadow-black/10",
    blue: "bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/25",
    gold: "bg-amber-300/15 text-amber-100 ring-1 ring-amber-300/25",
    green: "bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/25",
    amber: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    red: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
    light: "bg-white/80 text-slate-900 ring-1 ring-white/70",
  };
  return <span className={`inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide shadow-sm ${classes[tone] || classes.dark}`}>{children}</span>;
}

function ProgressBar({ value, dark = false }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-slate-200"}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200" style={{ width: `${value}%` }} />
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/12 bg-white/[0.075] shadow-2xl shadow-black/20 backdrop-blur-2xl ${className}`}>{children}</div>;
}

function SectionTitle({ eyebrow, title, text, light = false }) {
  return (
    <div>
      <StatusPill tone={light ? "blue" : "dark"}>{eyebrow}</StatusPill>
      <h2 className={`mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl ${light ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {text && <p className={`mt-5 max-w-2xl text-lg leading-8 ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
    </div>
  );
}

export default function RescueOperationsHub() {
  const [selectedRegion, setSelectedRegion] = useState("Todos");
  const filteredZones = useMemo(() => {
    if (selectedRegion === "Todos") return zones;
    return zones.filter((zone) => zone.type === selectedRegion);
  }, [selectedRegion]);

  return (
    <main className="min-h-screen bg-[#eef3f4] text-slate-950 antialiased">
      <section className="relative isolate min-h-[940px] overflow-hidden bg-[#071116] text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.28),transparent_28%),radial-gradient(circle_at_20%_70%,rgba(16,185,129,0.22),transparent_25%),linear-gradient(135deg,#061014_0%,#0b1720_45%,#05070a_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute right-0 top-24 -z-10 h-[680px] w-[680px] rounded-full border border-cyan-300/20 bg-cyan-300/5 blur-sm" />
        <div className="absolute bottom-[-280px] left-[-160px] -z-10 h-[620px] w-[620px] rounded-full bg-emerald-300/10 blur-3xl" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-2xl shadow-cyan-500/20">
              <Icon name="shield" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-300 ring-4 ring-[#071116]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-200">O7 Rescue</p>
              <p className="text-sm font-semibold text-white/85">Mountain & Coastal Safety OS</p>
            </div>
          </div>
          <div className="hidden items-center gap-7 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur-xl md:flex">
            <a className="hover:text-cyan-200" href="#operations">Operaciones</a>
            <a className="hover:text-cyan-200" href="#drones">Drones</a>
            <a className="hover:text-cyan-200" href="#garmin">Garmin</a>
            <a className="hover:text-cyan-200" href="#zones">Zonas</a>
          </div>
          <button className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-100">
            Solicitar demo
          </button>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="blue">Rescue Intelligence Platform</StatusPill>
              <StatusPill tone="gold">México · montaña · costa</StatusPill>
            </div>
            <h1 className="mt-7 max-w-5xl text-6xl font-black leading-[0.92] tracking-[-0.06em] md:text-8xl">
              Drones, Garmin y AI para rescate de alto riesgo.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-300">
              Centro de mando premium para coordinar guías, dispositivos satelitales, drones térmicos, clima, bitácoras y autoridades en zonas de montaña, parques y playas.
            </p>
          </div>

          <div className="relative">
            <GlassCard className="relative overflow-hidden p-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#08151d]/95 p-5">
                <div className="grid gap-3">
                  {commandSignals.map((signal) => (
                    <div key={signal.title} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-200 to-emerald-200 text-slate-950">
                          <Icon name={signal.icon} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="mt-2 font-black text-white">{signal.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{signal.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-24 grid max-w-7xl gap-4 px-6 md:grid-cols-4">
        {missionStats.map((stat) => (
          <div key={stat.label} className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-slate-900/10">
            <p className="mt-6 text-5xl font-black tracking-[-0.05em]">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <section id="operations" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-5">
          {workflows.map((flow) => (
            <div key={flow.code} className="rounded-[2.2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/[0.04]">
              <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">{flow.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="drones" className="relative overflow-hidden bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {fleet.map((item) => (
              <div key={item.name} className="rounded-[2.2rem] border border-slate-200 bg-slate-950 p-6 text-white">
                <h3 className="mt-7 text-2xl font-black tracking-[-0.04em]">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="garmin" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 lg:col-span-1">
            <h2 className="relative mt-6 text-4xl font-black tracking-[-0.05em]">Integración Garmin / InReach para guías.</h2>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071116] py-24 text-white">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-4">
            {aiAlerts.map((alert) => (
              <div key={alert.title} className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-6">
                <h3 className="mt-1 text-3xl font-black tracking-[-0.04em]">{alert.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="zones" className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow="Zonas operativas" title="De volcanes a playas: una plataforma nacional escalable." />
          <div className="flex flex-wrap gap-2 rounded-full bg-white p-2 shadow-xl shadow-slate-900/[0.04] ring-1 ring-slate-200">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${selectedRegion === region ? "bg-slate-950 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredZones.map((zone) => (
            <div key={zone.name} className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/[0.04]">
              <h3 className="mt-7 text-3xl font-black tracking-[-0.04em]">{zone.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-12">
          <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] md:text-6xl">Backend listo para misiones reales, no solo para una landing.</h2>
        </div>
      </section>
    </main>
  );
}
