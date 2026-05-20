"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Si no está montado, mostrar loading básico
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-slate-700">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-[#0F2A43] font-sans overflow-hidden relative">
      
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-sky-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* === ENCABEZADO MEJORADO === */}
      <header className={`flex items-center justify-between px-6 md:px-16 py-4 backdrop-blur-md border-b transition-all duration-500 sticky top-0 z-50 ${
        isScrolled 
          ? "bg-white/90 border-blue-100/50 shadow-lg" 
          : "bg-transparent border-transparent"
      }`}>
        {/* Logo con mejor diseño */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src="/img/logo-agropredict.png"
              alt="AgroPredict Logo"
              width={45}
              height={45}
              className="relative rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            AgroPredict
          </span>
        </div>

        {/* Navegación moderna */}
       

        {/* Botón CTA en header */}
       <a
  href="/demo"
  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
>
  🎯 Demo Interactivo
</a>

      </header>

      {/* === SECCIÓN HERO MEJORADA === */}
  <section className="flex flex-col md:grid md:grid-cols-2 items-center max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-8 gap-4 md:gap-8 w-full relative z-10">

        {/* Columna izquierda: Contenido principal */}
        <div className="flex flex-col items-start justify-center space-y-8 relative">
       
          {/* Títiulo principal con gradiente - Enfocado en feria */}
          <div className="animate-slide-up">
           <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-snug md:leading-tight tracking-tight">

              <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Sostenibilidad<br />
              </span>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Agrícola<br />
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Mediante IA
              </span>
            </h1>
          </div>

          {/* Descripción enfocada en la feria */}
         <div className="bg-gradient-to-r from-blue-50 to-emerald-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-emerald-200 max-w-md animate-fade-in-delayed">

            <p className="text-lg text-slate-700 leading-relaxed">
              <strong className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AgroPredict AI
              </strong> utiliza inteligencia artificial y datos satelitales para optimizar la producción agrícola reduciendo consumo de energía, agua y químicos. 
              <span className="block mt-2 text-sm font-semibold text-emerald-700">⚡ Parte de la transición energética en Puno</span>
            </p>
          </div>

          {/* Estadísticas en tiempo real */}
          <div className="flex flex-wrap gap-6 mt-4 animate-fade-in text-sm">

            {[
             { value: "30%", label: "Menos Agua", emoji: "💧" },
{ value: "40%", label: "Menos Energía", emoji: "⚡" },
{ value: "99%", label: "Precisión", emoji: "🎯" }

            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white/60 p-3 rounded-lg backdrop-blur">
                <div className="text-3xl mb-1">{stat.emoji}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: Visualización mejorada */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          
          {/* Satélite animado */}
        <div className="absolute top-2 right-6 md:top-6 md:right-14 z-20 animate-float">

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <Image
                src="/img/satelite.png"
                alt="Satélite orbitando"
                width={120}
                height={120}
                className="relative drop-shadow-2xl animate-spin-slow"
              />
            </div>
          </div>

          {/* Planeta Tierra con efecto de rotación */}
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full blur-2xl"></div>
            <Image
              src="/img/earth.png"
              alt="Planeta Tierra"
              width={500}
              height={500}
              className="relative drop-shadow-2xl animate-spin-slower"
            />
            
            {/* Anillos orbitales decorativos */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute border border-blue-200/30 rounded-full animate-spin-slow"
                  style={{
                    width: 400 + ring * 60,
                    height: 400 + ring * 60,
                    animationDuration: `${30 + ring * 10}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Puntos de datos flotantes */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg animate-bounce"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* === SECCIÓN DE CARACTERÍSTICAS === */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-transparent to-blue-50/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            🌟 Características Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🛰️",
                title: "Datos Satelitales",
                desc: "Imágenes de satélite en tiempo real para monitoreo preciso de cultivos"
              },
              {
                icon: "🤖",
                title: "IA Avanzada",
                desc: "Machine Learning para predicciones de rendimiento con 99% precisión"
              },
              {
                icon: "💧",
                title: "Optimización Hídrica",
                desc: "Reduce consumo de agua hasta 30% mediante riego inteligente"
              },
              {
                icon: "⚡",
                title: "Eficiencia Energética",
                desc: "Compatible con paneles solares y sistemas de energía renovable"
              },
              {
                icon: "📊",
                title: "Dashboard Interactivo",
                desc: "Visualización de datos agrícolas en tiempo real y predicciones futuras"
              },
              {
                icon: "🌾",
                title: "Sostenibilidad",
                desc: "Reduce químicos y emisiones de carbono en la producción agrícola"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-emerald-100">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECCIÓN TRANSICIÓN ENERGÉTICA === */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-emerald-50 to-blue-50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              ♻️ Parte de la Transición Energética
            </h2>
            <p className="text-lg text-slate-600">Tecnología sostenible alineada con los objetivos del Titikaka Energético 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Izquierda: Impacto Ambiental */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
                🌍 Impacto Ambiental
              </h3>
              <ul className="space-y-4">
                {[
                  "30% menos uso de agua potable",
                  "40% menor consumo energético",
                  "25% reducción en químicos",
                  "CO₂ reducido en transporte agrícola",
                  "Suelos más saludables y productivos"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <span className="text-2xl">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Derecha: Beneficios Económicos */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                💰 Beneficios Económicos
              </h3>
              <ul className="space-y-4">
                {[
                  "15-30% aumento en rendimiento de cultivos",
                  "40% reducción en costos operacionales",
                  "Decisiones basadas en datos reales",
                  "Acceso a mercados de productos sostenibles",
                  "ROI en 2 años promedio"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <span className="text-2xl">💵</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Feria */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl px-8 py-4 md:px-10 md:py-6">
                <p className="text-lg font-semibold text-slate-800 mb-2">
                  🎪 Visítanos en la Feria <span className="text-emerald-700">Titikaka Energético 2026</span>
                </p>
                <p className="text-slate-600">21 de mayo de 2026 | Universidad Nacional del Altiplano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN CTA PRINCIPAL === */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 relative overflow-hidden z-10">
        
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-10 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            🚀 ¡Prueba la Plataforma Ahora!
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Accede a nuestro demo interactivo y descubre cómo AgroPredict AI puede optimizar tu producción agrícola de forma sostenible.
          </p>
          <a
            href="/demo"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Ir al Demo Interactivo →
          </a>
        </div>
      </section>

      {/* === PIE DE PÁGINA MEJORADO === */}
<footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white text-center py-10 mt-auto relative overflow-hidden">
  <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-10"></div>

  <div className="max-w-5xl mx-auto px-6 relative z-10">
    {/* ICONO NASA */}
    <div className="flex justify-center items-center gap-4 mb-6">
      <img
        src="/img/nasa.png"
        alt="NASA Space Apps Challenge"
        className="w-16 h-16 rounded-lg shadow-lg border border-blue-300 bg-white/10"
      />
      <h3 className="text-2xl md:text-3xl font-bold text-blue-100 tracking-wide">
        PARTICIPANTES — NASA International Space Apps Challenge 🚀
      </h3>
    </div>

    {/* LISTA DE INTEGRANTES */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-lg text-blue-100/90 mb-8 font-medium">
      <p><span className="text-emerald-400 font-semibold">🌟 Integrante #0:</span> Yanela Roxana Cojal Rodríguez</p>
      <p><span className="text-emerald-400 font-semibold">👨‍💻 Integrante #1:</span> Jhon Marco Aracayo Mamani</p>
      <p><span className="text-emerald-400 font-semibold">👩‍💻 Integrante #2:</span> Angie Tatiana Luque Pacheco</p>
      <p><span className="text-emerald-400 font-semibold">🛰️ Integrante #3:</span> Ector Adrian Rivadeneyra Cardenas</p>
      <p><span className="text-emerald-400 font-semibold">🔬 Integrante #4:</span> Elver Joel Sandoval Salinas</p>
      <p><span className="text-emerald-400 font-semibold">🧠 Integrante #5:</span> Lindsay Eliana Heredia Acosta</p>
    </div>

    {/* DESCRIPCIÓN */}
    <p className="text-blue-100/80 text-md leading-relaxed max-w-3xl mx-auto mb-6">
      <strong className="text-emerald-400">AgroPredict AI</strong> — desarrollado para el 
      <span className="text-blue-300"> NASA Space Apps Challenge 2025</span>, 
      combines artificial intelligence, satellite data, and IoT technology 🌾 to boost agricultural productivity 
      and environmental sustainability in Peru 🇵🇪.
    </p>

    {/* ICONOS */}
    <div className="flex justify-center gap-6 mb-6">
      {['🚀', '📡', '🌍', '🤖'].map((icon) => (
        <div
          key={icon}
          className="text-3xl hover:scale-125 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        >
          {icon}
        </div>
      ))}
    </div>

    {/* COPYRIGHT */}
    <p className="text-sm text-blue-200/60 tracking-wide">
      © 2025 <strong className="text-white">AgroPredict AI</strong> — 
      Cultivating innovation, harvesting the future 🌟
    </p>
  </div>
</footer>


      {/* Estilos de animación personalizados */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 40s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s both;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.5s both;
        }
        .animate-scale-in {
          animation: scale-in 1s ease-out;
        }
      `}</style>
    </main>
  );
}
