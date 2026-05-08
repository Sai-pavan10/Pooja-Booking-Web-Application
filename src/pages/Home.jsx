import Hero from '../components/Hero';
import { getServiceItems, useLanguage } from '../i18n';
import './Home.css';

const navigateTo = (href) => {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function Home() {
  const { language, content } = useLanguage();
  const home = content.home;
  const servicePreviews = getServiceItems(language).slice(0, 3);

  return (
    <>
      <Hero />

      <section className="home-services-preview">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">{home.servicesTag}</p>
            <h2 className="section-title">{home.servicesTitle}</h2>
            <div className="divider">
             
            </div>
            <p className="section-intro">{home.servicesIntro}</p>
          </div>

          <div className="home-service-grid">
            {servicePreviews.map(([title, subtitle, text]) => (
              <article className="home-service-card" key={title}>
                <p className="home-card-kicker">{subtitle}</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="home-preview-action">
            <button className="btn-primary" onClick={() => navigateTo('/services')}>
              {home.viewServices}
            </button>
          </div>
        </div>
      </section>

      <section className="home-about-preview">
        <div className="container home-about-grid">
          <div className="home-about-panel">
            
            <div>
              <strong>10+</strong>
              <p>{home.years}</p>
            </div>
          </div>

          <div className="home-about-copy">
            <p className="section-tag">{home.aboutTag}</p>
            <h2 className="section-title">{home.aboutTitle}</h2>
            <p>{home.aboutText}</p>
            <div className="home-about-points">
              {home.points.map((point) => <span key={point}>{point}</span>)}
            </div>
            <button className="btn-primary" onClick={() => navigateTo('/about')}>
              {home.learn}
            </button>
          </div>
        </div>
      </section>

      <section className="home-reviews-preview">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">{home.reviewsTag}</p>
            <h2 className="section-title">{home.reviewsTitle}</h2>
            <div className="divider">
              <span className="divider-line" />
              
              <span className="divider-line right" />
            </div>
          </div>

          <div className="home-review-grid">
            {home.reviews.map(([name, city, text]) => (
              <article className="home-review-card" key={name}>
                <div className="home-review-stars">★★★★★</div>
                <p className="home-review-text">"{text}"</p>
                <div>
                  <h3>{name}</h3>
                  <span>{city}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="home-preview-action">
            <button className="btn-primary" onClick={() => navigateTo('/testimonials')}>
              {home.readReviews}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
