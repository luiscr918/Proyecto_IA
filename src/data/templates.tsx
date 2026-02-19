export const componentTemplates = {
  footer: {
    code: `export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center">
      © 2026 Mi Sitio Web
    </footer>
  );
};`,
    preview: (
      <footer className="bg-gray-900 text-white p-6 text-center w-full">
        © 2026 Mi Sitio Web
      </footer>
    ),
  },

  navbar: {
    code: `export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <span>Mi App</span>
      <div className="space-x-4">
        <a href="#">Inicio</a>
        <a href="#">Contacto</a>
      </div>
    </nav>
  );
};`,
    preview: (
      <nav className="bg-blue-600 text-white p-4 flex justify-between w-full">
        <span>Mi App</span>
        <div className="space-x-4">
          <a href="#">Inicio</a>
          <a href="#">Contacto</a>
        </div>
      </nav>
    ),
  },
  button: {
    code: `export const Button = () => {
  return (
    <button type="button" className="text-white bg-linear-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Cyan</button>
  );
};`,
    preview: (
      <button
        type="button"
        className="text-white bg-linear-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
      >
        Cyan
      </button>
    ),
  },
};
