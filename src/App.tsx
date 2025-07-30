import React, { useEffect, useState, useRef } from 'react';
import { 
  Play,  
  CheckCircle, 
  Star,
  Shield,
  Zap,
  Crown,
  Award,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react';

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const fullscreenRef = useRef(null);

  useEffect(() => {
    // Load Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    }
  }, []);

  // Lista de videos en la carpeta public/video
  const videos = [
    'video1.mp4',
    'video2.mp4', 
    'video3.mp4',
    'video4.mp4',
    'video5.mov',
    'video6.mov',
    'video7.mp4',
    'video8.mp4'
  ];

  const handleVideoClick = (videoSrc, index) => {
    setSelectedVideo({ src: videoSrc, index });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsFullscreen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.log('Error attempting to exit fullscreen:', err);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Manejar el cambio de fullscreen con ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        closeVideo();
      }
    };

    if (selectedVideo) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedVideo]);

  const testimonials = [
    {
      name: "Carlos M.",
      text: "Increíble colección. Mi engagement se disparó desde el primer día. Vale oro.",
      rating: 5
    },
    {
      name: "María L.",
      text: "La calidad es excepcional. Contenido que realmente funciona en redes sociales.",
      rating: 5
    },
    {
      name: "Roberto S.", 
      text: "Mejor inversión para mi negocio digital. Contenido premium que convierte.",
      rating: 5
    }
  ];

  const StripeButton = ({ className = "" }) => (
    <div className={`stripe-button-container ${className}`}>
      <stripe-buy-button
        buy-button-id="buy_btn_1RqNNQLaDNozqJeSk8ZpYjnQ"
        publishable-key="pk_test_51RRNGqLaDNozqJeS4pqNrfv4leVcW7lb7vgnmwGNDnZ4qyGQX7Ljx04zrUZHU9W7qfGCAWgnuuSqgsHtxZb4G43c00lPYHXmL1"
      >
      </stripe-buy-button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/public/video/Pack +300 Vídeos de Lifestyle @eugomeshenrique (296).mp4" type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg')] bg-cover bg-center opacity-20"></div>
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full text-black font-semibold text-sm mb-6">
              <Crown className="w-4 h-4 mr-2" />
              OFERTA EXCLUSIVA LIMITADA
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              Mega Pack de 30.000
            </span>
            <br />
            <span className="text-white font-serif">Videos de Lujo</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 font-light">
              para Reels, TikTok y Shorts
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contenido exclusivo y listo para usar en tus redes sociales. 
            <span className="text-yellow-400 font-semibold"> Transforma tu perfil en una marca de lujo.</span>
          </p>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-gray-400 line-through text-xl">Antes: 97,00 €</div>
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  18,95 €
                </div>
                <div className="text-red-400 font-semibold text-sm">¡81% DE DESCUENTO!</div>
              </div>
            </div>
            
            <StripeButton className="transform hover:scale-105 transition-all duration-300" />
            
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              ⚡ Entrega instantánea • 🔒 Pago 100% seguro • 💎 Garantía de satisfacción
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* What is the Mega Pack Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                ¿Qué es el Mega Pack
              </span>
              <span className="text-white font-serif"> de Videos Virales de Lujo?</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Son videos de alta calidad en formato de Reel con derechos de uso que puedes utilizar en IG, TikTok y YouTube Shorts. 
                Es como tener un equipo de producción a tu disposición, pero sin los costos ni el tiempo de creación. 
                <span className="text-yellow-400 font-semibold"> Personalízalos a tu gusto o súbelos tal cual como están y mira como tus cuentas crecen.</span>
              </p>
              
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30 mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">No existe otro paquete como este en el mercado</h3>
                <p className="text-lg text-gray-300 mb-6">
                  No hace falta que intentes buscar. No encontrarás un paquete más completo que este.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">El pack más completo y exclusivo</h4>
                      <p className="text-gray-300 text-sm">Ningún otro paquete ofrece esta cantidad y calidad de contenido.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Más viralidad en redes</h4>
                      <p className="text-gray-300 text-sm">Tus publicaciones ganarán tracción con videos impactantes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Ahorra tiempo y dinero</h4>
                      <p className="text-gray-300 text-sm">No necesitas crear contenido desde cero.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Gana autoridad y seguidores</h4>
                      <p className="text-gray-300 text-sm">Eleva tu imagen con videos profesionales.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Monetiza fácilmente</h4>
                      <p className="text-gray-300 text-sm">Usa los videos para atraer clientes y aumentar ingresos de tu negocio.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Whom Section */}
          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                ¿Para Quién es
              </span>
              <span className="text-white font-serif"> Este Pack?</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Creadores de contenido que buscan viralidad inmediata",
                "Emprendedores que necesitan contenido impactante",
                "Agencias de marketing y editores de video",
                "Marcas y negocios que buscan diferenciarse en redes",
                "Personas que no logran viralizar su contenido y quieren crecer en redes rápidamente",
                "Dueños de negocios que sienten que su marca está estancada y necesitan contenido de alto impacto"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-yellow-500/20">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-xs">🌟</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What You Get Section */}
          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                ¿Qué obtienes
              </span>
              <span className="text-white font-serif"> al comprar?</span>
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {/* Main Feature */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-8 rounded-2xl border-2 border-yellow-500/30 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                    <span className="text-black font-bold text-2xl">🔥</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    +30,000 videos HD
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-center">
                  <div className="bg-black/30 p-6 rounded-xl">
                    <h4 className="text-yellow-400 font-bold text-lg mb-2">📁 Almacenamiento</h4>
                    <p className="text-gray-300">Más de <span className="text-yellow-400 font-bold">4TB de contenido</span> guardado en Google Drive</p>
                  </div>
                  <div className="bg-black/30 p-6 rounded-xl">
                    <h4 className="text-yellow-400 font-bold text-lg mb-2">♾️ Acceso</h4>
                    <p className="text-gray-300">Acceso a la carpeta <span className="text-yellow-400 font-bold">de por vida</span></p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-8 text-yellow-400">Categorías exclusivas:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: "👑", title: "Lujo & Estilo de vida millonario", desc: "Coches de lujo, yates, mansiones, viajes premium" },
                    { icon: "🚀", title: "Superación personal", desc: "Motivación, crecimiento personal, mentalidad de éxito" },
                    { icon: "💼", title: "Negocios & Emprendimiento", desc: "Estrategias de negocio, inversiones, lifestyle empresarial" },
                    { icon: "⚡", title: "Motivación & Éxito", desc: "Frases inspiradoras, logros, mentalidad ganadora" }
                  ].map((category, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl border border-yellow-500/20">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{category.icon}</span>
                        <h4 className="font-bold text-white">{category.title}</h4>
                      </div>
                      <p className="text-gray-300 text-sm">{category.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Features */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl border border-yellow-500/20">
                  <h4 className="font-bold text-yellow-400 mb-3 flex items-center">
                    <span className="mr-2">📱</span>
                    Formatos compatibles
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">Con todas las redes sociales:</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• TikTok</li>
                    <li>• Instagram Reels</li>
                    <li>• YouTube Shorts</li>
                    <li>• Facebook Reels</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-6 rounded-xl border border-yellow-500/20">
                  <h4 className="font-bold text-yellow-400 mb-3 flex items-center">
                    <span className="mr-2">⚖️</span>
                    Derechos incluidos
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Derechos de uso incluidos para <span className="text-yellow-400 font-semibold">monetizar sin restricciones</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Section - ACTUALIZADA CON VIDEOS */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Efectos de fondo lujosos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white font-serif tracking-wide">Colección</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent font-bold">Premium</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experimenta la máxima calidad en cada video de nuestra exclusiva colección
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
                onClick={() => handleVideoClick(`/video/${video}`, index)}
              >
                {/* Video preview */}
                <video 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => {
                    e.target.currentTime = 0;
                    e.target.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                >
                  <source src={`/video/${video}`} type="video/mp4" />
                </video>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Golden border effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-yellow-500/20 group-hover:ring-yellow-400/60 transition-all duration-300"></div>
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-black fill-current ml-1" />
                  </div>
                </div>
                
                {/* Video number */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-yellow-400 font-bold text-sm">#{String(index + 1).padStart(2, '0')}</span>
                </div>
                
                {/* Premium badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black font-bold text-xs uppercase tracking-wide">4K</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text font-bold text-xl">
                Esta es solo una pequeña muestra de lujo...
              </span>
              <br />
              <span className="text-gray-200">¡Desbloquea acceso a 30,000 videos premium en máxima calidad!</span>
            </p>
            <StripeButton />
          </div>
        </div>

        {/* Modal de video en pantalla completa */}
        {selectedVideo && (
          <div 
            ref={fullscreenRef}
            className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${
              isFullscreen ? 'p-0' : 'p-4'
            }`}
          >
            {/* Video player */}
            <div className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-auto h-full max-w-full max-h-full object-contain"
                controls={false}
                autoPlay
                muted={isMuted}
                playsInline
                onLoadedData={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
              >
                <source src={selectedVideo.src} type="video/mp4" />
              </video>
              
              {/* Controls overlay */}
              <div className="absolute inset-0 group">
                {/* Top controls */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                      Video Premium #{String(selectedVideo.index + 1).padStart(2, '0')}
                    </h3>
                    <button
                      onClick={closeVideo}
                      className="w-10 h-10 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isMuted ? 
                        <VolumeX className="w-6 h-6 text-white" /> : 
                        <Volume2 className="w-6 h-6 text-white" />
                      }
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="w-12 h-12 bg-black/60 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {isFullscreen ? 
                        <Minimize className="w-6 h-6 text-white" /> : 
                        <Maximize className="w-6 h-6 text-white" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/221348/pexels-photo-221348.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm p-12 rounded-3xl border-2 border-yellow-500/30">
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-red-600 rounded-full text-white font-bold text-sm mb-6 animate-pulse">
                <Zap className="w-4 h-4 mr-2" />
                OFERTA LIMITADA - NO VOLVERÁ A REPETIRSE
              </div>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-bold mb-8">
              <span className="text-white font-serif">Acceso completo por</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> solo:</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-2xl text-gray-400 line-through mb-2">Precio normal: 97,00 €</div>
                <div className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                  18,95€
                </div>
                <div className="text-red-400 font-bold text-xl">¡AHORRA 78,05 €!</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-12">
              <div className="flex items-center justify-center text-green-400 text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                Acceso inmediato tras la compra
              </div>
              <div className="flex items-center justify-center text-green-400 text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                30.000 videos en resolución premium
              </div>
              <div className="flex items-center justify-center text-green-400 text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                Actualizaciones gratuitas de por vida
              </div>
            </div>
            
            <StripeButton />
            
            <p className="text-sm text-gray-400 mt-6">
              💳 Pago seguro con Stripe • 🔒 Datos protegidos • ⚡ Descarga inmediata
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white font-serif">Lo que dicen</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> nuestros clientes</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-yellow-500/20">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">Cliente verificado</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl">
              <Shield className="w-6 h-6 mr-3" />
              <span className="font-bold text-lg">Garantía de Satisfacción 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/279315/pexels-photo-279315.jpeg')] bg-cover bg-center opacity-15"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-8" />
            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="text-white font-serif">No pierdas esta</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">oportunidad única</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Miles de creadores ya están usando nuestro contenido para 
              <span className="text-yellow-400 font-semibold"> dominar las redes sociales.</span>
              <br />
              ¿Vas a quedarte atrás?
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                18,95€
              </div>
              <div className="text-gray-400 line-through text-2xl mb-2">En lugar de 97,00€</div>
              <div className="text-red-400 font-bold text-xl animate-pulse">
                ⏰ Esta oferta expira pronto
              </div>
            </div>
            
            <StripeButton />
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              <span className="text-yellow-400 font-semibold">Última oportunidad:</span> 
              Esta es la única vez que ofreceremos este pack completo a este precio. 
              Una vez que cierre la oferta, el precio volverá a 97€.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white font-serif">Preguntas</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> Frecuentes</span>
            </h2>
            <p className="text-xl text-gray-300">
              Resolvemos todas tus dudas sobre el Mega Pack
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "¿Cómo recibo el acceso después de comprar?",
                answer: "Inmediatamente después del pago recibirás un email con el enlace de acceso a Google Drive. Si no recibes el acceso en 10 minutos, contáctanos enviando tu comprobante de pago y te daremos acceso personalizado al instante."
              },
              {
                question: "¿Qué hago si compro y no obtengo acceso?",
                answer: "Si realizaste el pago y no recibiste el acceso, no te preocupes. Contáctanos inmediatamente enviándonos tu comprobante de pago (captura de pantalla o email de confirmación) y te proporcionaremos el enlace de acceso personalizado en menos de 1 hora."
              },
              {
                question: "¿Realmente son 30.000 videos?",
                answer: "Sí, el pack contiene más de 30.000 videos en formato vertical (9:16) optimizados para Reels, TikTok y Shorts. Todo el contenido está organizado en carpetas por categorías en Google Drive con más de 4TB de material."
              },
              {
                question: "¿Puedo usar estos videos para mi negocio?",
                answer: "Absolutamente. Todos los videos incluyen derechos de uso comercial. Puedes usarlos para tu marca personal, negocio, clientes, o incluso revenderlos. No hay restricciones de uso."
              },
              {
                question: "¿Los videos tienen marca de agua?",
                answer: "No, todos los videos están completamente limpios sin marcas de agua, logos o watermarks. Están listos para usar tal como están o puedes editarlos y personalizarlos."
              },
              {
                question: "¿Funciona en todos los países?",
                answer: "Sí, el contenido es universal y funciona en cualquier país. Los videos son principalmente visuales con música de fondo, perfectos para cualquier audiencia global."
              },
              {
                question: "¿Qué calidad tienen los videos?",
                answer: "Todos los videos están en alta definición (HD) y algunos en 4K. Están optimizados específicamente para redes sociales con la mejor calidad posible para formato vertical."
              },
              {
                question: "¿Hay actualizaciones incluidas?",
                answer: "Sí, recibes acceso de por vida a la carpeta de Google Drive. Esto significa que cuando agreguemos nuevo contenido, automáticamente tendrás acceso sin costo adicional."
              },
              {
                question: "¿Puedo descargar todos los videos?",
                answer: "Sí, puedes descargar todos los videos a tu dispositivo. También puedes acceder directamente desde Google Drive para usar cuando necesites sin ocupar espacio en tu dispositivo."
              },
              {
                question: "¿Ofrecen garantía?",
                answer: "Sí, ofrecemos garantía de satisfacción del 100%. Si no estás completamente satisfecho con el contenido, contáctanos dentro de los primeros 7 días y te ayudaremos a resolver cualquier problema."
              },
              {
                question: "¿Cómo contacto soporte si tengo problemas?",
                answer: "Puedes contactarnos enviando un email con tu comprobante de pago. Nuestro equipo de soporte responde en menos de 2 horas y resuelve cualquier problema de acceso inmediatamente."
              },
              {
                question: "¿Esta oferta de 18,95€ es real?",
                answer: "Sí, es una oferta promocional limitada. El precio normal es 97€, pero por tiempo limitado ofrecemos este descuento especial. Una vez que termine la promoción, el precio volverá al valor original."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-yellow-500/20 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-yellow-500/5 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform duration-300">
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
          
          {/* Contact Support Box */}
          <div className="mt-16 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-8 rounded-2xl border-2 border-yellow-500/30 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-black font-bold text-2xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¿Tienes más preguntas?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Si tienes alguna duda específica o problemas con el acceso después de la compra, 
              <span className="text-yellow-400 font-semibold"> contáctanos con tu comprobante de pago</span> 
              y te ayudaremos inmediatamente.
            </p>
            <div className="bg-black/30 p-6 rounded-xl max-w-md mx-auto">
              <h4 className="text-yellow-400 font-bold mb-3">📧 Soporte Directo</h4>
              <p className="text-gray-300 text-sm mb-2">Envía tu comprobante de pago y te damos acceso personal</p>
              <p className="text-yellow-400 font-semibold">Respuesta en menos de 2 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
              Mega Pack Videos de Lujo
            </div>
            <p className="text-gray-400">
              Tu éxito en redes sociales empieza aquí
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-400">
            <div>
              <h4 className="text-white font-semibold mb-3">Contenido</h4>
              <ul className="space-y-2">
                <li>30.000 videos premium</li>
                <li>Resolución 4K</li>
                <li>Formato vertical optimizado</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Garantías</h4>
              <ul className="space-y-2">
                <li>Pago 100% seguro</li>
                <li>Entrega instantánea</li>
                <li>Soporte técnico incluido</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contacto</h4>
              <ul className="space-y-2">
                <li>Soporte 24/7</li>
                <li>Respuesta en 1 hora</li>
                <li>Satisfacción garantizada</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2024 Mega Pack Videos de Lujo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;