import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Usuario registrado:", userCredential.user);

    navigate("/assistant");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al registrar usuario";
    alert(errorMessage);
  }

  setIsLoading(false);
};

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={"/"}>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 mb-2">
              ReactGen AI
            </h1>
          </Link>
          <p className="text-slate-400">
            Generador de Aplicaciones React con IA
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Crear Cuenta
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300 mt-6"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
