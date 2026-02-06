import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força a rolagem para o topo sempre que a rota (pathname) mudar
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}