import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
        {/* agregar mas rutas aqui */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
