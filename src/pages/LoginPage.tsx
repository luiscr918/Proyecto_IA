import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Eye, EyeOff, Rocket, Sun, CloudSun, Moon } from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(
    () => localStorage.getItem("email") || "",
  );
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return (
        <span className="flex items-center justify-center gap-2">
          ¡Buenos días! <Sun className="w-5 h-5 text-yellow-400" />
        </span>
      );
    if (hour < 18)
      return (
        <span className="flex items-center justify-center gap-2">
          ¡Buenas tardes! <CloudSun className="w-5 h-5 text-orange-400" />
        </span>
      );
    return (
      <span className="flex items-center justify-center gap-2">
        ¡Buenas noches! <Moon className="w-5 h-5 text-blue-400" />
      </span>
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      localStorage.setItem("email", email);
      console.log("Usuario logueado:", userCredential.user);

      navigate("/assistant");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-credential")) {
          setError("Correo o contraseña incorrectos");
        } else {
          setError("Error al iniciar sesión");
        }
      } else {
        setError("Error inesperado");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 mb-2">
              ReactGen AI
            </h1>
          </Link>
          <p className="text-slate-400">
            Generador de Aplicaciones React con IA
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {getGreeting()}
          </h2>
          <p className="text-center text-slate-400 mb-6">Bienvenido de nuevo</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="tu@ejemplo.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Nunca compartiremos tu correo
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300 mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Entrando..."
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Acceder
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
