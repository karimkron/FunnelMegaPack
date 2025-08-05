import { useEffect, useState, useRef } from "react";
import {
  Play,
  CheckCircle,
  Shield,
  Zap,
  Crown,
  Award,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Clock,
  Smartphone,
} from "lucide-react";

// Interfaces para TypeScript
interface VideoSelection {
  src: string;
  index: number;
}

interface Testimonial {
  image: string;
}

// Declaración para elementos personalizados de Stripe
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": {
        "buy-button-id": string;
        "publishable-key": string;
        children?: React.ReactNode;
      };
    }
  }
}

function App() {
  const [selectedVideo, setSelectedVideo] = useState<VideoSelection | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState<boolean>(false);
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 23, minutes: 59, seconds: 59 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stripeScriptRef = useRef<HTMLScriptElement | null>(null);

  // Cargar Stripe de forma estable y controlada
  useEffect(() => {
    let mounted = true;

    const loadStripe = async () => {
      try {
        // Verificar si ya existe el script
        const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');
        
        if (existingScript) {
          // Si ya existe, verificar si está cargado
          if ((window as any).stripe) {
            if (mounted) setStripeLoaded(true);
            return;
          }
        }

        // Crear nuevo script solo si no existe
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = "https://js.stripe.com/v3/buy-button.js";
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            if (mounted) {
              setStripeLoaded(true);
              setStripeError(false);
            }
          };

          script.onerror = () => {
            if (mounted) {
              setStripeError(true);
              setStripeLoaded(false);
            }
          };

          // Timeout de seguridad
          setTimeout(() => {
            if (mounted && !stripeLoaded) {
              setStripeError(true);
            }
          }, 10000); // 10 segundos

          stripeScriptRef.current = script;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error loading Stripe:', error);
        if (mounted) {
          setStripeError(true);
          setStripeLoaded(false);
        }
      }
    };

    loadStripe();

    return () => {
      mounted = false;
      // No eliminar el script para evitar recargas innecesarias
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset when reaches 0
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Floating CTA visibility based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        setShowFloatingCTA(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lista de videos con thumbnails - Optimizada para carga rápida
  const videos: string[] = [
    "video1.mp4",
    "video2.mp4",
    "video3.mp4",
    "video4.mp4",
    "video5.mov",
    "video6.mov",
    "video7.mp4",
    "video8.mp4",
  ];

  const handleVideoClick = (videoSrc: string, index: number): void => {
    setIsLoading(true);
    setSelectedVideo({ src: videoSrc, index });
  };

  const closeVideo = (): void => {
    setSelectedVideo(null);
    setIsFullscreen(false);
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const navigateVideo = (direction: "prev" | "next"): void => {
    if (!selectedVideo) return;

    let newIndex: number;
    if (direction === "next") {
      newIndex = selectedVideo.index + 1 >= videos.length ? 0 : selectedVideo.index + 1;
    } else {
      newIndex = selectedVideo.index - 1 < 0 ? videos.length - 1 : selectedVideo.index - 1;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsLoading(true);
    setTimeout(() => {
      setSelectedVideo({
        src: `/video/${videos[newIndex]}`,
        index: newIndex,
      });
    }, 100);
  };

  const toggleFullscreen = async (): Promise<void> => {
    if (!fullscreenRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log("Error attempting to enable fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.log("Error attempting to exit fullscreen:", err);
      }
    }
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Manejar el cambio de fullscreen con ESC
  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Cerrar con ESC y navegación con flechas
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        closeVideo();
      } else if (selectedVideo && !isLoading) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          navigateVideo("next");
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          navigateVideo("prev");
        }
      }
    };

    if (selectedVideo) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [selectedVideo, isLoading]);

  const testimonials: Testimonial[] = [
    { image: "/image/testimonio1.jpeg" },
    { image: "/image/testimonio2.jpeg" },
    { image: "/image/testimonio3.jpeg" },
  ];

  // Componente mejorado del botón de Stripe con manejo de errores
  const StripeButton = ({ className = "", size = "normal" }: { className?: string; size?: "normal" | "large" | "small" }) => {
    const retryStripe = () => {
      setStripeError(false);
      setStripeLoaded(false);
      
      // Eliminar script existente si hay error
      const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Recargar script
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setStripeLoaded(true);
        setStripeError(false);
      };

      script.onerror = () => {
        setStripeError(true);
        setStripeLoaded(false);
      };

      document.head.appendChild(script);
    };

    // Si hay error de Stripe, mostrar botón de reintento
    if (stripeError) {
      return (
        <div className={`stripe-error-container ${className}`}>
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
            <p className="text-red-400 mb-3 text-sm">
              ⚠️ Error al cargar el botón de pago
            </p>
            <button
              onClick={retryStripe}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Reintentar
            </button>
            <p className="text-gray-400 text-xs mt-2">
              O contacta: megapack3k@gmail.com
            </p>
          </div>
        </div>
      );
    }

    // Si está cargando, mostrar spinner
    if (!stripeLoaded) {
      return (
        <div className={`stripe-loading-container ${className}`}>
          <div className="bg-gray-900/50 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-yellow-400 text-sm">Cargando botón de pago...</p>
          </div>
        </div>
      );
    }

    // Botón de Stripe cargado correctamente
    return (
      <div className={`stripe-button-container ${className}`}>
        <stripe-buy-button
          buy-button-id="buy_btn_1Rr68CLaDNozqJeSJQvmCkuQ"
          publishable-key="pk_live_51RRNGqLaDNozqJeSsBCif37utfiEfn2lcvPrCCuJ4RpJMNKT3ohVa0Kvy2vnaFbEOO231uSs424Bh1eyEkM9lZ8500P7IXhWnI"
        >
        </stripe-buy-button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section - Optimizado para móviles */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Imagen de fondo estática optimizada para móviles */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Countdown Timer */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-red-600 rounded-full text-white font-bold text-sm mb-4 animate-pulse">
              <Clock className="w-4 h-4 mr-2" />
              OFERTA EXPIRA EN: {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Título optimizado para móviles */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              30.000 Videos
            </span>
            <br />
            <span className="text-white font-serif text-2xl sm:text-4xl lg:text-5xl">
              de Lujo Premium
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transforma tu perfil en una marca de lujo
            <span className="text-yellow-400 font-semibold block">
              ¡Contenido viral garantizado!
            </span>
          </p>

          {/* Precio destacado */}
          <div className="mb-8">
            <div className="text-gray-400 line-through text-lg mb-1">97,00 €</div>
            <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              18,95 €
            </div>
            <div className="text-red-400 font-bold text-lg animate-pulse">
              81% DESCUENTO
            </div>
          </div>

          {/* CTA Principal */}
          <div className="space-y-4 mb-8">
            <StripeButton size="large" className="transform hover:scale-105 transition-all duration-300" />
            <p className="text-sm text-gray-400">
              ⚡ Entrega instantánea • 🔒 Pago seguro • 💎 Garantía 100%
            </p>
          </div>

          {/* Beneficios rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-yellow-400 font-bold">+30K Videos</div>
              <div className="text-sm text-gray-300">Calidad 4K</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-yellow-400 font-bold">Acceso Vitalicio</div>
              <div className="text-sm text-gray-300">Sin límites</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-yellow-400 font-bold">Uso Comercial</div>
              <div className="text-sm text-gray-300">Sin restricciones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección ¿Qué incluye? - Simplificada */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              ¿Qué incluye
            </span>
            <span className="text-white"> el pack?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">+30,000 Videos HD</h3>
              <p className="text-gray-300">Coches de lujo, yates, mansiones, viajes premium</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">♾️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Acceso de por vida</h3>
              <p className="text-gray-300">Google Drive con +4TB de contenido</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Todas las redes</h3>
              <p className="text-gray-300">TikTok, Instagram, YouTube Shorts</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Uso comercial</h3>
              <p className="text-gray-300">Monetiza sin restricciones</p>
            </div>
          </div>

          <StripeButton className="mb-4" />
        </div>
      </section>

      {/* Galería de videos - Con thumbnails optimizados */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Vista previa
              </span>
              <span className="text-white"> del contenido</span>
            </h2>
            <p className="text-gray-300">Solo una pequeña muestra de 30,000 videos</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {videos.slice(0, 8).map((video, index) => (
              <div
                key={index}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleVideoClick(`/video/${video}`, index)}
              >
                {/* Thumbnail estático - se carga con lazy loading */}
                <img
                  src={`/thumbnails/thumb${index + 1}.png`}
                  alt={`Video ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.classList.add('loaded')}
                  onError={(e) => {
                    // Fallback si no existe el thumbnail
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const video = target.nextElementSibling as HTMLVideoElement;
                    if (video) video.style.display = 'block';
                  }}
                />

                {/* Video de respaldo (oculto por defecto) */}
                <video
                  className="w-full h-full object-cover hidden"
                  muted
                  playsInline
                  preload="none"
                >
                  <source src={`/video/${video}`} type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 text-black fill-current ml-0.5" />
                  </div>
                </div>

                {/* Número del video */}
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8">
            <p className="text-gray-300 mb-6 text-lg">
              <span className="text-yellow-400 font-bold text-xl block mb-2">
                ¡Esto es solo el 0.03% del contenido total!
              </span>
              Desbloquea los 30,000 videos completos
            </p>
            <StripeButton />
          </div>
        </div>

        {/* Modal de video */}
        {selectedVideo && (
          <div
            ref={fullscreenRef}
            className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${
              isFullscreen ? "p-0" : "p-4"
            }`}
          >
            <div className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg font-semibold">Cargando...</p>
                  </div>
                </div>
              )}

              <video
                key={selectedVideo.src}
                ref={videoRef}
                className="w-auto h-full max-w-full max-h-full object-contain"
                controls={false}
                autoPlay
                muted={isMuted}
                playsInline
                preload="auto"
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onLoadedData={() => {
                  setIsLoading(false);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                  }
                }}
              >
                <source src={selectedVideo.src} type="video/mp4" />
              </video>

              {/* Controles del modal */}
              <button
                onClick={() => navigateVideo("prev")}
                disabled={isLoading}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-all duration-200 z-20 disabled:opacity-50"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => navigateVideo("next")}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-all duration-200 z-20 disabled:opacity-50"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <div className="absolute inset-0 group">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold">Video #{selectedVideo.index + 1}</h3>
                    <button
                      onClick={closeVideo}
                      className="w-10 h-10 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonios - Solo imágenes */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-white">Resultados</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {" "}reales
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group transform hover:scale-105 transition-all duration-300">
                <div className="relative rounded-xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-colors duration-300">
                  <img
                    src={testimonial.image}
                    alt={`Testimonio ${index + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <StripeButton />
          </div>
        </div>
      </section>

      {/* Sección de precio final */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm p-8 rounded-3xl border-2 border-yellow-500/30">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-red-600 rounded-full text-white font-bold text-sm mb-4 animate-pulse">
                <Zap className="w-4 h-4 mr-2" />
                ÚLTIMA OPORTUNIDAD
              </div>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Precio especial:</span>
            </h3>

            <div className="mb-8">
              <div className="text-2xl text-gray-400 line-through mb-2">97,00 €</div>
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                18,95€
              </div>
              <div className="text-red-400 font-bold text-lg">¡Ahorra 78,05€!</div>
            </div>

            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>30,000 videos premium HD/4K</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Acceso vitalicio sin límites</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Uso comercial incluido</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Entrega inmediata</span>
              </div>
            </div>

            <StripeButton size="large" />

            <p className="text-sm text-gray-400 mt-4">
              💳 Pago seguro • 🔒 Garantía 100% • ⚡ Acceso inmediato
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Simplificado */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Preguntas frecuentes
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Cómo recibo el acceso?",
                answer: "Tras el pago serás redirigido a una página con el enlace directo a Google Drive. Si tienes problemas: megapack3k@gmail.com"
              },
              {
                question: "¿Son realmente 30,000 videos?",
                answer: "Sí, más de 30,000 videos en formato vertical HD/4K organizados por categorías en +4TB de contenido."
              },
              {
                question: "¿Puedo monetizarlos?",
                answer: "Absolutamente. Incluye derechos de uso comercial sin restricciones."
              },
              {
                question: "¿Esta oferta es real?",
                answer: "Sí, precio promocional de 18,95€ por tiempo limitado. Precio normal: 97€."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl border border-yellow-500/20">
                <details className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-yellow-500/5 transition-colors duration-300">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform duration-300">
                      <span className="text-black font-bold text-sm">+</span>
                    </div>
                  </summary>
                  <div className="px-4 pb-4">
                    <div className="pt-2 border-t border-yellow-500/20">
                      <p className="text-gray-300 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* Contacto de soporte */}
          <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30 text-center">
            <h3 className="text-xl font-bold text-white mb-3">¿Problemas de acceso?</h3>
            <div className="bg-black/30 p-4 rounded-xl">
              <p className="text-yellow-300 font-mono text-lg mb-2">megapack3k@gmail.com</p>
              <p className="text-gray-300 text-sm">Envía tu comprobante de pago - Respuesta en 2h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            Mega Pack Videos de Lujo
          </div>
          <p className="text-gray-400 text-sm mb-4">Tu éxito en redes sociales empieza aquí</p>
          <p className="text-gray-500 text-xs">© 2024 Mega Pack Videos de Lujo. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* CTA Flotante para móviles */}
      {showFloatingCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-black via-gray-900 to-black border-t border-yellow-500/30 p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-yellow-400 font-bold text-lg">18,95€</div>
              <div className="text-gray-400 line-through text-sm">97,00€</div>
            </div>
            <div className="flex-shrink-0">
              <StripeButton size="small" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;