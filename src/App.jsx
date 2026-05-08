import { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Pandits from './pages/Pandit';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import LoadingScreen from './components/LoadingScreen'; // ✅ already imported

const ROUTES = {
  '/': Home,
  '/services': Services,
  '/about': About,
  '/pandits': Pandits,
  '/gallery': Gallery,
  '/testimonials': Testimonials,
  '/booking': Booking,
  '/contact': Contact,
  '/pricing': Pricing,
};

const normalizePath = (path) => {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '') || '/';
};

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [isLoaded, setIsLoaded] = useState(false); // 👈 ADD THIS

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
    <>
      {/* 👇 ADD THIS BLOCK */}
      {!isLoaded && (
        <LoadingScreen
          logoSrc="/welcome_page.png"
          onComplete={() => setIsLoaded(true)}
        />
      )}

      {/* 👇 WRAP existing JSX with this div */}
      <div style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s ease',
        visibility: isLoaded ? 'visible' : 'hidden'
      }}>
        <Navbar />
        <main className={path === '/' ? 'home-main' : 'page-main'}>
          <Page />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;