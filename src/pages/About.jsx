import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import aboutPagePic from '../assets/About page pic.jpeg';
import './About.css'; // Assuming this is the correct path

const mustKnowContent = {
  en: {
    heading: 'What You Must Know',
    paragraphs: [
      'In recent times, many people have started performing poojas without proper training or scriptural qualification. Some wear traditional attire, learn only basic priestly information and persuasion tactics, then create fear by speaking about different doshas and quote very large amounts for remedial poojas.',
      'After collecting those amounts, they often arrange qualified Vedic Brahmins for only a small honorarium, such as Rs. 2,000 or Rs. 3,000 per ritual. Because priestly service is the livelihood of those scholars, they are sometimes forced by circumstance to accept it.',
      'The intention of performing griha praveshams, weddings, vrathams, homams, yagnas and other sacred Hindu rituals is deeply noble. Families do these ceremonies with devotion so that obstacles are removed and auspiciousness enters their lives. But the result of a pooja depends on the qualification, learning and sincerity of the Brahmin performing it.',
      'This is supported by shastra. Our humble appeal is that the sambhavana given after a pooja should reach the learned Brahmins who perform the ritual.',
      'With devotion, Agama Shastra Pandit Daruri Vishnuvardhana Charyulu. Jai Srimannarayana.',
      'Practicing dharma has been a radiant truth in the Indian way of life for ages.',
    ],
  },
  te: {
    heading: 'మీరు కచ్ఛితముగా తెలుసుకోవలసినది',
    paragraphs: [
      'ఈ కాలములో సరైన శాస్త్ర జ్ఞానం లేదా అర్హత లేకుండానే కొందరు పూజలు చేయడం ప్రారంభించారు. బ్రాహ్మణ వేషధారణతో, పౌరోహిత్యంలోని ప్రాథమిక విషయాలు మరియు భక్తులను ఒప్పించే కొన్ని మాటలు నేర్చుకుని, దోషాల పేరుతో భయపెట్టి పెద్ద మొత్తాలు అడుగుతున్నారు.',
      'ఆ తరువాత ఆ పూజలకు అర్హులైన వేద బ్రాహ్మణులను తక్కువ సంభావనతో పిలుస్తున్నారు. పౌరోహిత్యమే జీవనాధారంగా ఉన్న పండితులు కొన్ని సందర్భాల్లో పరిస్థితులవల్ల అంగీకరించవలసి వస్తుంది.',
      'గృహప్రవేశాలు, వివాహాలు, వ్రతాలు, హోమాలు, యాగాలు వంటి పవిత్ర హిందూ సంప్రదాయ పూజలు భక్తితో చేయించుకోవడం ఎంతో శుభకరం. అయితే పూజా ఫలితం ఆ పూజను నిర్వహించే బ్రాహ్మణుని విద్య, అర్హత మరియు నిష్ఠపై ఆధారపడి ఉంటుంది.',
      'ఇది శాస్త్రప్రమాణం. పూజ అనంతరం ఇచ్చే సంభావన పూజను నిర్వహించిన అర్హులైన బ్రాహ్మణులకే చేరాలి అనేది మా వినమ్ర అభ్యర్థన.',
      'ఇట్లు, ఆగమ శాస్త్ర పండితులు దరూరి విష్ణు వర్ధనాచార్యులు. జై శ్రీమన్నారాయణ.',
      'ధర్మాన్ని ఆచరించడం అనేది యుగాలుగా భారతీయ జీవన విధానంలో ఒక కాంతిమంతమైన సత్యం.',
    ],
  },
  hi: {
    heading: 'आपको यह अवश्य जानना चाहिए',
    paragraphs: [
      'आजकल कई लोग उचित शास्त्रीय ज्ञान या योग्यता के बिना पूजा करना शुरू कर देते हैं। कुछ लोग पारंपरिक वेश धारण करके, पुरोहिताई की केवल मूल बातें और भक्तों को मनाने की बातें सीखकर, दोषों के नाम पर भय पैदा करते हैं और उपचारात्मक पूजा के लिए बड़ी राशि मांगते हैं।',
      'इसके बाद वे योग्य वैदिक ब्राह्मणों को बहुत कम दक्षिणा पर पूजा के लिए बुलाते हैं। पुरोहिताई ही जिन विद्वानों का जीवनाधार है, वे कई बार परिस्थितियों के कारण इसे स्वीकार करने को विवश होते हैं।',
      'गृह प्रवेश, विवाह, व्रत, होम, यज्ञ और अन्य पवित्र हिंदू संस्कार श्रद्धा से करवाना अत्यंत शुभ है। लेकिन पूजा का फल उसे संपन्न कराने वाले ब्राह्मण की विद्या, योग्यता और निष्ठा पर निर्भर करता है।',
      'यह शास्त्र प्रमाणित बात है। हमारी विनम्र प्रार्थना है कि पूजा के बाद दी जाने वाली दक्षिणा उस योग्य ब्राह्मण तक पहुंचे जिसने विधि-विधान से पूजा संपन्न की है।',
      'सादर, आगम शास्त्र पंडित दारुरी विष्णुवर्धनाचार्युलु। जय श्रीमन्नारायण।',
      'धर्म का आचरण युगों से भारतीय जीवन पद्धति का एक प्रकाशमान सत्य रहा है।',
    ],
  },
};

export default function About() {
  const { content, language } = useLanguage(); // Call useLanguage once and destructure both content and language
  const about = content.about; // This remains the same
  const mustKnow = mustKnowContent[language] || mustKnowContent.en;
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.12 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [content]);

  return (
    <section id="about" className="about-section">
      <div className="about-bg-pattern" aria-hidden="true" />

      <div className="container">

        {/* ── SECTION HEADER ── */}
        <div className="about-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{about.tag || 'Our Commitment'}</p>
          <h2 className="section-title">{about.title || 'What is Dharma Sankalpam?'}</h2>
          <p className="about-subtitle">
            {about.subtitle}
          </p>
        </div>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="about-grid">

          {/* LEFT — Visual column */}
          <div className="about-visual reveal" ref={(el) => (refs.current[1] = el)}>

            {/* Shloka card */}
            <div className="about-temple-card">
              <div className="temple-top">
                <img
                  className="temple-top-image"
                  src={aboutPagePic}
                  alt="Temple pooja ceremony"
                />
                <div className="temple-glow" />
              </div>
              <div className="temple-body">
                <p className="shloka-label">{about.shlokaDevanagari}</p>
                <p className="shloka-verse">{about.shlokaVerse}</p>
                <div className="shloka-divider" />
                <div className="shloka-meaning">
                  {about.shlokaMeaningLines.map((line, i) => (
                    <p key={i} className="shloka-meaning-line">{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Founder attribution */}
            <div className="founder-card reveal" ref={(el) => (refs.current[2] = el)}>
              <div className="founder-avatar" aria-hidden="true"></div> {/* This is an emoji, not translatable */}
              <div className="founder-info">
                <span className="founder-name">{about.founderName}</span>
                <span className="founder-role">{about.founderRole}</span>
                <span className="founder-salutation">{about.founderSalutation}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="about-badge-stack">
              <div className="about-badge">
                <span className="badge-num">10+</span>
                <span className="badge-label">{about.years || 'Years of Service'}</span>
              </div>
              <div className="about-badge gold">
                <span className="badge-num">4.9 ★</span>
                <span className="badge-label">{about.rating || 'Devotee Rating'}</span>
              </div>
              <div className="about-badge">
                <span className="badge-num">100%</span>
                <span className="badge-label">{about.vedicAuthenticity}</span>
              </div>
              <div className="about-badge gold">
                <span className="badge-num">∞</span>
                <span className="badge-label">{about.dharmicCommitment}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Content column */}
          <div className="about-content">

            {/* The problem */}
            <div className="content-block reveal visible" ref={(el) => (refs.current[3] = el)}>
              <h3 className="content-block-title">
                <span className="block-icon">⚠️</span> {about.problemHeading}
              </h3>
              <p className="about-para">
                {about.problemP1}
              </p>
              <p className="about-para">
                {about.problemP2}
              </p>
            </div>

            <div className="content-block reveal visible" ref={(el) => (refs.current[4] = el)}>
              <h3 className="content-block-title">{mustKnow.heading}</h3>
              {mustKnow.paragraphs.map((paragraph) => (
                <p className="about-para" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            {language === 'legacy' && <>
            {/* Must know block */}
            <div className="content-block reveal visible" ref={(el) => (refs.current[4] = el)}>
              <h3 className="content-block-title">మీరు కచ్ఛితముగా తెలుసుకోవలసినది</h3>
              <p className="about-para">
                ఈ కాలములో ఎవరు పడితే వాళ్ళు పూజలు చెయ్యడం ప్రారంభించారు ఈ కాలంలో బ్రతకడానికి అనేకమైనటువంటి మార్గాలు ఉన్నాయి, అన్నిటిలో అతి సులభమైన మార్గం పురోహితం అని తెలుసుకున్న చాలామంది, బ్రాహ్మణ వేషధారణ కట్టి వంటి నిండ బొట్లు పెట్టుకుని, పురోహితములో బేసిక్ ఇన్ఫర్మేషన్, భక్తులను పట్టుకునేటువంటి లాజిక్స్ ని తెలుసుకొని, జనాలకు మీకు ఆ దోషం ఉన్నది ఈ దోషం ఉన్నది అని అనేక మైనటువంటి మాటలు చెప్పి జనాలని భయభ్రాంతులను చేసి ఒక దోష నివారణ పూజకి లక్షలు లక్షలు మాట్లాడుకొని పూజలు చెయ్యిస్తాము అని వొప్పుకొని, నలుగురు వేద బ్రాహ్మణులని మాట్లాడుకొని ఒక పూజ కి 2000 లేదా 3000 ఇలా ఇస్తున్నారు వెళ్లిన ఆ వేద పండితులకి జీవిత ఆధారం పురోహితమే కాబట్టి తప్పని పరిస్థితిలో వెళ్లవాల్సివొస్తుంది.
              </p>
              <p className="about-para">
                ఇలా చేయడంలో తప్పు లేదు అనుకుందాం ప్రతి ఒక్కరూ పెళ్లిళ్లు, గృహప్రవేశాలు, వ్రతాలు, హోమాలు యాగాలు, ఇలా ఎన్నో అద్భుతమైన హిందూ సాంప్రదాయములో ఉన్న పూజలు ఇంట్లో చేయించుకునేది, వారికి ఉన్న దోషం పోయి అంతా శుభము జరగాలని లేదా భగవంతుని మీద భక్తితో దైవ కార్యక్రమాలు నిర్వహిస్తూ ఉంటారు. అలా చేసిన పూజా ఫలితం ఎలా వస్తుంది అంటే మీరు మాట్లాడుకున్నటువంటి బ్రాహ్మణుని మీద ఆధారపడి ఉంటుంది చదువుకున్నవాడు పూజ నిర్వహిస్తే ఫలితం ఖచ్చితంగా వస్తుంది.
              </p>
              <p className="about-para">
                ఇది శాస్తప్రమాణం మీరు పూజ చేసిన తర్వాత ఇచ్చే సంభావన కేవలం బ్రాహ్మణులకే వెళ్ళాలి అనేది మా ఆవేదన అలాగే ఈ బ్రాహ్మణుడి తపన కూడ
              </p>
              <p className="about-para">
                ఇట్లు<br />
                ఆగమ శాస్త పండితులు<br />
                దరూరి విష్ణు వర్ధనాచార్యులు<br />
                జై శ్రీమన్నారాయణ
              </p>
              <p className="about-para">
                ధర్మాన్ని ఆచరించడం అనేది యుగాలుగా భారతీయ జీవన విధానంలో ఓ కాంతిమంతమైన సత్యం.
              </p>
            </div>
            </>}

            {/* Vision block */}
            <div className="vision-block content-block reveal visible" ref={(el) => (refs.current[5] = el)}>
              <div className="vision-header">
                <span className="vision-icon" aria-hidden="true"></span>
                <h3 className="vision-title">{about.visionTitle}</h3>
              </div>
              <p className="vision-intro">
                {about.visionIntro}
              </p>
              <ul className="vision-list">
                {about.visionPoints.map((pt) => (
                  <li key={pt} className="vision-point">
                    <span className="vision-check" aria-hidden="true">✔️</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="vision-closing">
                <em>{about.visionClosing}</em>
                <strong> {about.visionClosingBold}</strong>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
