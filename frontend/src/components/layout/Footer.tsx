const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TestHub. Build. Practice. Grow.
      </div>
    </footer>
  );
};

export default Footer;