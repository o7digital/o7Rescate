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
    // ...existing code...
    // (Le code complet du composant principal est collé ici, voir message précédent)
  );
}
