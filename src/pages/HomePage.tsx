import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { motion } from "framer-motion";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_40%)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

      <Navbar />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
              Genera Aplicaciones
              <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                React con IA
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-xl">
              Describe tu componente, sube imágenes y obtén código React listo
              para producción en segundos.
            </p>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 text-white font-bold px-8 py-3 rounded-2xl shadow-2xl"
              >
                🚀 Comenzar Ahora
              </Button>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 blur-3xl opacity-20 rounded-3xl"></div>
            <img
              src="https://msmk.university/wp-content/uploads/2024/11/imagen-de-inteligencia-artificial.webp"
              alt="Preview"
              className="relative rounded-3xl shadow-2xl border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16">
            Características Principales
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Generación Instantánea",
                desc: "Código React optimizado en segundos con IA avanzada.",
              },
              {
                icon: "👁️",
                title: "Vista en Tiempo Real",
                desc: "Visualiza tu componente mientras se genera.",
              },
              {
                icon: "🔄",
                title: "Refinamiento Iterativo",
                desc: "Ajusta y perfecciona hasta que quede perfecto.",
              },
              {
                icon: "📸",
                title: "Clasificador de Imágenes",
                desc: "Sube imágenes de flores y obtén análisis automático.",
              },
              {
                icon: "🎨",
                title: "Tailwind Integrado",
                desc: "Diseños modernos y responsivos listos para usar.",
              },
              {
                icon: "📦",
                title: "Código Limpio",
                desc: "Buenas prácticas y estructura profesional.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 bg-white/5 backdrop-blur-md border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16">
            Proceso en 3 Pasos
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Describe tu Idea",
                desc: "Explica qué componente necesitas.",
              },
              {
                step: "02",
                title: "La IA lo Genera",
                desc: "Obtén código optimizado automáticamente.",
              },
              {
                step: "03",
                title: "Refina y Exporta",
                desc: "Ajusta y úsalo en tu proyecto.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            ¿Listo para crear algo increíble?
          </h2>

          <p className="text-slate-300 mb-10 text-lg">
            Empieza ahora y genera componentes React profesionales en minutos.
          </p>

          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-transform duration-300 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl text-lg"
          >
            Iniciar Sesión Ahora
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        © 2026 ReactGen AI. Todos los derechos reservados.
      </footer>
    </div>
  );
};