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
      <Navbar />
      <main className={path === '/' ? 'home-main' : 'page-main'}>
        <Page />
      </main>
      <Footer />
    </>
  );
}

export default App;
