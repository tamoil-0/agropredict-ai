"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "leaflet-draw/dist/leaflet.draw.css";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const FeatureGroup = dynamic(
  () => import("react-leaflet").then((m) => m.FeatureGroup),
  { ssr: false }
);
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((m) => m.EditControl),
  { ssr: false }
);

// === LEAFLET DINÁMICO ===
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const etapasCultivo: Record<string, { stage: string; min: number; max: number }[]> = {
  "Corn (Maize)": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Emergence", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 600 },
    { stage: "🌸 Flowering", min: 600, max: 1000 },
    { stage: "🌾 Harvest", min: 1000, max: 1600 },
    
  ],
  "Wheat (Bread)": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌱 Emergence", min: 120, max: 300 },
    { stage: "🌿 Vegetative", min: 300, max: 700 },
    { stage: "🌸 Flowering", min: 700, max: 1100 },
    { stage: "🌾 Harvest", min: 1100, max: 1600 },
  ],
  "Rice": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌱 Emergence", min: 120, max: 300 },
    { stage: "🌿 Vegetative", min: 300, max: 700 },
    { stage: "🌸 Flowering", min: 700, max: 1100 },
    { stage: "🌾 Harvest", min: 1100, max: 1600 },
  ],
  "Soybean": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Emergence", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 550 },
    { stage: "🌸 Flowering", min: 550, max: 900 },
    { stage: "🌾 Harvest", min: 900, max: 1400 },
  ],
  "Bean": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Emergence", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 550 },
    { stage: "🌸 Flowering", min: 550, max: 850 },
    { stage: "🌾 Harvest", min: 850, max: 1300 },
  ],
  "Potato": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌱 Emergence", min: 120, max: 300 },
    { stage: "🌿 Vegetative", min: 300, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 750 },
    { stage: "🌾 Harvest", min: 750, max: 1200 },
  ],
  "Tomato": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Seedling", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 600 },
    { stage: "🌸 Flowering", min: 600, max: 950 },
    { stage: "🌾 Harvest", min: 950, max: 1600 },
  ],
  "Onion": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Emergence", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 600 },
    { stage: "🌾 Harvest", min: 600, max: 1100 },
  ],
  "Lettuce": [
    { stage: "🌱 Start of Season", min: 0, max: 80 },
    { stage: "🌱 Emergence", min: 80, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 350 },
    { stage: "🌾 Harvest", min: 350, max: 600 },
  ],
  "Watermelon / Melon": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌱 Emergence", min: 120, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 550 },
    { stage: "🌸 Flowering", min: 550, max: 850 },
    { stage: "🍈 Fruit", min: 850, max: 1200 },
  ],
  "Sunflower": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌱 Emergence", min: 100, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 600 },
    { stage: "🌸 Flowering", min: 600, max: 900 },
    { stage: "🌾 Harvest", min: 900, max: 1300 },
  ],
  "Sorghum": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌱 Emergence", min: 120, max: 250 },
    { stage: "🌿 Vegetative", min: 250, max: 600 },
    { stage: "🌸 Flowering", min: 600, max: 950 },
    { stage: "🌾 Harvest", min: 950, max: 1300 },
  ],
  "Cotton": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌱 Emergence", min: 150, max: 300 },
    { stage: "🌿 Vegetative", min: 300, max: 700 },
    { stage: "🌸 Flowering", min: 700, max: 1100 },
    { stage: "🌾 Harvest", min: 1100, max: 1600 },
  ],
  "Sugarcane": [
    { stage: "🌱 Start of Season", min: 0, max: 200 },
    { stage: "🌱 Sprout", min: 200, max: 500 },
    { stage: "🌿 Vegetative", min: 500, max: 1200 },
    { stage: "🌾 Harvest", min: 1200, max: 2000 },
  ],
  "Avocado (Hass)": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 900 },
    { stage: "🍈 Fruit", min: 900, max: 1400 },
    { stage: "🌾 Maturity", min: 1400, max: 2200 },
  ],
  "Grape (Table / Wine)": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌱 Sprout", min: 150, max: 400 },
    { stage: "🌸 Flowering", min: 400, max: 800 },
    { stage: "🍇 Fruit", min: 800, max: 1200 },
    { stage: "🌾 Harvest", min: 1200, max: 1600 },
  ],
  "Mango": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 900 },
    { stage: "🍈 Fruit", min: 900, max: 1400 },
  ],
  "Blueberry": [
    { stage: "🌱 Start of Season", min: 0, max: 100 },
    { stage: "🌿 Vegetative", min: 100, max: 400 },
    { stage: "🌸 Flowering", min: 400, max: 700 },
    { stage: "🍈 Fruit", min: 700, max: 1000 },
  ],
  "Banana / Plantain": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 800 },
    { stage: "🍌 Production", min: 800, max: 1400 },
  ],
  "Citrus (Orange / Mandarin / Lemon)": [
    { stage: "🌱 Start of Season", min: 0, max: 120 },
    { stage: "🌿 Vegetative", min: 120, max: 400 },
    { stage: "🌸 Flowering", min: 400, max: 800 },
    { stage: "🍊 Fruit", min: 800, max: 1300 },
  ],
  "Pineapple": [
    { stage: "🌱 Start of Season", min: 0, max: 200 },
    { stage: "🌿 Vegetative", min: 200, max: 900 },
    { stage: "🍍 Fruit", min: 900, max: 1400 },
  ],
  "Strawberry": [
    { stage: "🌱 Start of Season", min: 0, max: 80 },
    { stage: "🌱 Sprout", min: 80, max: 200 },
    { stage: "🌿 Vegetative", min: 200, max: 400 },
    { stage: "🍓 Fruit", min: 400, max: 700 },
  ],
  "Cocoa": [
    { stage: "🌱 Start of Season", min: 0, max: 200 },
    { stage: "🌿 Vegetative", min: 200, max: 700 },
    { stage: "🌸 Flowering", min: 700, max: 1100 },
    { stage: "🍈 Fruit", min: 1100, max: 1600 },
  ],
  "Coffee": [
    { stage: "🌱 Start of Season", min: 0, max: 200 },
    { stage: "🌿 Vegetative", min: 200, max: 700 },
    { stage: "🌸 Flowering", min: 700, max: 1100 },
    { stage: "🍈 Fruit", min: 1100, max: 1600 },
  ],
  "Apple": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 800 },
    { stage: "🍎 Fruit", min: 800, max: 1300 },
  ],
  "Peach / Nectarine": [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 800 },
    { stage: "🍑 Fruit", min: 800, max: 1300 },
  ],
  default: [
    { stage: "🌱 Start of Season", min: 0, max: 150 },
    { stage: "🌿 Vegetative", min: 150, max: 500 },
    { stage: "🌸 Flowering", min: 500, max: 900 },
    { stage: "🌾 Harvest", min: 900, max: 1400 },
  ],
};



// === CULTIVOS POR REGIÓN ===
// === CULTIVOS POR REGIÓN (todas las 24 regiones con todos los cultivos) ===
const cultivosPorRegion: Record<string, string[]> = {
  Amazonas: [],
  Áncash: [],
  Apurímac: [],
  Arequipa: [],
  Ayacucho: [],
  Cajamarca: [],
  Callao: [],
  Cusco: [],
  Huancavelica: [],
  Huánuco: [],
  Ica: [],
  Junín: [],
  LaLibertad: [],
  Lambayeque: [],
  Lima: [],
  Loreto: [],
  MadreDeDios: [],
  Moquegua: [],
  Pasco: [],
  Piura: [],
  Puno: [],
  SanMartín: [],
  Tacna: [],
  Tumbes: [],
  Ucayali: [],
  default: []
};
// ✅ Añadimos los 26 cultivos a todas las regiones
const cultivosGlobales = [
  "Corn (Maize)",
  "Wheat (Bread)",
  "Rice",
  "Soybean",
  "Bean",
  "Potato",
  "Tomato",
  "Onion",
  "Lettuce",
  "Watermelon / Melon",
  "Sunflower",
  "Sorghum",
  "Cotton",
  "Sugarcane",
  "Avocado (Hass)",
  "Grape (Table / Wine)",
  "Mango",
  "Blueberry",
  "Banana / Plantain",
  "Citrus (Orange / Mandarin / Lemon)",
  "Pineapple",
  "Strawberry",
  "Cocoa",
  "Coffee",
  "Apple",
  "Peach / Nectarine"
];

// ✅ Automatically fill each region with all crops
Object.keys(cultivosPorRegion).forEach(region => {
  if (region !== "default") cultivosPorRegion[region] = [...cultivosGlobales];
});
cultivosPorRegion.default = [...cultivosGlobales];

function evaluarViabilidadCultivo(tempPromedio: number, cultivo: string) {
  const info = parametrosCultivo[cultivo] || parametrosCultivo.default;

  if (tempPromedio < info.Tbase) return "🌨️ Not viable (low temperature)";
  if (tempPromedio >= info.ToptMin && tempPromedio <= info.ToptMax) return "🌿 Crop viable and active";
  if (tempPromedio > info.ToptMax) return "🔥 Heat stress (high temperature)";
  return "⚠️ Suboptimal conditions";
}

// === THERMAL PARAMETERS ===
const parametrosCultivo: Record<string, { Tbase: number; ToptMin: number; ToptMax: number }> = {
  "Corn (Maize)": { Tbase: 10, ToptMin: 20, ToptMax: 30 },
  "Wheat (Bread)": { Tbase: 4, ToptMin: 15, ToptMax: 25 },
  "Rice": { Tbase: 11, ToptMin: 22, ToptMax: 32 },
  "Soybean": { Tbase: 8, ToptMin: 20, ToptMax: 30 },
  "Bean": { Tbase: 9, ToptMin: 18, ToptMax: 28 },
  "Potato": { Tbase: 7, ToptMin: 15, ToptMax: 21 },
  "Tomato": { Tbase: 10, ToptMin: 20, ToptMax: 26 },
  "Onion": { Tbase: 5, ToptMin: 15, ToptMax: 22 },
  "Lettuce": { Tbase: 4, ToptMin: 15, ToptMax: 20 },
  "Watermelon / Melon": { Tbase: 13, ToptMin: 20, ToptMax: 30 },
  "Sunflower": { Tbase: 8, ToptMin: 18, ToptMax: 28 },
  "Sorghum": { Tbase: 10, ToptMin: 20, ToptMax: 30 },
  "Cotton": { Tbase: 15, ToptMin: 25, ToptMax: 35 },
  "Sugarcane": { Tbase: 12, ToptMin: 22, ToptMax: 32 },
  "Avocado (Hass)": { Tbase: 10, ToptMin: 17, ToptMax: 24 },
  "Grape (Table / Wine)": { Tbase: 10, ToptMin: 20, ToptMax: 30 },
  "Mango": { Tbase: 13, ToptMin: 24, ToptMax: 33 },
  "Blueberry": { Tbase: 7, ToptMin: 16, ToptMax: 22 },
  "Banana / Plantain": { Tbase: 14, ToptMin: 24, ToptMax: 32 },
  "Citrus (Orange / Mandarin / Lemon)": { Tbase: 12, ToptMin: 20, ToptMax: 30 },
  "Pineapple": { Tbase: 15, ToptMin: 25, ToptMax: 33 },
  "Strawberry": { Tbase: 5, ToptMin: 15, ToptMax: 22 },
  "Cocoa": { Tbase: 15, ToptMin: 22, ToptMax: 30 },
  "Coffee": { Tbase: 13, ToptMin: 20, ToptMax: 26 },
  "Apple": { Tbase: 6, ToptMin: 15, ToptMax: 22 },
  "Peach / Nectarine": { Tbase: 7, ToptMin: 15, ToptMax: 22 },
  default: { Tbase: 10, ToptMin: 15, ToptMax: 25 },
};


export default function DemoPage() {
    const router = useRouter();

  const [temp, setTemp] = useState<number | null>(null);
  const [hum, setHum] = useState<number | null>(null);
  const [pres, setPres] = useState<number | null>(null);
  const [alt, setAlt] = useState<number | null>(null);
  const [phase, setPhase] = useState("⏳ Calculando...");
  const [indice, setIndice] = useState(0);
  const [drawingMode, setDrawingMode] = useState(false);
  const [areaData, setAreaData] = useState<any>(null);
  const [cultivo, setCultivo] = useState("");
  const mapRef = useRef<any>(null);
  const [agroIcon, setAgroIcon] = useState<any>(null);
   const [fechaSiembra, setFechaSiembra] = useState<string>("");
  const [gddTotal, setGddTotal] = useState<number>(0);
  const [etapa, setEtapa] = useState<string>("—");
  const [historialGDD, setHistorialGDD] = useState<
    { fecha: string; Tmax: number; Tmin: number; gdd: number; acumulado: number }[]
  >([]);
// === CHATBOT ===
const [chatOpen, setChatOpen] = useState(false);
const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
  { sender: "bot", text: "👋 Hi there! I'm AgroPredict AI 🌾. How can I help you today?" },
]);

const [inputMsg, setInputMsg] = useState("");
const [isTyping, setIsTyping] = useState(false);


// ✅ Aquí va la nueva función — fuera del return
async function handleSend() {
  if (!inputMsg.trim()) return;

  const userMsg = { sender: "user", text: inputMsg.trim() };
  setMessages((prev) => [...prev, userMsg]);
  const userText = inputMsg;
  setInputMsg("");

  // ⏳ Mostrar animación de “escribiendo...”
  setIsTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
        context: { temp, hum, pres, alt, phase, indice },
      }),
    });

    const data = await res.json();
    const reply = { sender: "bot", text: data.reply };

    // 💬 Añadir respuesta del bot
    setMessages((prev) => [...prev, reply]);
  } catch (err) {
  console.error("Chat error:", err);
  const errorReply = {
    sender: "bot",
    text: "⚠️ Unable to connect to the AI. Please check the server or API key.",
  };

    setMessages((prev) => [...prev, errorReply]);
  } finally {
    // ✅ Ocultar animación de “escribiendo...”
    setIsTyping(false);
  }
}



// === REGIONES DEL PERÚ ===
const regiones: Record<string, { lat: number; lon: number }> = {
  Amazonas: { lat: -5.12, lon: -78.45 },           // Chachapoyas
  Áncash: { lat: -9.53, lon: -77.53 },             // Huaraz
  Apurímac: { lat: -13.64, lon: -73.39 },          // Abancay
  Arequipa: { lat: -16.39, lon: -71.54 },          // Arequipa
  Ayacucho: { lat: -13.16, lon: -74.22 },          // Ayacucho
  Cajamarca: { lat: -7.16, lon: -78.51 },          // Cajamarca
  Callao: { lat: -12.06, lon: -77.13 },            // Callao
  Cusco: { lat: -13.52, lon: -71.97 },             // Cusco
  Huancavelica: { lat: -12.78, lon: -74.97 },      // Huancavelica
  Huánuco: { lat: -9.93, lon: -76.24 },            // Huánuco
  Ica: { lat: -14.07, lon: -75.73 },               // Ica
  Junín: { lat: -11.16, lon: -75.99 },             // Huancayo
  LaLibertad: { lat: -8.11, lon: -79.03 },         // Trujillo
  Lambayeque: { lat: -6.77, lon: -79.84 },         // Chiclayo
  Lima: { lat: -12.04, lon: -77.03 },              // Lima
  Loreto: { lat: -3.75, lon: -73.25 },             // Iquitos
  MadreDeDios: { lat: -12.59, lon: -69.19 },       // Puerto Maldonado
  Moquegua: { lat: -17.19, lon: -70.93 },          // Moquegua
  Pasco: { lat: -10.68, lon: -76.26 },             // Cerro de Pasco
  Piura: { lat: -5.19, lon: -80.63 },              // Piura
  Puno: { lat: -15.84, lon: -70.02 },              // Puno
  SanMartín: { lat: -6.46, lon: -76.38 },          // Moyobamba/Tarapoto
  Tacna: { lat: -18.01, lon: -70.25 },             // Tacna
  Tumbes: { lat: -3.57, lon: -80.45 },             // Tumbes
  Ucayali: { lat: -8.38, lon: -74.53 },            // Pucallpa
};


  const [regionSeleccionada, setRegionSeleccionada] = useState<keyof typeof regiones>("LaLibertad");
  const [position, setPosition] = useState(regiones.LaLibertad);
  const [cultivosRegion, setCultivosRegion] = useState<string[]>(cultivosPorRegion.LaLibertad);
  useEffect(() => {
  if (historialGDD.length === 0) return;
  import("chart.js/auto").then(({ default: Chart }) => {
    const ctx = document.getElementById("gddChart") as HTMLCanvasElement;
    if (!ctx) return;

    if ((window as any).gddChart) (window as any).gddChart.destroy();

    (window as any).gddChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: historialGDD.map(d => d.fecha),
        datasets: [
          {
            label: "GDD Accumulated",
            data: historialGDD.map(d => d.acumulado),
            borderColor: "#f59e0b",
            backgroundColor: "rgba(251,191,36,0.3)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: "#666" } }, y: { ticks: { color: "#666" } } },
      },
    });
  });
}, [historialGDD]);

useEffect(() => {
  if (!fechaSiembra || !cultivo) return;
  const info = parametrosCultivo[cultivo] || parametrosCultivo.default;

  const fechaInicio = new Date(fechaSiembra);
  const hoy = new Date();
  const dias = Math.max(1, Math.floor((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));

  let acumulado = 0;
  const datosSimulados: { fecha: string; Tmax: number; Tmin: number; gdd: number; acumulado: number }[] = [];

for (let i = 0; i < dias; i++) {
  const fecha = dayjs(fechaInicio).add(i, "day");
  
  // 🔹 Temperaturas según región (más frío en Puno, más cálido en Piura)
  const baseRegional =
    regionSeleccionada === "Puno" ? 12 :
    regionSeleccionada === "Cusco" ? 15 :
    regionSeleccionada === "Piura" ? 26 :
    regionSeleccionada === "LaLibertad" ? 22 :
    20;

  const Tmax = baseRegional + Math.random() * 5; // ligera variación
  const Tmin = baseRegional - (4 + Math.random() * 3);

  const GDD = Math.max(0, ((Tmax + Tmin) / 2) - info.Tbase);
  acumulado += GDD;

  datosSimulados.push({
    fecha: fecha.format("YYYY-MM-DD"),
    Tmax: parseFloat(Tmax.toFixed(1)),
    Tmin: parseFloat(Tmin.toFixed(1)),
    gdd: parseFloat(GDD.toFixed(2)),
    acumulado: parseFloat(acumulado.toFixed(2)),
  });
}


  setHistorialGDD(datosSimulados);
  setGddTotal(acumulado);

const etapas = etapasCultivo[cultivo] || etapasCultivo.default;

// Buscar etapa actual dentro de rango
let etapaActual = etapas.find(e => acumulado >= e.min && acumulado <= e.max)?.stage;

// 🔹 Si supera el máximo de la última etapa, mostrar “Harvest finished”
const ultimaEtapa = etapas[etapas.length - 1];
if (acumulado > ultimaEtapa.max) {
  etapaActual = "🌾 Harvest finished (Final stage)";
}

// Si no encuentra ninguna etapa, usar texto por defecto
if (!etapaActual) etapaActual = "🌱 In Emergency";

setEtapa(etapaActual);
}, [fechaSiembra, cultivo]);

  // === ICONO LEAFLET ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then(L => {
      const icon = L.divIcon({
        html: `<img src="/img/logo-agropredict.png" style="width:45px;height:45px;border-radius:50%;object-fit:cover;border:2px solid #4CAF50;box-shadow:0 0 4px rgba(0,0,0,0.4);">`,
        className: "",
        iconSize: [45, 45],
        iconAnchor: [22, 44],
        popupAnchor: [0, -45],
      });
      setAgroIcon(icon);
    });
  }, []);

  // === FUNCIÓN DIBUJO ===
  function handleDibujo(e: any) {
    const layer = e.layer;
    const coords = layer.getLatLngs()[0];
    if (coords.length < 3) return;

    const ndvi = (Math.random() * 0.5 + 0.5).toFixed(2);
    const Tmax = (Math.random() * 12 + 18).toFixed(1);
    const Tmin = (Math.random() * 8 + 5).toFixed(1);
    const info = parametrosCultivo[cultivo] || parametrosCultivo.default;
    const UC = ((parseFloat(Tmax) + parseFloat(Tmin)) / 2 - info.Tbase).toFixed(2);
let floracion = "🌱 Dormant";
if (parseFloat(UC) < 0) floracion = "🧊 :D";
else if (parseFloat(UC) < 5) floracion = "🌾 :D";
else if (parseFloat(UC) < 10) floracion = "🌿 :D";
else floracion = "🌸:D";

const color =
  floracion.includes("High") ? "#ff66b2" :
  floracion.includes("growth") ? "#00cc44" :
  floracion.includes("Vegetative") ? "#cccc00" : "#888888";

layer.setStyle({ color, fillColor: color, fillOpacity: 0.4 });
layer.bindPopup(`${cultivo} — GDD: ${UC}°C·day`).openPopup();


    setAreaData({
      ndvi,
      Tmax,
      Tmin,
      UC,
      floracion,
      cultivo,
      area: (Math.random() * 10 + 1).toFixed(2),
    });
  }

  // === ACTUALIZAR CULTIVOS ===
 useEffect(() => {
  const lista = cultivosPorRegion[regionSeleccionada] || cultivosPorRegion.default;
  setCultivosRegion(lista);
  setCultivo(lista[0]);

  // 💡 Mover el mapa suavemente hacia la nueva región seleccionada
  if (mapRef.current) {
    const map = mapRef.current;
    const { lat, lon } = regiones[regionSeleccionada];
    map.flyTo([lat, lon], 7, { duration: 2 }); // animación suave de 2 segundos
  }

  // Actualizar posición del marcador
  setPosition(regiones[regionSeleccionada]);
}, [regionSeleccionada]);

  // === DATOS IOT ===
  useEffect(() => {
    async function fetchDatos() {
      try {
        const res = await fetch("https://api.thingspeak.com/channels/3100267/feeds.json?api_key=U1BNLJRW2T73CNW8&results=10");
        const data = await res.json();
        const last = data.feeds?.[data.feeds.length - 1];
        if (!last) return;

        const t = parseFloat(last.field1);
        const h = parseFloat(last.field2);
        const p = parseFloat(last.field3);
        const a = parseFloat(last.field4);

        setTemp(t); setHum(h); setPres(p); setAlt(a);
        const t_norm = Math.min(Math.max((t - 10) / 25, 0), 1);
        const h_norm = Math.min(Math.max(h / 100, 0), 1);
        const p_norm = Math.min(Math.max((1013 - Math.abs(1013 - p)) / 1013, 0), 1);
        const a_norm = Math.min(Math.max(1 - a / 3000, 0), 1);
        const index = (0.4 * t_norm + 0.3 * h_norm + 0.2 * p_norm + 0.1 * a_norm) * 100;
        setIndice(index);
      let estado = "🌱 Dormancy or stress";
if (index > 75) estado = "🌸 High probability of flowering";
else if (index > 50) estado = "🌿 Active growth";
else if (index > 30) estado = "🌾 Vegetative stage";
setPhase(estado);
} catch (err) {
  console.error("ThingSpeak error:", err);
}

    }
    fetchDatos();
    const interval = setInterval(fetchDatos, 20000);
    return () => clearInterval(interval);
  }, []);

  const colorFloracion =
    indice > 75 ? "from-pink-500 to-rose-400" :
    indice > 50 ? "from-green-500 to-emerald-400" :
    indice > 30 ? "from-yellow-400 to-amber-400" : "from-slate-400 to-gray-400";

  // === UI ===
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-slate-50 flex flex-col items-center font-sans">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-md border-b border-blue-100 z-50">
        <div className="flex items-center gap-3">
          <Image src="/img/logo-agropredict.png" alt="logo" width={45} height={45} className="rounded-xl shadow-md" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            AgroPredict AI — GDD 🌡️
          </span>
        </div>
          <button
    onClick={() => router.push("/")}
    className="px-4 py-2 rounded-lg text-sm font-semibold text-white 
               bg-gradient-to-r from-blue-600 to-emerald-500 
               hover:from-blue-700 hover:to-emerald-600 transition-all 
               shadow-md border border-emerald-200 flex items-center gap-2"
  >
    ← Back to top
  </button>

      </header>

      {/* CONTENIDO */}
      <section className="flex flex-col md:grid md:grid-cols-2 gap-8 mt-28 w-full max-w-7xl items-start">
        {/* MAPA */}
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-5 h-[600px] relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-slate-800">🗺️ Regions of Peru — NDVI + GDD</h3>
            <div className="flex gap-2 items-center">
              <select
                value={regionSeleccionada}
                onChange={(e) => {
                  const sel = e.target.value as keyof typeof regiones;
                  setRegionSeleccionada(sel);
                  setPosition(regiones[sel]);
                }}
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700 font-medium shadow-sm"
              >
                {Object.keys(regiones).map((r) => <option key={r}>{r}</option>)}
              </select>
              <button
                onClick={() => setDrawingMode(!drawingMode)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  drawingMode ? "bg-red-500" : "bg-blue-500"
                } text-white`}
              >
               {drawingMode ? "🛑 Disable" : "✏️ Draw Area"}

              </button>
            </div>
          </div>

          <MapContainer center={[position.lat, position.lon]} zoom={7} ref={mapRef} style={{ height: "530px", borderRadius: "1rem" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
            <TileLayer
              url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${new Date().toISOString().slice(0,10)}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
              attribution="Imagery © NASA GIBS"
              opacity={0.5}
            />
            {drawingMode && (
              <FeatureGroup>
               <EditControl
  position="topleft"
  draw={{
    polygon: true,
    rectangle: false,
    circle: false,
    circlemarker: false, // 🔴 Desactiva también el círculo pequeño
    polyline: false,
    marker: false,
  }}
  edit={{ remove: true }}
  onCreated={handleDibujo}
/>

              </FeatureGroup>
            )}
            {agroIcon && (
              <Marker position={[position.lat, position.lon]} icon={agroIcon}>
                <Popup><strong>{regionSeleccionada}</strong><br />NDVI + GDD — AgroPredict AI 🌱</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* PANEL DERECHO */}
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8 flex flex-col items-center transition-all">
          {!drawingMode ? (
            <><h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">
  🌾 IoT Dashboard — Real Data
</h2>
<p className="text-sm text-slate-600 mb-4">
  Real-time data from physical sensors.
</p>

              <div className="grid grid-cols-2 gap-5 w-full mb-6">
                {[{ label: "🌡️ Temperature", value: temp, unit: "°C", color: "from-blue-500 to-sky-400" },
{ label: "💧 Humidity", value: hum, unit: "%", color: "from-emerald-500 to-green-400" },
{ label: "🌬️ Pressure", value: pres, unit: "hPa", color: "from-cyan-500 to-blue-400" },
{ label: "⛰️ Altitude", value: alt, unit: "m", color: "from-amber-500 to-yellow-400" }].map((d) => (
                  <div key={d.label} className={`rounded-xl shadow-lg p-5 text-center bg-gradient-to-br ${d.color} text-white`}>
                    <h3 className="text-lg font-semibold">{d.label}</h3>
                    <p className="text-3xl font-bold mt-1">{d.value ? d.value.toFixed(1) : "—"} {d.unit}</p>
                  </div>
                ))}
              </div>
<div className="text-center w-full mb-6">
  <h3 className="text-lg font-semibold text-slate-700 mb-1">🌼 Crop Status</h3>
  <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">{phase}</p>
  <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
    <div
      className={`h-full bg-gradient-to-r ${colorFloracion} transition-all duration-700`}
      style={{ width: `${indice.toFixed(0)}%` }}
    ></div>
  </div>
  <p className="mt-2 text-slate-600 text-sm">Flowering index: {indice.toFixed(1)}%</p>
</div>

            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent mb-6">🟩 GDD Analysis of the Area</h2>
              <select
                value={cultivo}
                onChange={(e) => setCultivo(e.target.value)}
                className="px-3 py-2 mb-5 rounded-lg border border-amber-300 bg-white text-slate-700 font-medium shadow-sm"
              >
                {cultivosRegion.map((c) => <option key={c}>{c}</option>)}
              </select>
<div className="mt-5 w-full text-center">
  <label className="block text-sm font-semibold text-slate-700 mb-1">📅 Campaign Start Date:</label>
  <input
    type="date"
    value={fechaSiembra}
    onChange={(e) => setFechaSiembra(e.target.value)}
    className="border border-amber-300 rounded-lg px-3 py-2 text-slate-700 shadow-sm focus:ring-2 focus:ring-amber-400"
  />
</div>
{fechaSiembra && (
  <div className="mt-5 w-full bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-amber-300 shadow-md p-5 text-center">
    <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent mb-2">
      🌼 Crop Development Summary
    </h3>
    <p className="text-lg text-amber-700 font-semibold mb-1">
      🌡️ Accumulated GDD: <span className="text-emerald-600">{gddTotal.toFixed(1)} °C·day</span>
    </p>
    <p className="text-md text-green-700 font-semibold mb-3">
      📈 Current Stage: {etapa}
    </p>
    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-green-500 to-emerald-600"
        style={{ width: `${Math.min((gddTotal / 2200) * 100, 100)}%` }}
      ></div>
    </div>
    <p className="text-xs text-slate-500 italic">
      Calculated from {dayjs(fechaSiembra).format("DD MMM YYYY")} to {dayjs().format("DD MMM YYYY")}
    </p>
  </div>
)}


{!areaData ? (
  <p className="text-slate-600 mt-10">🕐 Draw an area to calculate the Growing Degree Days (GDD)</p>
) : (
  <div className="text-center space-y-3">
    <p className="text-lg text-slate-800 font-semibold">🌾 Crop: {areaData.cultivo}</p>
    <p className="text-green-600 text-lg font-semibold">🔥 GDD: {areaData.UC} °C·day</p>
    <p className="text-slate-700">Tmax: {areaData.Tmax} °C — Tmin: {areaData.Tmin} °C</p>
    <p className="text-slate-700">NDVI: {areaData.ndvi}</p>
    <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">{areaData.floracion}</p>
    <p className="text-slate-500 text-sm">Estimated area: {areaData.area} km²</p>
    <p className="text-sm text-slate-600 mt-1">
      {evaluarViabilidadCultivo(temp ?? 20, cultivo)}
    </p>


  </div>
)}

            </>
          )}
        </div>
      </section>

   {/* === CHATBOT FLOTANTE MEJORADO PRO === */}
<div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
  {/* BOTÓN FLOTANTE */}
  <button
    onClick={() => setChatOpen(!chatOpen)}
    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 shadow-xl hover:scale-110 transition-all flex items-center justify-center"
  >
    <Image
      src="/img/logo-agropredict.png"
      alt="AgroPredict"
      width={52}
      height={52}
      className="rounded-full border-2 border-white shadow-md"
    />
    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
      💬
    </span>
  </button>

  {/* VENTANA CHAT */}
  {chatOpen && (
    <div className="absolute bottom-20 right-0 w-96 h-[520px] bg-gradient-to-br from-white via-emerald-50 to-blue-50 border border-emerald-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow">
        <span className="text-lg">🤖</span>
        <span>AgroPredict AI Bot</span>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-2xl max-w-[85%] leading-relaxed shadow-sm transition-all ${
              msg.sender === "user"
                ? "bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-800 ml-auto rounded-br-none border border-emerald-200"
                : "bg-white/90 text-slate-800 border border-blue-100 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* ANIMACIÓN DE “ESCRIBIENDO…” */}
        {isTyping && (
  <div className="flex items-center gap-2 text-emerald-600 text-xs ml-2">
    🌾 <div className="animate-dots flex gap-1">
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-[typingDots_1.2s_infinite]"></span>
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-[typingDots_1.2s_infinite]"></span>
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-[typingDots_1.2s_infinite]"></span>
    </div>
  </div>
)}

      </div>

      {/* SUGERENCIAS RÁPIDAS */}
      <div className="flex flex-wrap gap-2 px-4 pb-2 text-xs">
        {["¿Cuál cultivo florece mejor hoy?", "Dame un resumen climático", "¿Qué hacer si hay baja humedad?"].map(
          (sug, i) => (
            <button
              key={i}
              onClick={() => {
                setInputMsg(sug);
                handleSend();
              }}
              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 rounded-full text-emerald-700 font-medium shadow-sm transition-all"
            >
              {sug}
            </button>
          )
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-emerald-200 bg-white/70 backdrop-blur-sm flex gap-2">
        <textarea
  value={inputMsg}
  onChange={(e) => setInputMsg(e.target.value)}
  placeholder="🌱 Ask about your crop, climate, or flowering stage..."
  rows={1}
  className="flex-1 resize-none text-sm border border-emerald-300 rounded-xl px-4 py-2 
             focus:outline-none focus:ring-2 focus:ring-emerald-400 
             bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner"
  onKeyDown={(e) =>
    e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
  }
/>

        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl px-4 py-2 font-semibold shadow-md transition-all"
        >
          ➤
        </button>
      </div>
    </div>
  )}
</div>

    </main>
  );
}
