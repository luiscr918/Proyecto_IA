import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticación
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email }));
        navigate("/assistant");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            ReactGen AI
          </h1>
          <p className="text-slate-400">Generador de Aplicaciones React con IA</p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-slate-400 hover:text-slate-300">
                <input type="checkbox" className="mr-2" />
                Recuerda mis datos
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                ¿Olvidaste la contraseña?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300 mt-6"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>


          <p className="text-center text-slate-400 mt-6">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold">
              Regístrate aquí
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};
