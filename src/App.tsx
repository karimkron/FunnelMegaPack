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
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

// Interfaces para TypeScript
interface VideoSelection {
  src: string;
  index: number;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
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
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hora en segundos
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Timer de cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Load Stripe script
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Videos optimizados con poster frames
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

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
    {
      name: "Carlos M.",
      text: "Mi engagement se disparó 400% desde el primer día. El mejor pack que he comprado.",
      rating: 5,
      image: "/image/testimonio1.jpeg",
    },
    {
      name: "María L.", 
      text: "6 cifras en mi negocio gracias a este contenido. La calidad es increíble.",
      rating: 5,
      image: "/image/testimonio2.jpeg",
    },
    {
      name: "Roberto S.",
      text: "De 500 a 50K seguidores en 3 meses. Este pack cambió mi vida.",
      rating: 5,
      image: "/image/testimonio3.jpeg",
    },
  ];

  // Componente del botón de Stripe (modo live)
  const StripeButton = ({ className = "" }: { className?: string }) => (
    <div className={`stripe-button-container ${className}`}>
      <stripe-buy-button
        buy-button-id="buy_btn_1Rr68CLaDNozqJeSJQvmCkuQ"
        publishable-key="pk_live_51RRNGqLaDNozqJeSsBCif37utfiEfn2lcvPrCCuJ4RpJMNKT3ohVa0Kvy2vnaFbEOO231uSs424Bh1eyEkM9lZ8500P7IXhWnI"
      >
      </stripe-buy-button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section - OPTIMIZADO PARA CONVERSIÓN */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/fondo-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/video/fondo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Timer de urgencia */}
          <div className="inline-flex items-center px-6 py-3 bg-red-600 rounded-full text-white font-bold text-sm mb-6 animate-pulse">
            <Clock className="w-4 h-4 mr-2" />
            OFERTA TERMINA EN: {formatTime(timeLeft)}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              30.000 Videos
            </span>
            <br />
            <span className="text-white font-serif">de Lujo Premium</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 font-light">
              que generan millones de visualizaciones
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Contenido viral que usan los influencers más exitosos para ganar 
            <span className="text-yellow-400 font-semibold"> 6 cifras al mes</span>
          </p>

          {/* Prueba social inmediata */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8 text-center">
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">2,847</div>
              <div className="text-xs text-gray-400">Vendidos hoy</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-400">4.9★</div>
              <div className="text-xs text-gray-400">Calificación</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">15min</div>
              <div className="text-xs text-gray-400">Entrega</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-gray-400 line-through text-xl">Antes: 297,00 €</div>
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  18,95 €
                </div>
                <div className="text-red-400 font-semibold text-sm animate-pulse">
                  ¡94% DE DESCUENTO HOY!
                </div>
              </div>
            </div>

            <StripeButton className="transform hover:scale-105 transition-all duration-300" />

            <p className="text-sm text-gray-400 max-w-md mx-auto">
              ⚡ Acceso instantáneo • 🔒 Pago 100% seguro • 💎 Garantía 30 días
            </p>
          </div>
        </div>
      </section>

      {/* Proof Section - MÁS ARRIBA EN EL FUNNEL */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-yellow-400">Miles de personas</span>
              <span className="text-white"> ya están ganando con esto</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-colors duration-300">
                  <img
                    src={testimonial.image}
                    alt={`Resultado cliente ${index + 1}`}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white font-semibold mb-1">{testimonial.name}</p>
                    <p className="text-gray-200 text-sm">{testimonial.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats mejoradas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl">
              <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50,000+</div>
              <div className="text-gray-300 text-sm">Creadores lo usan</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">300%</div>
              <div className="text-gray-300 text-sm">Aumento engagement</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl">
              <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4TB</div>
              <div className="text-gray-300 text-sm">De contenido premium</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl">
              <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-300 text-sm">Soporte incluido</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - SIMPLIFICADO */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-yellow-400">¿Qué obtienes</span>
              <span className="text-white"> por solo 18,95€?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contenido principal */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-8 rounded-2xl border-2 border-yellow-500/30">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-2xl">🔥</span>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">30,000 Videos HD</h3>
                <p className="text-gray-300">
                  Más de <span className="text-yellow-400 font-bold">4TB de contenido</span> en Google Drive
                </p>
              </div>
            </div>

            {/* Categorías */}
            <div className="space-y-4">
              {[
                { icon: "🏎️", title: "Coches de Lujo", desc: "Ferrari, Lamborghini, McLaren..." },
                { icon: "🛩️", title: "Jets & Yates", desc: "Aviones privados y yates de millones" },
                { icon: "🏖️", title: "Lifestyle Millonario", desc: "Casas, viajes, experiencias premium" },
                { icon: "💪", title: "Motivación & Gym", desc: "Contenido inspiracional y fitness" },
              ].map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 p-4 rounded-xl border border-yellow-500/20 flex items-center">
                  <span className="text-2xl mr-4">{category.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{category.title}</h4>
                    <p className="text-gray-300 text-sm">{category.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA intermedio */}
          <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8">
            <p className="text-xl text-gray-200 mb-6">
              <span className="text-yellow-400 font-bold">Solo quedan {Math.floor(Math.random() * 50) + 10} unidades</span>
              <br />a este precio especial
            </p>
            <StripeButton />
          </div>
        </div>
      </section>

      {/* Video Gallery - OPTIMIZADA */}
      <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              <span className="text-white font-serif">Vista Previa</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Calidad Premium
              </span>
            </h2>
            <p className="text-xl text-gray-300">Una pequeña muestra de lo que obtienes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {videos.map((video, index) => (
              <div
                key={index}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleVideoClick(`/video/${video}`, index)}
              >
                <video
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  poster={`/video/thumbnails/thumb-${index + 1}.jpg`}
                  onMouseEnter={(e: React.MouseEvent<HTMLVideoElement>) => {
                    const target = e.target as HTMLVideoElement;
                    target.currentTime = 1;
                    target.play().catch(() => {});
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLVideoElement>) => {
                    const target = e.target as HTMLVideoElement;
                    target.pause();
                    target.currentTime = 0;
                  }}
                >
                  <source src={`/video/${video}`} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-yellow-500/20 group-hover:ring-yellow-400/60 transition-all duration-300"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-black fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-yellow-400 font-bold text-sm">#{String(index + 1).padStart(2, "0")}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-200 mb-6">
              <span className="text-yellow-400 font-bold">Esto es solo el 0.03%</span> del contenido total
            </p>
            <StripeButton />
          </div>
        </div>

        {/* Modal de video - MANTENIDO IGUAL */}
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
                    <p className="text-white text-lg font-semibold">Cargando video...</p>
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

              <button
                onClick={() => navigateVideo("prev")}
                disabled={isLoading}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-all duration-200 z-20 disabled:opacity-50"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={() => navigateVideo("next")}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-all duration-200 z-20 disabled:opacity-50"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>

              <div className="absolute inset-0 group">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                      Video Premium #{String(selectedVideo.index + 1).padStart(2, "0")}
                    </h3>
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
                      className="w-12 h-12 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="w-12 h-12 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isFullscreen ? <Minimize className="w-6 h-6 text-white" /> : <Maximize className="w-6 h-6 text-white" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Final CTA - URGENCIA MÁXIMA */}
      <section className="py-20 bg-gradient-to-b from-black to-red-900/20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-red-900/30 to-black/90 backdrop-blur-sm p-12 rounded-3xl border-2 border-red-500/50">
            
            {/* Timer grande */}
            <div className="inline-flex items-center px-8 py-4 bg-red-600 rounded-full text-white font-bold text-xl mb-8 animate-pulse">
              <Clock className="w-6 h-6 mr-3" />
              TIEMPO RESTANTE: {formatTime(timeLeft)}
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="text-white font-serif">Última</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                Oportunidad
              </span>
            </h2>

            <div className="mb-8">
              <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                18,95€
              </div>
              <div className="text-gray-400 line-through text-2xl mb-2">En lugar de 297,00€</div>
              <div className="text-red-400 font-bold text-xl animate-pulse">
                ⏰ Precio vuelve a 297€ cuando termine el timer
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-center text-green-400 text-xl">
                <CheckCircle className="w-6 h-6 mr-3" />
                30,000 videos premium en Google Drive
              </div>
              <div className="flex items-center justify-center text-green-400 text-xl">
                <CheckCircle className="w-6 h-6 mr-3" />
                Acceso inmediato tras el pago
              </div>
              <div className="flex items-center justify-center text-green-400 text-xl">
                <CheckCircle className="w-6 h-6 mr-3" />
                Garantía de devolución 30 días
              </div>
            </div>

            <StripeButton />

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-6">
              <span className="text-red-400 font-bold">AVISO:</span>
              Esta oferta no se repetirá. Miles de personas ya están usando este contenido para ganar dinero.
              ¿Vas a quedarte atrás?
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Compacta - SOLO LAS ESENCIALES */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Preguntas</span>
              <span className="text-yellow-400"> Importantes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Cómo recibo el acceso después de comprar?",
                answer: "Inmediatamente después del pago serás redirigido a una página con el enlace directo a Google Drive. También recibirás un email con las instrucciones. Si hay problemas: megapack3k@gmail.com"
              },
              {
                question: "¿Realmente son 30.000 videos sin marca de agua?",
                answer: "Sí, más de 30.000 videos en HD completamente limpios, organizados en carpetas por categorías. Más de 4TB de contenido premium listo para usar."
              },
              {
                question: "¿Puedo usar estos videos para mi negocio y ganar dinero?",
                answer: "Absolutamente. Derechos de uso comercial incluidos. Puedes usarlos para tu marca, clientes, o incluso revenderlos. Sin restricciones."
              },
              {
                question: "¿Esta oferta de 18,95€ es real o hay costos ocultos?",
                answer: "Es real y es el precio final. No hay costos ocultos, suscripciones o pagos adicionales. Pago único con acceso de por vida."
              },
              {
                question: "¿Qué hago si tengo problemas después de comprar?",
                answer: "Contáctanos a megapack3k@gmail.com con tu comprobante de pago. Respuesta garantizada en menos de 2 horas. Soporte incluido de por vida."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-yellow-500/20">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-yellow-500/5 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform duration-300">
                      <span className="text-black font-bold text-xl">+</span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-yellow-500/20">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* Soporte directo */}
          <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border-2 border-yellow-500/30 text-center">
            <h3 className="text-xl font-bold text-white mb-3">¿Problemas con el acceso?</h3>
            <div className="bg-black/30 p-4 rounded-xl max-w-md mx-auto">
              <p className="text-yellow-300 font-mono text-lg mb-2">megapack3k@gmail.com</p>
              <p className="text-gray-300 text-sm">Envía tu comprobante y te damos acceso personal</p>
              <p className="text-yellow-400 font-semibold">Respuesta en menos de 2 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simplificado */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-xl font-bold text-yellow-400 mb-2">Mega Pack Videos de Lujo</div>
          <p className="text-gray-400 text-sm mb-4">Tu éxito en redes sociales empieza aquí</p>
          
          <div className="grid md:grid-cols-3 gap-6 text-xs text-gray-500 max-w-2xl mx-auto">
            <div>
              <p>30,000 videos premium</p>
              <p>Acceso instantáneo</p>
            </div>
            <div>
              <p>Pago 100% seguro</p>
              <p>Garantía 30 días</p>
            </div>
            <div>
              <p>megapack3k@gmail.com</p>
              <p>Soporte incluido</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-gray-600 text-xs">© 2024 Mega Pack Videos de Lujo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;