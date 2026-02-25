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
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400"
      >
        ReactGen AI
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 text-slate-300">
        <Link to="/" className="hover:text-white transition-colors">
          Inicio
        </Link>

        {user && (
          <>
            <Link
              to="/assistant"
              className="hover:text-white transition-colors"
            >
              Asistente
            </Link>
            <Link
              to="/clasificador"
              className="hover:text-white transition-colors"
            >
              Clasificador de Imágenes
            </Link>
          </>
        )}

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            Iniciar Sesión
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};
