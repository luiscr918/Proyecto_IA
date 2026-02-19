import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Generador de Aplicaciones
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 block mt-2">
              React con IA
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Crea interfaces React profesionales con la ayuda de nuestro
            asistente de inteligencia artificial. Describe lo que necesitas,
            sube imágenes y obtén código optimizado al instante.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>

      <section className="bg-slate-800/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            ¿Cómo Funciona?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-700 p-8 rounded-lg border border-slate-600 hover:border-blue-400 transition-colors">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold text-white mb-3">
                Describe tu Idea
              </h4>
              <p className="text-slate-300">
                Explícale al asistente qué componente React necesitas. Sé lo más
                detallado posible para obtener mejores resultados.
              </p>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-slate-600 hover:border-cyan-400 transition-colors">
              <div className="text-4xl mb-4">🖼️</div>
              <h4 className="text-xl font-bold text-white mb-3">
                Sube Imágenes
              </h4>
              <p className="text-slate-300">
                Adjunta imágenes de diseños, wireframes o prototipos. La IA
                analizará el diseño y generará el código correspondiente.
              </p>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-slate-600 hover:border-blue-400 transition-colors">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-bold text-white mb-3">
                Observe la Vista Previa
              </h4>
              <p className="text-slate-300">
                Visualiza el componente React generado en tiempo real. Realiza
                ajustes y refinamientos hasta que sea perfecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Proceso Simple en 4 Pasos
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Iniciar Sesión",
              description: "Accede a tu cuenta para comenzar a crear",
            },
            {
              step: 2,
              title: "Describe tu Componente",
              description:
                "Escribe una descripción detallada de lo que necesitas",
            },
            {
              step: 3,
              title: "Sube Referencia (Opcional)",
              description:
                "Adjunta imágenes si deseas que se base en un diseño específico",
            },
            {
              step: 4,
              title: "Genera y Refina",
              description: "Obtén el código y visualízalo en tiempo real",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "⚡",
                title: "Generación Rápida",
                description:
                  "Obtén código React optimizado en segundos con la IA",
              },
              {
                icon: "👁️",
                title: "Vista Previa en Tiempo Real",
                description: "Visualiza tus componentes mientras se generan",
              },
              {
                icon: "🔄",
                title: "Refinamiento Iterativo",
                description:
                  "Ajusta y refina el código hasta perfeccionar tu componente",
              },
              {
                icon: "📸",
                title: "Análisis de Imágenes",
                description:
                  "La IA convierte diseños visuales en código React funcional",
              },
              {
                icon: "📋",
                title: "Código Limpio",
                description:
                  "Todo el código sigue mejores prácticas y estándares React",
              },
              {
                icon: "🎨",
                title: "Tailwind CSS Integrado",
                description:
                  "Los componentes usan Tailwind CSS para estilos modernos",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-400 transition-colors"
              >
                <div className="text-3xl shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-4xl font-bold text-white mb-6">
          ¿Listo para crear componentes increíbles?
        </h3>
        <p className="text-xl text-slate-300 mb-8">
          Únete a nuestro asistente de IA y comienza a generar aplicaciones
          React profesionales.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Iniciar Sesión Ahora
        </Button>
      </section>

      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2026 ReactGen AI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
