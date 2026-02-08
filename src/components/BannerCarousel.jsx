import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para controle de toque (Swipe no Mobile)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; 

  // URL da API
  const API_URL = 'http://localhost/sif-api/banners.php'; 

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        const activeBanners = response.data.filter(b => b.active == 1 || b.active === true);
        setBanners(activeBanners);
      }
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rotação Automática
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // --- LÓGICA DE TOQUE (SWIPE) ---
  const onTouchStart = (e) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  if (loading || banners.length === 0) return null;

  return (
    // AJUSTE DE ESPAÇAMENTO:
    // mt-16: Adiciona espaço em cima (descola da sessão anterior)
    // mb-8: Reduz o espaço em baixo (aproxima do Quem Somos)
    // py-10: Padding interno equilibrado
    <section className="w-full mt-16 mb-8 py-10 bg-[#f8f9fa] relative z-20"> 
      
      {/* TÍTULO PADRÃO PARTNERS */}
      <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-gray-400">
              Destaques
          </h3>
      </div>

      {/* LARGURA E CONTAINER */}
      <div className="container mx-auto px-4 md:px-6">
        
        {/* CARROSSEL */}
        <div 
            className="relative w-full h-[220px] sm:h-[350px] md:h-[550px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group border border-gray-100 bg-white"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            
            <div 
                className="w-full h-full flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full h-full relative bg-gray-100 select-none">
                        {banner.link_url ? (
                            <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                                <img 
                                    src={banner.image_url} 
                                    alt="Banner" 
                                    className="w-full h-full object-cover pointer-events-none" 
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </a>
                        ) : (
                            <div className="w-full h-full">
                                <img 
                                    src={banner.image_url} 
                                    alt="Banner" 
                                    className="w-full h-full object-cover pointer-events-none"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                        
                        {/* Gradiente sutil em baixo */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                    </div>
                ))}
            </div>

            {/* Setas de Navegação (Desktop) */}
            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#3c7a43] text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-lg z-20"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#3c7a43] text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-lg z-20"
                    >
                        <ChevronRight size={28} />
                    </button>
                    
                    {/* Dots Indicadores */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm backdrop-blur-sm ${
                                    currentIndex === idx ? 'bg-white w-8' : 'bg-white/50 w-1.5 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>
    </section>
  );
}