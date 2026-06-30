import { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Pandits from './pages/Pandit';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import MyBookings from './pages/MyBookings';
import ReviewForm from './pages/ReviewForm';
import ReviewsPage from './pages/ReviewsPage';
import LoadingScreen from './components/LoadingScreen';
import AIChatBot from './components/AIChatBot';
import { AuthProvider } from './context/authcontext';

const ROUTES = {
  '/': Home,
  '/services': Services,
  '/about': About,
  '/pandits': Pandits,
  '/gallery': Gallery,
  '/booking': Booking,
  '/contact': Contact,
  '/pricing': Pricing,
  '/my-bookings': MyBookings,
  '/submit-review': ReviewForm,
  '/reviews': ReviewsPage,
};

const normalizePath = (path) => {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '') || '/';
};

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('app:navigate', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('app:navigate', onLocationChange);
    };
  }, []);

  const Page = useMemo(() => ROUTES[path] || Home, [path]);

  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mallanna&family=Montserrat:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Ponnala&display=swap');
        :lang(en), :lang(en) * { font-family: 'Montserrat', 'Oswald', sans-serif !important; }
        :lang(te), :lang(te) * { font-family: 'Mallanna', sans-serif !important; }
        :lang(te) .section-tag, :lang(te) .cat-card-sub, :lang(te) .sub-card-sub,
        :lang(te) .tag, :lang(te) .l1-hero-tag, :lang(te) .l3-hero-subtitle,
        :lang(te) .welcome-subtitle, :lang(te) .gallery-sub,
        :lang(te) .gallery-overlay-sub, :lang(te) .lightbox-sub, :lang(te) .pandit-title-label,
        :lang(te) .testi-meta, :lang(te) .mini-pooja, :lang(te) .contact-sub-title,
        :lang(te) .plan-note, :lang(te) .sidebar-price-label, :lang(te) .sidebar-info-label,
        :lang(te) .temple-attribution, :lang(te) .chatbot-header__sub {
          font-family: 'Ponnala', sans-serif !important;
        }
        .reveal { opacity:0; transform:translateY(30px) scale(0.95); transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
        .reveal.visible { opacity:1; transform:translateY(0) scale(1); }
        .service-card,.pricing-card,.pandit-card,.gallery-card,.home-service-card,.home-review-card,.contact-card {
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275) !important;
        }
        .service-card:hover,.pricing-card:hover,.pandit-card:hover,.gallery-card:hover,
        .home-service-card:hover,.home-review-card:hover,.contact-card:hover {
          transform:translateY(-8px) scale(1.03) !important;
          box-shadow:0 15px 30px rgba(139,0,0,0.15) !important;
          z-index:10;
        }
        button,.btn-primary,.btn-secondary,.nav-book-btn,.service-btn,.faq-q,.scroll-top-btn {
          transition:all 0.3s ease !important;
        }
        button:hover,.btn-primary:hover,.btn-secondary:hover,.nav-book-btn:hover,
        .service-btn:hover,.scroll-top-btn:hover {
          transform:translateY(-2px) scale(1.05) !important;
          box-shadow:0 8px 20px rgba(0,0,0,0.15) !important;
        }
        button:active,.btn-primary:active,.btn-secondary:active,.nav-book-btn:active,.service-btn:active {
          transform:translateY(1px) scale(0.98) !important;
        }
        input,select,textarea { transition:all 0.3s ease !important; }
        input:focus,select:focus,textarea:focus {
          transform:scale(1.02);
          box-shadow:0 0 0 3px rgba(139,0,0,0.2) !important;
          border-color:var(--maroon,brown) !important;
        }
        .nav-links li a { transition:transform 0.3s ease, color 0.3s ease !important; display:inline-block; }
        .nav-links li a:hover { transform:scale(1.1); }
        .service-image-row { overflow:hidden; }
        .service-image,.about-visual img { transition:transform 0.6s ease !important; }
        .service-card:hover .service-image { transform:scale(1.1) !important; }
      `}</style>

      {!isLoaded && (
        <LoadingScreen logoSrc="/welcome_page.png" onComplete={() => setIsLoaded(true)} />
      )}

      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease', visibility: isLoaded ? 'visible' : 'hidden' }}>
        <Navbar />
        <main className={path === '/' ? 'home-main' : 'page-main'}>
          <Page />
        </main>
        <Footer />
        <AIChatBot />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
