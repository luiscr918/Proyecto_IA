import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login", {
        state: { message: "Sesión cerrada correctamente 👋" },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  // 🔥 Función para sacar nombre bonito del email
  const getNameFromEmail = (email: string | null) => {
    if (!email) return "";

    const name = email.split("@")[0];

    const clean = name.split(/[._0-9]/)[0];

    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 hover:opacity-80 transition"
        >
          ReactGen AI
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Inicio
          </Link>

          {user && (
            <>
              <Link to="/assistant" className="hover:text-white">
                Asistente
              </Link>

              <Link to="/clasificador" className="hover:text-white">
                Clasificador
              </Link>
            </>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="flex items-center gap-4">

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-600 px-5 py-2 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                Cerrar Sesión 
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};