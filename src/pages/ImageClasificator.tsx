import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { flowerTranslations } from "../translation/flowerTranslations";

const API_URL = import.meta.env.VITE_FLOWER_API;

export const ImageClasificator = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file: File) => {
    // 🔥 Validar PNG
    if (file.type !== "image/png") {
      setError("El modelo solo acepta imágenes PNG");
      setImage(null);
      setPreview(null);
      return;
    }

    setError(null);
    setPrediction(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    setPrediction(null);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      // 🔥 Si status HTTP no es OK
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      // 🔥 Backend devuelve error JSON
      if (data.error) {
        setError(data.error);
      } else if (data.prediction) {
        const translated =
          flowerTranslations[data.prediction.toLowerCase()] || data.prediction;

        setPrediction(translated);
      } else {
        setError("Respuesta inesperada del servidor");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error(err);

      if (errorMessage.includes("Failed to fetch")) {
        setError("No se pudo conectar al servidor (CORS o servidor caído)");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* TITULO */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Clasificador Inteligente
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
                Oxford Flowers 102 🌸
              </span>
            </h2>
            <p className="text-slate-400 text-sm">
              Sube una imagen PNG y el modelo identificará la flor.
            </p>
          </div>

          {/* INPUT */}
          <div className="flex flex-col items-center gap-6">
            <label className="w-full cursor-pointer">
              <div className="border-2 border-dashed border-slate-600 hover:border-blue-400 transition-colors rounded-xl p-8 text-center bg-slate-700/40">
                <p className="text-slate-300">
                  Haz clic para subir una imagen PNG
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Formato soportado: PNG
                </p>
              </div>

              <input
                type="file"
                accept="image/png"
                onChange={(e) =>
                  e.target.files && handleImageChange(e.target.files[0])
                }
                className="hidden"
              />
            </label>

            {/* PREVIEW */}
            {preview && (
              <div className="bg-slate-700/40 p-4 rounded-xl border border-slate-600 shadow-inner">
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-lg max-h-72 mx-auto object-contain"
                />
              </div>
            )}

            {/* BOTÓN */}
            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? "Clasificando..." : "Clasificar Imagen"}
            </button>

            {/* LOADING */}
            {loading && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                <span>El modelo está analizando la imagen...</span>
              </div>
            )}

            {/* ERROR */}
            {error && !loading && (
              <div className="w-full bg-red-500/10 border border-red-400 text-red-300 p-4 rounded-xl text-center font-medium">
                ❌ {error}
              </div>
            )}

            {/* RESULTADO */}
            {prediction && !loading && !error && (
              <div className="w-full bg-green-500/10 border border-green-400 text-green-300 p-4 rounded-xl text-center font-semibold">
                🌼 Predicción: {prediction}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
