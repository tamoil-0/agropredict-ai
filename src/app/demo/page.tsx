"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RegionKey = "puno" | "juliaca" | "ilave" | "azangaro" | "ayaviri" | "sandia" | "yunguyo";
type CropKey = "papa" | "quinua" | "canihua" | "haba" | "cebada" | "avena" | "maiz" | "cafe";
type IrrigationKey = "tradicional" | "tecnificado";
type EnergyKey = "red" | "solar" | "mixto";

type Region = {
  name: string;
  zone: string;
  altitude: number;
  tempAvg: number;
  tempMin: number;
  tempMax: number;
  rainfallMonth: number;
  solar: number;
  soilMoisture: number;
  ndviBase: number;
  note: string;
};

type Crop = {
  name: string;
  variety: string;
  baseTemp: number;
  optimalMin: number;
  optimalMax: number;
  cycleDays: number;
  maturityGdd: number;
  waterSeasonMm: number;
  yieldTha: number;
  pricePenT: number;
  stages: { name: string; min: number; max: number; advice: string }[];
};

const DEMO_DATE = new Date("2026-05-21T12:00:00");

const regions: Record<RegionKey, Region> = {
  puno: {
    name: "Puno",
    zone: "Altiplano urbano-rural",
    altitude: 3827,
    tempAvg: 9.8,
    tempMin: 2.5,
    tempMax: 17.2,
    rainfallMonth: 38,
    solar: 5.6,
    soilMoisture: 42,
    ndviBase: 0.48,
    note: "Noches frias, alta radiacion y riesgo de estres hidrico al final de campana.",
  },
  juliaca: {
    name: "Juliaca",
    zone: "Altiplano norte",
    altitude: 3824,
    tempAvg: 10.6,
    tempMin: 1.8,
    tempMax: 18.9,
    rainfallMonth: 34,
    solar: 5.8,
    soilMoisture: 39,
    ndviBase: 0.45,
    note: "Mayor amplitud termica: buena energia solar, pero heladas frecuentes.",
  },
  ilave: {
    name: "Ilave",
    zone: "Cuenca del Titicaca",
    altitude: 3862,
    tempAvg: 10.1,
    tempMin: 2.2,
    tempMax: 18.1,
    rainfallMonth: 41,
    solar: 5.5,
    soilMoisture: 45,
    ndviBase: 0.5,
    note: "Influencia del lago: humedad moderada y menor estres que zonas interiores.",
  },
  azangaro: {
    name: "Azangaro",
    zone: "Altiplano ganadero-agricola",
    altitude: 3860,
    tempAvg: 9.4,
    tempMin: 0.8,
    tempMax: 17.6,
    rainfallMonth: 36,
    solar: 5.7,
    soilMoisture: 37,
    ndviBase: 0.43,
    note: "Zona fria con riesgo de helada; conviene priorizar cultivos andinos resistentes.",
  },
  ayaviri: {
    name: "Ayaviri",
    zone: "Melgar",
    altitude: 3918,
    tempAvg: 8.9,
    tempMin: 0.4,
    tempMax: 16.9,
    rainfallMonth: 33,
    solar: 5.9,
    soilMoisture: 35,
    ndviBase: 0.4,
    note: "Altitud elevada: crecimiento lento, baja temperatura base y buena radiacion solar.",
  },
  sandia: {
    name: "Sandia",
    zone: "Ceja de selva",
    altitude: 2030,
    tempAvg: 18.7,
    tempMin: 13.4,
    tempMax: 24.1,
    rainfallMonth: 118,
    solar: 4.6,
    soilMoisture: 68,
    ndviBase: 0.68,
    note: "Clima mas humedo y templado: ideal para cafe y frutales de ceja de selva.",
  },
  yunguyo: {
    name: "Yunguyo",
    zone: "Ribera del Titicaca",
    altitude: 3826,
    tempAvg: 10.9,
    tempMin: 3.1,
    tempMax: 18.5,
    rainfallMonth: 45,
    solar: 5.4,
    soilMoisture: 47,
    ndviBase: 0.52,
    note: "Microclima lacustre favorable para papa, haba y quinua con menor riesgo de helada.",
  },
};

const crops: Record<CropKey, Crop> = {
  papa: {
    name: "Papa nativa",
    variety: "Variedades altoandinas",
    baseTemp: 7,
    optimalMin: 12,
    optimalMax: 18,
    cycleDays: 145,
    maturityGdd: 1250,
    waterSeasonMm: 520,
    yieldTha: 13.5,
    pricePenT: 1250,
    stages: [
      { name: "Emergencia", min: 0, max: 180, advice: "Verificar prendimiento y evitar encharcamiento." },
      { name: "Crecimiento vegetativo", min: 180, max: 520, advice: "Mantener humedad uniforme; etapa sensible a heladas." },
      { name: "Tuberizacion", min: 520, max: 890, advice: "Priorizar riego eficiente: aqui se define gran parte del rendimiento." },
      { name: "Maduracion", min: 890, max: 1250, advice: "Reducir riego gradualmente y programar cosecha." },
    ],
  },
  quinua: {
    name: "Quinua",
    variety: "Altiplano",
    baseTemp: 3,
    optimalMin: 12,
    optimalMax: 20,
    cycleDays: 160,
    maturityGdd: 1350,
    waterSeasonMm: 390,
    yieldTha: 1.6,
    pricePenT: 5200,
    stages: [
      { name: "Emergencia", min: 0, max: 160, advice: "Vigilar humedad superficial para asegurar germinacion." },
      { name: "Ramificacion", min: 160, max: 520, advice: "Control temprano de malezas; bajo consumo de agua." },
      { name: "Panojamiento y floracion", min: 520, max: 980, advice: "Momento critico: evitar deficit hidrico y estres por calor." },
      { name: "Llenado de grano", min: 980, max: 1350, advice: "Monitorear madurez para cosecha uniforme." },
    ],
  },
  canihua: {
    name: "Canihua",
    variety: "Grano andino resistente",
    baseTemp: 2,
    optimalMin: 10,
    optimalMax: 18,
    cycleDays: 150,
    maturityGdd: 1150,
    waterSeasonMm: 330,
    yieldTha: 1.1,
    pricePenT: 6100,
    stages: [
      { name: "Emergencia", min: 0, max: 130, advice: "Buena opcion en zonas frias y con menor disponibilidad de agua." },
      { name: "Macollamiento", min: 130, max: 430, advice: "Mantener cobertura de suelo para conservar humedad." },
      { name: "Floracion", min: 430, max: 820, advice: "Evaluar heladas nocturnas y activar alertas tempranas." },
      { name: "Grano pastoso", min: 820, max: 1150, advice: "Planificar cosecha y secado." },
    ],
  },
  haba: {
    name: "Haba",
    variety: "Serrana",
    baseTemp: 5,
    optimalMin: 13,
    optimalMax: 20,
    cycleDays: 150,
    maturityGdd: 1200,
    waterSeasonMm: 470,
    yieldTha: 6.2,
    pricePenT: 1850,
    stages: [
      { name: "Emergencia", min: 0, max: 160, advice: "Revisar humedad del suelo y densidad de plantas." },
      { name: "Vegetativo", min: 160, max: 520, advice: "Favorecer nodulacion; no sobrefertilizar nitrogeno." },
      { name: "Floracion", min: 520, max: 900, advice: "Etapa sensible: deficit de agua reduce vainas." },
      { name: "Llenado de vaina", min: 900, max: 1200, advice: "Mantener humedad moderada hasta madurez." },
    ],
  },
  cebada: {
    name: "Cebada",
    variety: "Grano/forraje",
    baseTemp: 4,
    optimalMin: 12,
    optimalMax: 21,
    cycleDays: 125,
    maturityGdd: 1050,
    waterSeasonMm: 360,
    yieldTha: 2.4,
    pricePenT: 1500,
    stages: [
      { name: "Emergencia", min: 0, max: 120, advice: "Confirmar establecimiento del cultivo." },
      { name: "Macollamiento", min: 120, max: 380, advice: "Buen momento para ajustar fertilizacion." },
      { name: "Espigado", min: 380, max: 760, advice: "Controlar estres hidrico; afecta peso de grano." },
      { name: "Maduracion", min: 760, max: 1050, advice: "Preparar cosecha y almacenamiento." },
    ],
  },
  avena: {
    name: "Avena forrajera",
    variety: "Forraje altoandino",
    baseTemp: 4,
    optimalMin: 11,
    optimalMax: 20,
    cycleDays: 120,
    maturityGdd: 980,
    waterSeasonMm: 410,
    yieldTha: 18,
    pricePenT: 420,
    stages: [
      { name: "Emergencia", min: 0, max: 110, advice: "Asegurar densidad para cobertura rapida." },
      { name: "Macollamiento", min: 110, max: 360, advice: "Conservar humedad para biomasa." },
      { name: "Encanado", min: 360, max: 720, advice: "Definir fecha de corte segun objetivo forrajero." },
      { name: "Corte optimo", min: 720, max: 980, advice: "Cortar antes de perder calidad nutricional." },
    ],
  },
  maiz: {
    name: "Maiz amilaceo",
    variety: "Valle interandino",
    baseTemp: 10,
    optimalMin: 18,
    optimalMax: 27,
    cycleDays: 170,
    maturityGdd: 1650,
    waterSeasonMm: 610,
    yieldTha: 3.8,
    pricePenT: 2100,
    stages: [
      { name: "Emergencia", min: 0, max: 190, advice: "Requiere temperatura mayor; revisar zona antes de sembrar." },
      { name: "Vegetativo", min: 190, max: 650, advice: "Alta demanda de nitrogeno y agua." },
      { name: "Floracion", min: 650, max: 1180, advice: "Periodo mas sensible a sequia." },
      { name: "Llenado", min: 1180, max: 1650, advice: "Mantener humedad hasta grano pastoso." },
    ],
  },
  cafe: {
    name: "Cafe",
    variety: "Ceja de selva puneña",
    baseTemp: 12,
    optimalMin: 18,
    optimalMax: 24,
    cycleDays: 240,
    maturityGdd: 2100,
    waterSeasonMm: 780,
    yieldTha: 1.2,
    pricePenT: 9800,
    stages: [
      { name: "Brotacion", min: 0, max: 320, advice: "Mantener sombra y humedad estable." },
      { name: "Floracion", min: 320, max: 760, advice: "Evitar estres hidrico previo a floracion." },
      { name: "Fructificacion", min: 760, max: 1600, advice: "Monitorear broca y nutricion." },
      { name: "Maduracion", min: 1600, max: 2100, advice: "Planificar cosecha selectiva." },
    ],
  },
};

const irrigation: Record<IrrigationKey, { label: string; efficiency: number; energyFactor: number }> = {
  tradicional: { label: "Riego tradicional", efficiency: 0.46, energyFactor: 1 },
  tecnificado: { label: "Riego tecnificado", efficiency: 0.78, energyFactor: 0.72 },
};

const energy: Record<EnergyKey, { label: string; renewableShare: number; costPenKwh: number; co2KgKwh: number }> = {
  red: { label: "Red electrica", renewableShare: 0.2, costPenKwh: 0.72, co2KgKwh: 0.32 },
  mixto: { label: "Sistema mixto", renewableShare: 0.55, costPenKwh: 0.49, co2KgKwh: 0.18 },
  solar: { label: "Bombeo solar", renewableShare: 0.9, costPenKwh: 0.18, co2KgKwh: 0.04 },
};

const regionCropFit: Partial<Record<RegionKey, CropKey[]>> = {
  puno: ["papa", "quinua", "canihua", "haba", "cebada", "avena"],
  juliaca: ["papa", "quinua", "canihua", "cebada", "avena"],
  ilave: ["papa", "quinua", "haba", "cebada", "avena"],
  azangaro: ["quinua", "canihua", "cebada", "avena", "papa"],
  ayaviri: ["canihua", "quinua", "avena", "cebada"],
  sandia: ["cafe", "maiz", "haba"],
  yunguyo: ["papa", "haba", "quinua", "maiz", "cebada"],
};

function daysBetween(startDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const diff = DEMO_DATE.getTime() - start.getTime();
  if (Number.isNaN(diff)) return 1;
  return Math.max(1, Math.round(diff / 86_400_000));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function getStage(crop: Crop, gdd: number) {
  return crop.stages.find((stage) => gdd >= stage.min && gdd < stage.max) ?? crop.stages[crop.stages.length - 1];
}

export default function DemoPage() {
  const [regionKey, setRegionKey] = useState<RegionKey>("puno");
  const [cropKey, setCropKey] = useState<CropKey>("quinua");
  const [sowingDate, setSowingDate] = useState("2026-01-18");
  const [areaHa, setAreaHa] = useState(2.5);
  const [irrigationKey, setIrrigationKey] = useState<IrrigationKey>("tecnificado");
  const [energyKey, setEnergyKey] = useState<EnergyKey>("solar");

  const result = useMemo(() => {
    const region = regions[regionKey];
    const crop = crops[cropKey];
    const irrigationMode = irrigation[irrigationKey];
    const energyMode = energy[energyKey];
    const days = clamp(daysBetween(sowingDate), 1, crop.cycleDays + 35);

    const altitudePenalty = region.altitude > 3600 ? (region.altitude - 3600) / 900 : 0;
    const adjustedTemp = region.tempAvg - altitudePenalty + (region.solar - 5.2) * 0.35;
    const dailyGdd = Math.max(0, adjustedTemp - crop.baseTemp);
    const gdd = clamp(dailyGdd * days, 0, crop.maturityGdd * 1.08);
    const progress = clamp(gdd / crop.maturityGdd, 0, 1);
    const stage = getStage(crop, gdd);

    const heatStress = adjustedTemp > crop.optimalMax ? (adjustedTemp - crop.optimalMax) / 8 : 0;
    const coldStress = adjustedTemp < crop.optimalMin ? (crop.optimalMin - adjustedTemp) / 8 : 0;
    const tempStress = clamp(heatStress + coldStress, 0, 0.55);
    const frostRisk = clamp((4 - region.tempMin) / 7, 0, 1);
    const waterProgress = clamp(days / crop.cycleDays, 0, 1);
    const cropWaterNeedMm = crop.waterSeasonMm * waterProgress;
    const effectiveRainMm = Math.min(cropWaterNeedMm, (region.rainfallMonth / 30) * days * 0.72);
    const soilReserveMm = region.soilMoisture * 1.8;
    const waterDeficitMm = Math.max(0, cropWaterNeedMm - effectiveRainMm - soilReserveMm);
    const conventionalWaterM3 = (waterDeficitMm * areaHa * 10) / irrigation.tradicional.efficiency;
    const optimizedWaterM3 = (waterDeficitMm * areaHa * 10) / irrigationMode.efficiency;
    const waterSavedM3 = Math.max(0, conventionalWaterM3 - optimizedWaterM3);
    const waterSavedPct = conventionalWaterM3 > 0 ? (waterSavedM3 / conventionalWaterM3) * 100 : 0;
    const pumpingEnergyKwh = optimizedWaterM3 * 0.045 * irrigationMode.energyFactor;
    const baselineEnergyKwh = conventionalWaterM3 * 0.045;
    const energySavedPct = baselineEnergyKwh > 0 ? (1 - pumpingEnergyKwh / baselineEnergyKwh) * 100 : 0;
    const energyCost = pumpingEnergyKwh * energyMode.costPenKwh;
    const co2AvoidedKg = Math.max(0, baselineEnergyKwh * energy.red.co2KgKwh - pumpingEnergyKwh * energyMode.co2KgKwh);
    const ndvi = clamp(region.ndviBase + Math.sin(progress * Math.PI) * 0.22 - tempStress * 0.16 - (waterDeficitMm / 550) * 0.16, 0.18, 0.88);
    const suitability = (regionCropFit[regionKey] ?? []).includes(cropKey) ? 1 : 0.72;
    const waterStress = clamp(waterDeficitMm / Math.max(cropWaterNeedMm, 1), 0, 0.5);
    const health = clamp((1 - tempStress * 0.8 - waterStress * 0.9 - frostRisk * 0.18) * suitability, 0.25, 0.98);
    const expectedYield = crop.yieldTha * health * (0.72 + progress * 0.28);
    const revenue = expectedYield * areaHa * crop.pricePenT;
    const riskScore = clamp(tempStress * 38 + waterStress * 45 + frostRisk * 20 + (suitability < 1 ? 14 : 0), 0, 100);

    const risk =
      riskScore >= 62 ? "Alto" :
      riskScore >= 38 ? "Medio" :
      "Controlado";

    const nextAction =
      riskScore >= 62 ? "Activar alerta: revisar riego, cobertura y proteccion ante helada." :
      waterDeficitMm > 35 ? "Programar riego en bloque corto durante la tarde o con bombeo solar." :
      progress > 0.72 ? "Planificar cosecha, almacenamiento y transporte." :
      "Mantener monitoreo cada 48 horas y validar NDVI en campo.";

    return {
      region,
      crop,
      irrigationMode,
      energyMode,
      days,
      adjustedTemp,
      dailyGdd,
      gdd,
      progress,
      stage,
      frostRisk,
      cropWaterNeedMm,
      effectiveRainMm,
      waterDeficitMm,
      optimizedWaterM3,
      waterSavedM3,
      waterSavedPct,
      pumpingEnergyKwh,
      energySavedPct,
      energyCost,
      co2AvoidedKg,
      ndvi,
      health,
      expectedYield,
      revenue,
      risk,
      riskScore,
      nextAction,
      suitability,
    };
  }, [regionKey, cropKey, sowingDate, areaHa, irrigationKey, energyKey]);

  const recommendedCrops = regionCropFit[regionKey] ?? [];

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="font-bold tracking-tight text-slate-950">
            AgroPredict AI
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 sm:inline">
              Demo feria TE2026
            </span>
            <Link href="/" className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">
              Volver
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Agricultura sostenible para Puno
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Simula una parcela real y muestra cuanto agua, energia y riesgo se puede reducir.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Este demo usa datos regionales de referencia para explicar GDD, etapa fenologica, NDVI estimado,
              riego, bombeo solar y retorno productivo. Es una demostracion educativa para feria, no un pronostico oficial.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Ahorro de agua" value={`${formatNumber(result.waterSavedPct)}%`} tone="cyan" />
            <Metric label="Ahorro energia" value={`${formatNumber(result.energySavedPct)}%`} tone="amber" />
            <Metric label="Riesgo actual" value={result.risk} tone={result.risk === "Alto" ? "rose" : result.risk === "Medio" ? "amber" : "emerald"} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Panel de decision</h2>
          <p className="mt-1 text-sm text-slate-600">
            Cambia una variable y explica al visitante que decision tomaria un agricultor.
          </p>

          <div className="mt-5 space-y-5">
            <Field label="Region / microclima">
              <select
                value={regionKey}
                onChange={(event) => setRegionKey(event.target.value as RegionKey)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              >
                {Object.entries(regions).map(([key, region]) => (
                  <option key={key} value={key}>
                    {region.name} - {region.zone}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cultivo">
              <select
                value={cropKey}
                onChange={(event) => setCropKey(event.target.value as CropKey)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              >
                {Object.entries(crops).map(([key, crop]) => (
                  <option key={key} value={key}>
                    {crop.name}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {recommendedCrops.slice(0, 5).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCropKey(key)}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    {crops[key].name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Fecha de siembra">
              <input
                type="date"
                value={sowingDate}
                onChange={(event) => setSowingDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              />
            </Field>

            <Field label={`Area de parcela: ${areaHa.toFixed(1)} ha`}>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={areaHa}
                onChange={(event) => setAreaHa(Number(event.target.value))}
                className="w-full"
              />
            </Field>

            <Field label="Tecnologia de riego">
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(irrigation) as [IrrigationKey, (typeof irrigation)[IrrigationKey]][]).map(([key, mode]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIrrigationKey(key)}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                      irrigationKey === key
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Fuente de energia">
              <div className="grid gap-2">
                {(Object.entries(energy) as [EnergyKey, (typeof energy)[EnergyKey]][]).map(([key, mode]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEnergyKey(key)}
                    className={`rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                      energyKey === key
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode.label} <span className="font-normal">({formatNumber(mode.renewableShare * 100)}% renovable)</span>
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </aside>

        <div className="grid gap-5">
          <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Parcela simulada
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                    {result.crop.name} en {result.region.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {result.region.note}
                  </p>
                </div>
                <div className="rounded-md bg-slate-950 px-4 py-3 text-white">
                  <p className="text-xs text-slate-300">Dia de campana</p>
                  <p className="text-2xl font-bold">{result.days}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <DataTile label="Altitud" value={`${formatNumber(result.region.altitude)} m`} />
                <DataTile label="Temp. media ajustada" value={`${result.adjustedTemp.toFixed(1)} C`} />
                <DataTile label="Radiacion solar" value={`${result.region.solar.toFixed(1)} kWh/m2/dia`} />
                <DataTile label="Humedad suelo" value={`${formatNumber(result.region.soilMoisture)}%`} />
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950">Etapa fenologica: {result.stage.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {result.stage.advice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-slate-500">GDD acumulado</p>
                    <p className="text-2xl font-extrabold text-blue-700">{formatNumber(result.gdd)}</p>
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-400"
                    style={{ width: `${result.progress * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
                  <span>Siembra</span>
                  <span>{formatNumber(result.progress * 100)}% del ciclo termico</span>
                  <span>Cosecha</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-950">Lectura tipo satelite</h3>
              <div className="mt-5 flex items-center justify-center">
                <div className="relative h-52 w-52 rounded-full border-[18px] border-slate-100">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#10b981 ${result.ndvi * 100}%, #e2e8f0 0)`,
                    }}
                  />
                  <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                    <p className="text-xs font-semibold uppercase text-slate-500">NDVI estimado</p>
                    <p className="text-4xl font-extrabold text-emerald-700">{result.ndvi.toFixed(2)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {result.ndvi > 0.62 ? "Vigor alto" : result.ndvi > 0.42 ? "Vigor medio" : "Vigor bajo"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                En campo real se reemplaza esta estimacion por NDVI satelital o dron. En feria sirve para explicar
                como la vegetacion cambia con clima, agua y etapa.
              </p>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <ImpactCard
              title="Agua"
              main={`${formatNumber(result.optimizedWaterM3)} m3`}
              detail={`Necesidad de riego estimada. Ahorro: ${formatNumber(result.waterSavedM3)} m3 frente a riego tradicional.`}
              color="cyan"
            />
            <ImpactCard
              title="Energia"
              main={`${formatNumber(result.pumpingEnergyKwh)} kWh`}
              detail={`Costo estimado: S/ ${formatNumber(result.energyCost, 1)}. Ahorro energetico: ${formatNumber(result.energySavedPct)}%.`}
              color="amber"
            />
            <ImpactCard
              title="Carbono"
              main={`${formatNumber(result.co2AvoidedKg)} kg CO2`}
              detail={`Emisiones evitadas al combinar riego eficiente con ${result.energyMode.label.toLowerCase()}.`}
              color="emerald"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">Resultado productivo</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <DataTile label="Salud del cultivo" value={`${formatNumber(result.health * 100)}%`} />
                <DataTile label="Rendimiento esperado" value={`${result.expectedYield.toFixed(1)} t/ha`} />
                <DataTile label="Ingreso bruto parcela" value={`S/ ${formatNumber(result.revenue)}`} />
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${result.health > 0.72 ? "bg-emerald-500" : result.health > 0.5 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${result.health * 100}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                La salud integra temperatura, riesgo de helada, deficit de agua, aptitud de cultivo y avance del ciclo.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">Recomendacion para explicar en stand</h3>
              <div className={`mt-4 rounded-lg border p-4 ${
                result.risk === "Alto"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : result.risk === "Medio"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }`}>
                <p className="text-sm font-semibold">Riesgo {result.risk} ({formatNumber(result.riskScore)} / 100)</p>
                <p className="mt-2 text-lg font-bold">{result.nextAction}</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                <li>1. Mostrar que el dato climatico se convierte en GDD y etapa del cultivo.</li>
                <li>2. Mostrar que la decision de riego cambia agua, energia y costo.</li>
                <li>3. Cerrar con impacto: menos desperdicio, menos emisiones y mejor rendimiento.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
              <div>
                <p className="text-sm font-semibold uppercase text-emerald-300">Mensaje feria</p>
                <h3 className="mt-2 text-2xl font-extrabold">De dato a decision agricola sostenible.</h3>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                AgroPredict AI ayuda a decidir cuando regar, que cultivo priorizar y como usar energia limpia en
                operaciones agricolas. Eso conecta directamente con la transicion energetica de TE2026.
              </p>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-xs uppercase text-slate-300">Guion de 20 segundos</p>
                <p className="mt-2 text-sm leading-6">
                  "Con IA convertimos clima, suelo y energia en una recomendacion simple: ahorrar agua,
                  bombear con solar y proteger el rendimiento del agricultor puneño."
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "emerald" | "rose" }) {
  const tones = {
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function DataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function ImpactCard({ title, main, detail, color }: { title: string; main: string; detail: string; color: "cyan" | "amber" | "emerald" }) {
  const colors = {
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  return (
    <div className={`rounded-lg border p-5 shadow-sm ${colors[color]}`}>
      <p className="text-sm font-bold uppercase tracking-wide opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-extrabold">{main}</p>
      <p className="mt-3 text-sm leading-6 opacity-90">{detail}</p>
    </div>
  );
}
