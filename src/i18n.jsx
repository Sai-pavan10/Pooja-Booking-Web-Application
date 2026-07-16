/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Helper function for translation
export const t = (val, lang) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return val[lang] || val.en || val;
  return val;
};

const houseopeningpoojaImg = new URL('./assets/houseopeningpooja.jpg', import.meta.url).href;
const marraigeImg = new URL('./assets/marraige.jpg', import.meta.url).href;
const narayanavrathamImg = new URL('./assets/narayanavratham.jpg', import.meta.url).href;
const homamImg = new URL('./assets/homam.jpg', import.meta.url).href;

const serviceItems = {
  en: [
    ['Griha Pravesh', 'Home Blessing', 'A sacred ceremony for entering a new home, invoking blessings of prosperity, peace, and divine protection for your household.', houseopeningpoojaImg],
    ['Vivah Puja', 'Wedding Rituals', 'Complete Vedic wedding ceremonies performed with traditional rites by our experienced pandits.', marraigeImg],
    ['Satyanarayan Katha', 'Vishnu Worship', 'A devotional katha and havan for gratitude, fulfillment of wishes, and family prosperity.', narayanavrathamImg],
    ['Navagraha Homam', 'Planetary Harmony Homam', 'A powerful fire ritual to appease the nine planetary deities, remove doshas, and bring astrological balance to your life.', homamImg],
    ['Namkaran Sanskar', 'Naming Ceremony', 'An auspicious Hindu naming ceremony for your newborn, aligned with family tradition.'],
    ['Sri Sudhrashana Homam', 'Divine Protection Homam', 'A powerful homam invoking Lord Sudarshana for protection from negative energies, removal of obstacles, and divine grace for the entire family.'],
  ],
  te: [
    ['గృహ ప్రవేశం', 'ఇంటి ఆశీర్వాదం', 'కొత్త ఇంటిలోకి ప్రవేశించే సమయంలో శాంతి, శ్రేయస్సు, దైవ రక్షణ కోసం చేసే పవిత్ర పూజ.', houseopeningpoojaImg],
    ['వివాహ పూజ', 'వివాహ కర్మలు', 'అనుభవజ్ఞులైన పండితులతో సంప్రదాయ విధానంలో పూర్తి వేద వివాహ కర్మలు.', marraigeImg],
    ['సత్యనారాయణ కథ', 'విష్ణు ఆరాధన', 'కృతజ్ఞత, కోరికల నెరవేర్పు, కుటుంబ శ్రేయస్సు కోసం భక్తితో చేసే కథ మరియు హవనం.', narayanavrathamImg],
    ['నవగ్రహ హోమం', 'గ్రహ శాంతి హోమం', 'నవ గ్రహ దేవతల ఆరాధన, దోషాల నివారణకు, జీవితంలో జ్యోతిష్య సమతుల్యతకు చేసే శక్తివంతమైన అగ్ని హవనం.', homamImg],
    ['నామకరణ సంస్కారం', 'పేరు పెట్టే వేడుక', 'శిశువుకు కుటుంబ సంప్రదాయం ప్రకారం శుభ నామకరణం చేసే పవిత్ర సంస్కారం.'],
    ['శ్రీ సుదర్శన హోమం', 'దివ్య రక్షణ హోమం', 'నకారాత్మక శక్తుల నుంచి రక్షణ, అడ్డంకుల నివారణ మరియు మొత్తం కుటుంబానికి దైవ అనుగ్రహం కోసం సుదర్శన స్వామిని ఆహ్వానించే శక్తివంతమైన హోమం.'],
  ],
  hi: [
    ['गृह प्रवेश', 'घर का आशीर्वाद', 'नए घर में प्रवेश के लिए शांति, समृद्धि और दिव्य सुरक्षा की पवित्र पूजा।', houseopeningpoojaImg],
    ['विवाह पूजा', 'विवाह संस्कार', 'अनुभवी पंडितों द्वारा पारंपरिक विधि से पूर्ण वैदिक विवाह संस्कार।', marraigeImg],
    ['सत्यनारायण कथा', 'विष्णु पूजा', 'कृतज्ञता, मनोकामना पूर्ति और परिवार की समृद्धि के लिए भक्तिपूर्ण कथा और हवन।', narayanavrathamImg],
    ['नवग्रह होमम', 'ग्रह शांति होमम', 'नौ ग्रहों को शांत करने, दोषों को दूर करने और जीवन में ज्योतिषीय संतुलन लाने के लिए एक शक्तिशाली अग्नि अनुष्ठान।', homamImg],
    ['नामकरण संस्कार', 'नामकरण समारोह', 'परिवार की परंपरा के अनुसार शिशु के शुभ नामकरण का पवित्र संस्कार।'],
    ['श्री सुदर्शन होमम', 'दिव्य सुरक्षा होमम', 'नकारात्मक शक्तियों से रक्षा, बाधाओं के निवारण और संपूर्ण परिवार पर दिव्य अनुग्रह के लिए भगवान सुदर्शन का आह्वान करने वाला शक्तिशाली होमम।'],
  ],
};

const translations = {
  en: {
    languageName: 'English',
    nav: {
      sub: 'Vedic Rituals & Services',
      links: ['Home', 'Services', 'About', 'Pandits', 'Gallery', 'Reviews', 'Contact'],
      book: 'Book Now',
      mobileBook: 'Book a Pooja',
      language: 'Language',
      login: 'Login',
      loginSignUp: 'Login / Sign Up',
      logout: 'Logout',
      myBookings: 'My Bookings',
    },
    common: {
      loginRequired: 'Please login to continue booking poojas.',
    },
    auth: {
      resetPassword: 'Reset Password',
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      loginSubtitle: 'Login to manage your pooja bookings',
      signupSubtitle: 'Join us to book sacred pooja services',
      resetSubtitle: 'Enter your email to receive a reset link',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      fullNameLabel: 'Full Name',
      mobileLabel: 'Mobile Number',
      confirmPasswordLabel: 'Confirm Password',
      loginBtn: 'Login',
      signupBtn: 'Create Account',
      sendResetLink: 'Send Reset Link',
      forgotPassword: 'Forgot Password?',
      backToLogin: 'Back to Login',
      noAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      invalidEmail: 'Enter a valid email address.',
      passwordMin: 'Password must be at least 8 characters.',
      passwordMismatch: 'Passwords do not match.',
      emailInUse: 'This email is already registered.',
      invalidCredentials: 'Invalid email or password. Please try again.',
      resetEmailSent: 'Password reset email sent!',
      resetError: 'Could not send reset email. Check the address.',
      resetSentNotice: 'Reset link sent to {email}. Check your inbox.',
      welcomeCreated: 'Welcome, {name}! Account created.',
      logoutNotice: 'You have been logged out.',
      loginPrompt: 'Please login or register to save your booking to your account.',
    },
    hero: {
      tag: 'Sacred Rituals & Divine Services',
      sub: 'Not just a website…',
      main: 'A Dharmic Companion for your sacred pooja journey.',
      desc: 'Connect with learned Vedic pandits for authentic pooja ceremonies, havan rituals, and spiritual guidance. Performed with devotion following ancient scriptures.',
      performed: 'Poojas Performed',
      pandits: 'Expert Pandits',
      types: 'Ritual Types',
      book: 'Book a Pooja',
      services: 'Explore Services',
    },
    home: {
      servicesTitle: 'Popular Pooja Services',
      servicesIntro: 'Choose from traditional ceremonies for homes, families, weddings, festivals, and special milestones.',
      viewServices: 'View All Services',
      bookNow: 'Book Now',
      aboutTag: 'About Dharma Sankalpam',
      aboutTitle: 'Rooted in Tradition, Serving with Love',
      aboutText: 'Our pandits are trained in Sanskrit chanting, Vedic procedures, and regional customs, so every ceremony feels respectful, prepared, and spiritually meaningful.',
      years: 'Years serving families with authentic Vedic rituals',
      points: ['Vedic authenticity', 'Pure pooja samagri', 'Punctual service'],
      learn: 'Learn About Us',
      reviewsTag: 'Blessings & Reviews',
      reviewsTitle: 'What Families Say',
      readReviews: 'Read More Reviews',
      reviews: [
        ['Priya Venkataraman', 'Hyderabad', 'The ceremony was performed with devotion and precision. Our new home felt peaceful and blessed.'],
        ['Rajesh & Sunita Mehta', 'Mumbai', 'Every ritual was explained beautifully, and our wedding ceremony felt sacred from start to finish.'],
      ],
    },
    services: {
      tag: 'Our Offerings',
      title: 'Sacred Pooja Services',
      intro: 'Authentic Vedic rituals performed by learned pandits with proper pronunciation, materials, and devotion as prescribed by the shastras.',
      popular: 'Most Popular',
      book: 'Book Now',
      note: "Don't see your pooja? We perform 20+ ritual types.",
      custom: 'Request Custom Pooja',
      durations: ['2-3 hrs', '4-6 hrs', '3-4 hrs', '3-4 hrs', '1-2 hrs', '1-2 hrs'],
    },
    about: {
      quote: '"Puja is the language of love offered to the divine."',
      tradition: 'Vedic tradition',
      years: 'Years of Service',
      rating: 'Customer Rating',
      tag: 'Our Story',
      title: 'Rooted in Tradition, Serving with Love',
      subtitle: 'The commitment to ensure every puja is performed according to Dharma, scriptural injunctions, and Vedic traditions — by priests who have truly earned the right to stand before the sacred fire.',
      p1: 'Dharma Sankalpam was founded with a single purpose: to make authentic Vedic rituals accessible to every household, performed with the same reverence as in the great temples of India.',
      p2: 'Our pandits are trained in traditional gurukuls with deep mastery of Sanskrit, Vedic phonetics, and ritual procedures. We bring this sacred expertise to your home, temple, or community hall.',
      values: [
        ['Vedic Authenticity', 'All rituals performed strictly per Vedic scriptures with proper Sanskrit chanting.'],
        ['Devotion First', 'Every ceremony is performed with sincere devotion, not mere ceremony.'],
        ['Punctual & Reliable', 'We honor the auspicious timing chosen by your jyotishi without fail.'],
        ['Pure Materials', 'Only satvik, unadulterated puja samagri sourced from trusted suppliers.'],
      ],
      problemHeading: 'What You Must Understand',
      problemP1: 'Today, many perform rituals without proper qualification. By wearing traditional attire and learning only basic information, some create fear about doshas, charge large sums, then hire qualified scholars for a fraction — often only ₹2,000–₹3,000 per ritual.',
      problemP2: 'The effectiveness of a ritual depends entirely on the competence and spiritual qualification of the priest. When a learned Brahmin performs the ritual, the prescribed spiritual benefits are assured — this is not opinion, it is scriptural authority.',
      dharmaValues: [
        ['📜', 'Scripture-Aligned', 'Every ritual follows authentic Vedic injunctions — not convenience or commerce.'],
        ['🪔', 'Qualified Priests Only', 'Rituals performed exclusively by Brahmins who have spent years mastering the Vedas.'],
        ['🙏', 'Devotion Over Transaction', 'Puja is a sacred act, not a service package. We honour its sanctity at every step.'],
        ['⚖️', 'Fair to Scholars', 'Honorarium reaches the Vedic scholars who deserve it — not middlemen.'],
      ],
      visionTitle: 'The Vision of Dharma Sankalpam',
      visionIntro: 'Dharma Sankalpam is an effort to bring sacred traditions back into our lives. Here, every ritual is:',
      visionPoints: [
        'Performed according to the scriptures',
        'Rooted in authentic tradition',
        'Filled with devotion',
        'Conducted with sincerity and purity',
      ],
      visionClosing: 'This is not merely a service.',
      visionClosingBold: 'It is the restoration of truth. It is the path of Dharma.',
      vedicAuthenticity: 'Vedic Authenticity',
      founderName: 'Daruri Vishnuvardhana Charyulu',
      founderRole: 'Agama Shastra Scholar · Founder',
      founderSalutation: 'Jai Srimannarayana 🙏',
      shlokaDevanagari: 'श्लोकः',
      shlokaVerse: 'दैवादीनां जगत्सर्वं मन्त्राधीनं तु दैवतम् ।\nतन्मन्त्रं ब्राह्मणाधीनं ब्राह्मणो मम दैवतम् ॥',
      shlokaMeaningLines: [
        'The entire universe is under the control of the Divine.',
        'The Divine is governed through sacred mantras.',
        'The mantras themselves rest in the mastery of the Brahmin.',
        'Therefore, the learned Brahmin is a visible manifestation of the Divine.',
      ],
      dharmicCommitment: 'Dharmic Commitment',
    },
    gallery: {
      tag: 'Sacred Moments',
      title: 'Ceremony Gallery',
      intro: 'Glimpses of the sacred ceremonies we have had the privilege of performing for families across India.',
      items: [
        ['Griha Pravesh', 'Home Blessing Ceremony'],
        ['Havan Kund', 'Sacred Fire Ritual'],
        ['Phool Mala', 'Floral Offerings'],
        ['Deepam', 'Lamp Lighting Ceremony'],
        ['Vivah Ritual', 'Sacred Wedding Vows'],
        ['Aarti', 'Evening Prayer Ceremony'],
        ['Vedic Chanting', 'Sanskrit Mantras'],
        ['Prasad', 'Divine Blessings'],
      ],
    },
    pandits: {
      tag: 'Our Learned Priests',
      title: 'Meet Our Pandits',
      intro: 'Our pandits are trained in traditional gurukuls with years of experience in Vedic rituals, Sanskrit recitation, and regional customs.',
      specialty: 'Specialty',
      experience: 'Experience',
      languages: 'Languages',
      reviews: 'reviews',
      bookWith: 'Book with',
    },
    testimonials: {
      tag: 'What Families Say',
      title: 'Blessings & Reviews',
    },
    booking: {
      tag: 'Reserve Your Sacred Ceremony',
      title: 'Book a Pooja',
      intro: 'Fill in your details below and we will coordinate with our pandit to arrange the perfect ceremony for your auspicious occasion.',
      labels: ['Full Name', 'Phone Number', 'Email Address', 'Pooja Type', 'Preferred Date', 'Preferred Time', 'Preferred Pandit', 'City / Location', 'Full Address (Optional)', 'Special Instructions / Message'],
      placeholders: ['Your full name', '10-digit mobile number', 'your@email.com', 'Your city', 'House no, street, area...', 'Any special requirements, family deity, regional tradition, or auspicious timing from your jyotishi...'],
      selectPooja: 'Select a Pooja',
      selectTime: 'Select a Time',
      anyAvailable: 'Any Available',
      note: 'Our pandit will call you within 2 hours to confirm booking and discuss samagri requirements.',
      submit: 'Confirm Booking',
      submitting: 'Submitting',
      successTitle: 'Booking Request Received!',
      successSub: 'May your ceremony be blessed and auspicious.',
      another: 'Book Another Pooja',
      errors: ['Name is required', 'Enter a valid 10-digit number', 'Enter a valid email', 'Please select a pooja type', 'Please select a date', 'Please select a time', 'City is required'],
      securePaymentBanner: 'Secure advance payment via Stripe — UPI, Cards, Net Banking accepted',
      authNotice: 'Please login or register to save your booking to your account.',
      locationLabel: 'Location / Landmark',
      locationPlaceholder: 'Enter your location or landmark',
      muhurthamLabel: 'Preferred Muhurtham Date Range',
      dobLabel: 'If you do not know your Nakshatram, send your birth date, time, and place.',
      whatsappButton: 'Send via WhatsApp',
      proceedToPayment: 'Proceed to Payment →',
      loginToBook: 'Login to Book',
      advanceLabel: 'Advance to pay:',
      advanceNote: '(Balance on the day)',
      reviewPayHeader: 'Review & Pay Advance',
      secureStripe: 'Secured by Stripe',
      bookingSummary: 'Booking Summary',
      amountLabel: 'Advance Amount to Pay Now',
      amountNote: 'Balance due on the day of the pooja',
      payVia: 'Pay via',
      redirectingStripe: '⏳ Redirecting to Stripe...',
      editBooking: '← Edit Booking',
      payNow: 'Pay Now',
      paymentDisclaimer: "You will be redirected to Stripe's secure checkout. Your card details are never stored on our servers. After successful payment, your booking status will be updated automatically.",
      successMessage: 'Thank you {name}. Your advance payment has been received and your {pooja} booking is now confirmed. We will call you within 2 hours to finalise the schedule.',
      bookingIdLabel: 'Booking ID:',
      loadingBookings: 'Loading your bookings...',
      loadError: 'Could not load bookings. Please try again.',
      noBookingsTitle: 'No Bookings Yet',
      noBookingsDesc: 'You have not booked any pooja services yet. Browse our services and make your first booking!',
      browsePoojas: 'Browse Poojas →',
      myBookingsTag: 'My Account',
      myBookingsTitle: 'My Bookings',
      welcomeMessage: 'Namaste, {name} — here are all your sacred pooja bookings.',
      viewDetails: 'View Details →',
      close: 'Close',
      loginPromptTitle: 'Login to View Your Bookings',
      loginPromptBody: 'Please login to see your pooja booking history and status updates.',
      loginButton: 'Login / Sign Up',
      bookAnother: '+ Book Another Pooja',
    },
    contact: {
      tag: 'Get in Touch',
      title: 'Contact Us',
      reach: 'Reach Out to Us',
      intro: 'Our team is ready to help you plan your ceremony with care and devotion.',
      labels: ['Phone', 'Email', 'Location', 'Available'],
      values: ['+91 8179960741', 'booking@darmasankalpam.in', 'Road no. 8, Sri Sai Narayana colony, Nagole, Hyderabad, Telangana 500068', 'Daily 6:00 AM - 9:00 PM IST'],
      follow: 'Follow Our Journey',
      socialNetworks: ['Facebook', 'Instagram', 'YouTube', 'Twitter'],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        ['How far in advance should I book?', 'We recommend booking at least 3-5 days in advance. For major ceremonies like Vivah, please book 2-3 weeks ahead.'],
        ['Will the pandit bring puja samagri?', 'Yes. Our pandits can bring all necessary samagri for an additional nominal cost, or you can arrange your own.'],
        ['Do you serve outside major cities?', 'We currently serve major metro areas and are expanding. Contact us for availability in your area.'],
        ['What languages do your pandits speak?', 'Hindi, Telugu, Tamil, Kannada, Marathi, Gujarati, and Sanskrit. We match you with a suitable pandit.'],
      ],
    },
    footer: {
      desc: 'Authentic Vedic rituals performed with devotion by learned pandits, bringing divine blessings to your home and family.',
      service: 'Services',
      quick: 'Quick Links',
      cities: 'Cities',
      citiesList: ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Pune'],
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
      copy: 'Made with devotion in India.',
    },
  },
};

translations.te = {
  ...translations.en,
  languageName: 'తెలుగు',
  nav: { sub: 'వేద కర్మలు మరియు సేవలు', links: ['హోమ్', 'సేవలు', 'మా గురించి', 'పండితులు', 'గ్యాలరీ', 'సమీక్షలు', 'సంప్రదించండి'], book: 'బుక్ చేయండి', mobileBook: 'పూజ బుక్ చేయండి', language: 'భాష', login: 'లాగిన్', loginSignUp: 'లాగిన్ / సైన్ అప్', logout: 'లాగౌట్', myBookings: 'నా బుకింగులు' },
  common: { ...translations.en.common, loginRequired: 'పూజ బుకింగ్ కొనసాగించడానికి దయచేసి లాగిన్ అవ్వండి.' },
  auth: { ...translations.en.auth,
    resetPassword: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    welcomeBack: 'మళ్ళీ స్వాగతం',
    createAccount: 'ఖాతా సృష్టించండి',
    loginSubtitle: 'మీ పూజ బుకింగులను నిర్వహించడానికి లాగిన్ చేయండి',
    signupSubtitle: 'పవిత్ర పూజా సేవలను బుక్ చేయడానికి మా తో చేరండి',
    resetSubtitle: 'రిసెట్ లింక్ అందుకోవడానికి మీ ఇమెయిల్ నమోదు చేయండి',
    emailLabel: 'ఇమెయిల్ చిరునామా',
    passwordLabel: 'పాస్‌వర్డ్',
    fullNameLabel: 'పూర్తి పేరు',
    mobileLabel: 'మొబైల్ నంబర్',
    confirmPasswordLabel: 'పాస్‌వర్డ్ తనిఖీ',
    loginBtn: 'లాగిన్',
    signupBtn: 'అకౌంట్ సృష్టించు',
    sendResetLink: 'రిసెట్ లింక్ పంపండి',
    forgotPassword: 'పాస్వర్డ్ మర్చిపోయారా?',
    backToLogin: 'లాగిన్‌కు తిరిగి వెళ్ళు',
    noAccount: 'ఖాతా లేదు?',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    invalidEmail: 'సరైన ఇమెయిల్ చిరునామా నమోదు చేయండి.',
    passwordMin: 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.',
    passwordMismatch: 'పాస్‌వర్డ్‌లు一致 కావు.',
    emailInUse: 'ఈ ఇమెయిల్ ఇప్పటికే నమోదు అయ్యింది.',
    invalidCredentials: 'సరైన ఇమెయిల్ లేదా పాస్‌వర్డ్ ఇవ్వండి.',
    resetEmailSent: 'పాస్‌వర్డ్ రిసెట్ ఇమెయిల్ పంపబడింది!',
    resetError: 'రిసెట్ ఇమెయిల్ పంపలేకపోయాం. చిరునామాను తనిఖీ చేయండి.',
    resetSentNotice: '{email}కు రీసెట్ లింక్ పంపబడింది. ఇన్‌బాక్స్‌ను తనిఖీ చేయండి.',
    welcomeCreated: '{name}, స్వాగతం! ఖాతా సృష్టించబడింది.',
    logoutNotice: 'మీరు లాగౌట్ అయ్యారు.',
    loginPrompt: 'పూజ బుకింగ్‌ను మీ ఖాతాలో సేవ్ చేయడానికి దయచేసి లాగిన్ లేదా రిజిస్టర్ చేయండి.',
    fullNameRequired: 'పూర్తి పేరును నమోదు చేయండి.',
  },
  hero: { tag: 'పవిత్ర కర్మలు మరియు దైవ సేవలు', sub: 'ఇది వెబ్సైట్ కాదు...', main: 'మీ పూజ సంకల్పానికి ధర్మబద్ధమైన ఆయుధం', accent: '', desc: 'అసలైన పూజలు, హవనాలు, ఆధ్యాత్మిక మార్గదర్శనం కోసం అనుభవజ్ఞులైన వేద పండితులతో కలవండి.', performed: 'చేసిన పూజలు', pandits: 'నిపుణ పండితులు', types: 'పూజ రకాలు', book: 'పూజ బుక్ చేయండి', services: 'సేవలు చూడండి' },
  home: { ...translations.en.home, servicesTag: 'మా సేవల పరిచయం', servicesTitle: 'ప్రసిద్ధ పూజ సేవలు', servicesIntro: 'ఇంటి, కుటుంబ, వివాహ, పండుగ, ప్రత్యేక సందర్భాల కోసం సంప్రదాయ పూజలను ఎంచుకోండి.', viewServices: 'అన్ని సేవలు చూడండి', aboutTag: 'ధర్మ సంకల్పం గురించి', aboutTitle: 'మీ పూజ సంకల్పం – మా యొక్క బాధ్యత', aboutText: 'మా పండితులు సంస్కృత మంత్రోచ్చారణ, వేద విధానాలు, ప్రాంతీయ సంప్రదాయాల్లో శిక్షణ పొందారు.', years: 'అసలైన వేద కర్మలతో కుటుంబాలకు సేవ చేసిన సంవత్సరాలు', points: ['వేద ప్రామాణికత', 'శుద్ధ పూజా సామగ్రి', 'సమయపాలన'], learn: 'మా గురించి తెలుసుకోండి', reviewsTag: 'ఆశీర్వాదాలు మరియు సమీక్షలు', reviewsTitle: 'కుటుంబాలు చెప్పిన మాటలు', readReviews: 'మరిన్ని సమీక్షలు చదవండి', reviews: [['ప్రియా వెంకటరామన్', 'హైదరాబాద్', 'పూజ భక్తి మరియు ఖచ్చితత్వంతో జరిగింది. మా కొత్త ఇల్లు ప్రశాంతంగా అనిపించింది.'], ['రాజేష్ & సునీత మెహతా', 'ముంబై', 'ప్రతి కర్మను అందంగా వివరించారు. మా వివాహం ప్రారంభం నుంచి ముగింపు వరకు పవిత్రంగా అనిపించింది.']] },
  services: { ...translations.en.services, tag: 'మా సేవలు', title: 'పవిత్ర పూజ సేవలు', intro: 'శాస్త్రోక్తంగా సరైన ఉచ్చారణ, సామగ్రి, భక్తితో అనుభవజ్ఞులైన పండితులు చేసే వేద కర్మలు.', popular: 'అత్యంత ప్రసిద్ధం', book: 'బుక్ చేయండి', note: 'మీ పూజ కనిపించలేదా? మేము 20+ రకాల కర్మలు చేస్తాము.', custom: 'కస్టమ్ పూజ కోరండి' },
  about: { ...translations.en.about, quote: '"పూజ అనేది దైవానికి సమర్పించే ప్రేమ భాష."', tradition: 'వేద సంప్రదాయం', years: 'సేవా సంవత్సరాలు', rating: 'గ్రాహక రేటింగ్', tag: 'మా కథ', title: 'మీ పూజ సంకల్పం – మా యొక్క బాధ్యత', subtitle: 'ప్రతి పూజ ధర్మం, శాస్త్ర ఆదేశాలు మరియు వేద సంప్రదాయాల ప్రకారం జరిగేలా చేయడానికి మా సంకల్పం — సంపూర్ణ నిపుణత సంపన్న ప్రజలచే శాస్త్ర దీక్షను పొందిన ప్రజలు.', p1: 'అసలైన వేద కర్మలను ప్రతి ఇంటికి చేరువ చేయాలనే లక్ష్యంతో ధర్మ సంకల్పం స్థాపించబడింది.', p2: 'మా పండితులు సంప్రదాయ గురుకులాల్లో సంస్కృతం, వేద ఉచ్చారణ, కర్మ విధానాల్లో లోతైన శిక్షణ పొందారు.', values: [['వేద ప్రామాణికత', 'అన్ని కర్మలు వేద శాస్త్రాల ప్రకారం సరైన సంస్కృత మంత్రాలతో జరుగుతాయి.'], ['ముందుగా భక్తి', 'ప్రతి పూజ నిజమైన భక్తితో నిర్వహించబడుతుంది.'], ['సమయపాలన', 'శుభ ముహూర్తాన్ని గౌరవిస్తూ సమయానికి సేవ అందిస్తాము.'], ['శుద్ధ సామగ్రి', 'నమ్మకమైన సరఫరాదారుల నుంచి శుద్ధ సాత్విక పూజా సామగ్రి.']], problemHeading: ' ధర్మసంకల్పం గురించిన విశేషం', problemP1: 'వైద్య విద్య తెలియని వ్యక్తి శస్త్రచికిత్స చేసినట్టు, వేదజ్ఞానం తెలియని వ్యక్తి పూజ చేస్తే, అది ధర్మపరంగా హానికరం అవుతుంది.” "ఒకవేళ పూజ శాస్త్రబద్ధంగా జరగదని తెలుసుకొని కూడా మీరు చేయించుకుంటే – ఫలితాలు ఆశించకండి."', problemP2: 'మీరు సంకల్పించిన ప్రతి పూజా కార్యక్రమాన్ని ధర్మ బద్ధంగా శాస్ర్త పద్దతిగా వేద ప్రమాణముగా కేవలం సంవత్సరములు తరబడి వేదాన్ని అధ్యయనం చేసిన బ్రాహ్మణోత్తములచే వేద మంత్రాల ద్వార పూజని నిర్వహించడమే ఈ ధర్మ సంకల్పం.', dharmaValues: [['📜', 'శాస్త్రానికి సమానమైనవి', 'ప్రతి కర్మ సరైన వేద ఆదేశాలను అనుసరిస్తుంది - సౌలభ్యం లేదా వాణిజ్యం కాదు.'], ['🪔', 'అర్హమైన పండితులు మాత్రమే', 'వేదాలను సాధించడానికి సంవత్సరాలు గడిపిన బ్రాహ్మణులు మాత్రమే కర్మలు చేస్తారు.'], ['🙏', 'లావణ్యానికి భక్తి', 'పూజ పవిత్ర చర్య, సేవ కాదు. మేము ప్రతిస్థానంలో దానిని గౌరవిస్తాము.'], ['⚖️', 'విద్వాంసులకు న్యాయమైనది', 'గౌరవం వాసుల వారికి చేరుకుంటుంది - మధ్యవర్తులకు కాదు.']], visionTitle: 'ధర్మసంకల్పం – ఆ పవిత్రమైన ఆచారాలను మళ్లీ మన జీవితాల్లోకి తెచ్చే ప్రయత్నం.', visionIntro: 'ధర్మ సంకల్పం పవిత్ర సంప్రదాయాలను మన జీవితలకు తిరిగి తీసుకురావటానికి ప్రయత్నం. ఇక్కడ, ప్రతి పూజ:', visionPoints: ['శాస్త్రపూర్వకంగా', 'సాంప్రదాయబద్ధంగా', 'భక్తిపూరితంగా', ' నిష్కళ్మషంగా'], visionClosing: 'ఇది కేవలం ఓ సేవ కాదు — ', visionClosingBold: 'ఇది పునఃప్రతిష్ఠయైన సత్యం. ఇది ధర్మపథం.',
    founderName: 'దారూరి విష్ణువర్ధన చార్యులు',
    founderRole: 'ఆగమ శాస్త్ర పండితులు · వ్యవస్థాపకులు',
    founderSalutation: 'జై శ్రీమన్నారాయణ 🙏',
    shlokaDevanagari: 'శ్లోకః',
    shlokaVerse: 'దైవాదీనాం జగత్సర్వం మంత్రాధీనం తు దైవతమ్ ।\nతన్మంత్రం బ్రాహ్మణాధీనం బ్రాహ్మణో మమ దైవతమ్ ॥',
    shlokaMeaningLines: [
      'సమస్త విశ్వం దైవం ఆధీనంలో ఉంది.',
      'దైవం పవిత్ర మంత్రాల ద్వారా నియంత్రించబడుతుంది.',
      'మంత్రాలు బ్రాహ్మణుల పాండిత్యంలో ఉన్నాయి.',
      'అందువల్ల, విద్వాంసుడైన బ్రాహ్మణుడు దైవం యొక్క ప్రత్యక్ష రూపం.',
    ],
    dharmicCommitment: 'ధార్మిక సంకల్పం'
  },
  gallery: { ...translations.en.gallery, tag: 'పవిత్ర క్షణాలు', title: 'పూజ గ్యాలరీ', intro: 'భారతదేశంలోని కుటుంబాల కోసం చేసిన పవిత్ర కర్మల కొన్ని దృశ్యాలు.', items: [['గృహ ప్రవేశం', 'ఇంటి ఆశీర్వాద వేడుక'], ['హవన కుండం', 'పవిత్ర అగ్ని కర్మ'], ['పూలమాల', 'పుష్ప సమర్పణలు'], ['దీపం', 'దీపారాధన'], ['వివాహ కర్మ', 'పవిత్ర వివాహ ప్రమాణాలు'], ['ఆరతి', 'సాయంత్ర ప్రార్థన'], ['వేద మంత్రోచ్చారణ', 'సంస్కృత మంత్రాలు'], ['ప్రసాదం', 'దైవ ఆశీర్వాదం']] },
  pandits: { ...translations.en.pandits, tag: 'మా పండితులు', title: 'మా పండితులను కలవండి', intro: 'మా పండితులు వేద కర్మలు, సంస్కృత పఠనం, ప్రాంతీయ సంప్రదాయాల్లో అనుభవం కలవారు.', specialty: 'ప్రత్యేకత', experience: 'అనుభవం', languages: 'భాషలు', reviews: 'సమీక్షలు', bookWith: 'బుక్ చేయండి' },
  testimonials: { tag: 'కుటుంబాలు చెప్పిన మాటలు', title: 'ఆశీర్వాదాలు మరియు సమీక్షలు' },
  booking: { ...translations.en.booking, tag: 'మీ పవిత్ర పూజను రిజర్వ్ చేయండి', title: 'పూజ బుక్ చేయండి', intro: 'మీ వివరాలు ఇవ్వండి. మీ శుభ సందర్భానికి సరైన పూజను ఏర్పాటు చేస్తాము.', labels: ['పూర్తి పేరు', 'ఫోన్ నంబర్', 'ఇమెయిల్', 'పూజ రకం', 'ఇష్టమైన తేదీ', 'ఇష్టమైన సమయం', 'ఇష్టమైన పండితుడు', 'నగరం / ప్రాంతం', 'పూర్తి చిరునామా (ఐచ్ఛికం)', 'ప్రత్యేక సూచనలు / సందేశం'], placeholders: ['మీ పూర్తి పేరు', '10 అంకెల మొబైల్ నంబర్', 'your@email.com', 'మీ నగరం', 'ఇంటి నం., వీధి, ప్రాంతం...', 'ప్రత్యేక అవసరాలు, కుటుంబ దేవత, ప్రాంతీయ సంప్రదాయం లేదా శుభ సమయం...'], selectPooja: 'పూజను ఎంచుకోండి', selectTime: 'సమయాన్ని ఎంచుకోండి', anyAvailable: 'ఎవరైనా అందుబాటులో ఉన్నవారు', note: 'బుకింగ్ నిర్ధారించడానికి మరియు సామగ్రి గురించి చర్చించడానికి మా పండితుడు 2 గంటల్లో కాల్ చేస్తారు.', submit: 'బుకింగ్ నిర్ధారించండి', submitting: 'సమర్పిస్తోంది', successTitle: 'బుకింగ్ అభ్యర్థన అందింది!', successSub: 'మీ పూజ శుభంగా, ఆశీర్వాదంగా ఉండాలి.', another: 'మరొక పూజ బుక్ చేయండి', errors: ['పేరు అవసరం', 'సరైన 10 అంకెల నంబర్ ఇవ్వండి', 'సరైన ఇమెయిల్ ఇవ్వండి', 'దయచేసి పూజ రకం ఎంచుకోండి', 'దయచేసి తేదీ ఎంచుకోండి', 'దయచేసి సమయం ఎంచుకోండి', 'నగరం అవసరం'] },
  contact: { ...translations.en.contact, tag: 'సంప్రదించండి', title: 'మమ్మల్ని సంప్రదించండి', reach: 'మాతో మాట్లాడండి', intro: 'మీ పూజను శ్రద్ధతో ప్లాన్ చేయడానికి మా బృందం సిద్ధంగా ఉంది.', labels: ['ఫోన్', 'ఇమెయిల్', 'ప్రాంతం', 'అందుబాటు'], values: ['+91 8179960741', 'booking@dharmasankalpam.in', 'Road no. 8, Sri Sai Narayana colony, Nagole, Hyderabad, Telangana 500068', 'ప్రతిరోజూ ఉదయం 6:00 - రాత్రి 9:00 IST'], follow: 'మా ప్రయాణాన్ని అనుసరించండి', faqTitle: 'తరచుగా అడిగే ప్రశ్నలు', faqs: [['ఎంత ముందుగా బుక్ చేయాలి?', 'కనీసం 3-5 రోజులు ముందుగా బుక్ చేయాలని సూచిస్తాము. వివాహం వంటి పెద్ద కర్మలకు 2-3 వారాలు ముందుగా బుక్ చేయండి.'], ['పండితుడు పూజా సామగ్రి తీసుకువస్తారా?', 'అవును. మా పండితులు అవసరమైన సామగ్రిని అదనపు చార్జీతో తీసుకురాగలరు.'], ['ప్రధాన నగరాల బయట సేవలున్నాయా?', 'ప్రస్తుతం ప్రధాన నగరాల్లో సేవలున్నాయి. మీ ప్రాంతం కోసం మమ్మల్ని సంప్రదించండి.'], ['మీ పండితులు ఏ భాషలు మాట్లాడతారు?', 'హిందీ, తెలుగు, తమిళం, కన్నడ, మరాఠీ, గుజరాతీ, సంస్కృతం మాట్లాడగలరు.']] },
  footer: { ...translations.en.footer, desc: 'భక్తితో నిర్వహించే అసలైన వేద కర్మలు మీ ఇంటికి మరియు కుటుంబానికి దైవ ఆశీర్వాదాలు అందిస్తాయి.', service: 'సేవలు', quick: 'త్వరిత లింకులు', cities: 'నగరాలు', copy: 'భారతదేశంలో భక్తితో రూపొందించబడింది.' },
};

translations.hi = {
  ...translations.en,
  languageName: 'हिन्दी',
  nav: { sub: 'वैदिक अनुष्ठान और सेवाएं', links: ['होम', 'सेवाएं', 'हमारे बारे में', 'पंडित', 'गैलरी', 'समीक्षाएं', 'संपर्क'], book: 'बुक करें', mobileBook: 'पूजा बुक करें', language: 'भाषा' },
  hero: { tag: 'पवित्र अनुष्ठान और दिव्य सेवाएं', sub: 'केवल एक वेबसाइट नहीं…', main: 'एक धार्मिक साथी', accent: 'आपकी पवित्र पूजा यात्रा के लिए।', desc: 'प्रामाणिक पूजा, हवन और आध्यात्मिक मार्गदर्शन के लिए अनुभवी वैदिक पंडितों से जुड़ें।', performed: 'पूजाएं संपन्न', pandits: 'विशेषज्ञ पंडित', types: 'अनुष्ठान प्रकार', book: 'पूजा बुक करें', services: 'सेवाएं देखें' },
  home: { ...translations.en.home, servicesTag: 'हमारी सेवाओं की झलक', servicesTitle: 'लोकप्रिय पूजा सेवाएं', servicesIntro: 'घर, परिवार, विवाह, त्योहार और विशेष अवसरों के लिए पारंपरिक अनुष्ठान चुनें।', viewServices: 'सभी सेवाएं देखें', aboutTag: 'धर्म संकल्पम के बारे में', aboutTitle: 'परंपरा से जुड़े, प्रेम से सेवा', aboutText: 'हमारे पंडित संस्कृत मंत्रोच्चार, वैदिक विधि और क्षेत्रीय परंपराओं में प्रशिक्षित हैं।', years: 'प्रामाणिक वैदिक अनुष्ठानों से परिवारों की सेवा के वर्ष', points: ['वैदिक प्रामाणिकता', 'शुद्ध पूजा सामग्री', 'समय पर सेवा'], learn: 'हमारे बारे में जानें', reviewsTag: 'आशीर्वाद और समीक्षाएं', reviewsTitle: 'परिवार क्या कहते हैं', readReviews: 'और समीक्षाएं पढ़ें', reviews: [['प्रिया वेंकटरमन', 'हैदराबाद', 'पूजा भक्ति और सटीकता से हुई। हमारा नया घर शांत और आशीर्वादित लगा।'], ['राजेश और सुनीता मेहता', 'मुंबई', 'हर विधि सुंदर ढंग से समझाई गई और हमारा विवाह शुरू से अंत तक पवित्र लगा।']] },
  services: { ...translations.en.services, tag: 'हमारी सेवाएं', title: 'पवित्र पूजा सेवाएं', intro: 'शास्त्रों के अनुसार सही उच्चारण, सामग्री और भक्ति से अनुभवी पंडितों द्वारा वैदिक अनुष्ठान।', popular: 'सबसे लोकप्रिय', book: 'बुक करें', note: 'आपकी पूजा नहीं दिख रही? हम 20+ प्रकार के अनुष्ठान करते हैं।', custom: 'कस्टम पूजा अनुरोध करें' },
  about: { ...translations.en.about, quote: '"पूजा दिव्य को अर्पित प्रेम की भाषा है."', tradition: 'वैदिक परंपरा', years: 'सेवा के वर्ष', rating: 'ग्राहक रेटिंग', tag: 'हमारी कहानी', title: 'परंपरा से जुड़े, प्रेम से सेवा', subtitle: 'यह सुनिश्चित करने की हमारी प्रतिबद्धता है कि हर पूजा धर्म, शास्त्रीय आदेशों और वैदिक परंपराओं के अनुसार की जाए — उन पुजारियों द्वारा जिन्होंने वास्तव में पवित्र अग्नि के सामने खड़े होने का अधिकार अर्जित किया है।', p1: 'धर्म संकल्पम का उद्देश्य प्रामाणिक वैदिक अनुष्ठानों को हर घर तक पहुंचाना है।', p2: 'हमारे पंडित पारंपरिक गुरुकुलों में संस्कृत, वैदिक उच्चारण और अनुष्ठान विधियों में प्रशिक्षित हैं।', values: [['वैदिक प्रामाणिकता', 'सभी अनुष्ठान वैदिक शास्त्रों के अनुसार सही संस्कृत मंत्रों से किए जाते हैं।'], ['भक्ति पहले', 'हर पूजा सच्ची श्रद्धा से की जाती है।'], ['समय पर और विश्वसनीय', 'हम चुने हुए शुभ मुहूर्त का सम्मान करते हैं।'], ['शुद्ध सामग्री', 'विश्वसनीय स्रोतों से शुद्ध सात्विक पूजा सामग्री।']], problemHeading: 'आप क्या समझें', problemP1: 'आज, कई लोग सही योग्यता के बिना अनुष्ठान करते हैं। परंपरागत पोशाक पहनकर और केवल बुनियादी जानकारी सीखकर, कुछ लोग दोषों का डर पैदा करते हैं, बड़ी रकम लेते हैं, फिर योग्य विद्वानों को केवल ₹2,000-₹3,000 में काम कराते हैं।', problemP2: 'अनुष्ठान की प्रभावशीलता पूरी तरह पंडित की योग्यता और आध्यात्मिक योग्यता पर निर्भर करती है। जब एक विद्वान ब्राह्मण अनुष्ठान करता है, तो निर्धारित आध्यात्मिक लाभ सुनिश्चित हैं - यह राय नहीं है, यह शास्त्रीय प्राधिकार है।', dharmaValues: [['📜', 'शास्त्र के अनुसार', 'हर अनुष्ठान सही वैदिक निर्देशों का पालन करता है - सुविधा या वाणिज्य नहीं।'], ['🪔', 'केवल योग्य पंडित', 'वेदों में वर्षों की महारत रखने वाले ब्राह्मणों द्वारा ही अनुष्ठान किए जाते हैं।'], ['🙏', 'भक्ति लेनदेन से पहले', 'पूजा एक पवित्र कार्य है, सेवा नहीं। हम हर कदम पर इसकी पवित्रता का सम्मान करते हैं।'], ['⚖️', 'विद्वानों के लिए न्याय', 'सम्मान विद्वानों तक पहुंचता है जो इसके योग्य हैं - बिचौलियों को नहीं।']], visionTitle: 'धर्म संकल्पम की दृष्टि', visionIntro: 'धर्म संकल्पम हमारे जीवन में पवित्र परंपराओं को वापस लाने का प्रयास है। यहां, हर अनुष्ठान:', visionPoints: ['शास्त्रों के अनुसार किया जाता है', 'प्रामाणिक परंपरा में निहित है', 'भक्ति से भरा है', 'ईमानदारी और शुद्धता के साथ किया जाता है'], visionClosing: 'यह केवल एक सेवा नहीं है।', visionClosingBold: 'यह सत्य की बहाली है। यह धर्म का मार्ग है।', vedicAuthenticity: 'वैदिक प्रामाणिकता',
    founderName: 'दारुरी विष्णुवर्धन चार्युलु',
    founderRole: 'आगम शास्त्र विद्वान · संस्थापक',
    founderSalutation: 'जय श्रीमन्नारायण 🙏',
    shlokaDevanagari: 'श्लोकः',
    shlokaVerse: 'दैवादीनां जगत्सर्वं मन्त्राधीनं तु दैवतम् ।\nतन्मन्त्रं ब्राह्मणाधीनं ब्राह्मणो मम दैवतम् ॥',
    shlokaMeaningLines: [
      'संपूर्ण ब्रह्मांड ईश्वर के नियंत्रण में है।',
      'ईश्वर पवित्र मंत्रों द्वारा शासित होता है।',
      'मंत्र स्वयं ब्राह्मण के अधिकार में हैं।',
      'इसलिए, विद्वान ब्राह्मण ईश्वर का एक दृश्यमान रूप है।',
    ],
    dharmicCommitment: 'धार्मिक प्रतिबद्धता'
  },
  gallery: { ...translations.en.gallery, tag: 'पवित्र क्षण', title: 'पूजा गैलरी', intro: 'भारत भर के परिवारों के लिए किए गए पवित्र अनुष्ठानों की झलकियां।', items: [['गृह प्रवेश', 'घर का आशीर्वाद समारोह'], ['हवन कुंड', 'पवित्र अग्नि अनुष्ठान'], ['फूल माला', 'पुष्प अर्पण'], ['दीपम', 'दीप प्रज्ज्वलन'], ['विवाह संस्कार', 'पवित्र विवाह वचन'], ['आरती', 'संध्या प्रार्थना'], ['वैदिक मंत्रोच्चार', 'संस्कृत मंत्र'], ['प्रसाद', 'दिव्य आशीर्वाद']] },
  pandits: { ...translations.en.pandits, tag: 'हमारे विद्वान पंडित', title: 'हमारे पंडितों से मिलें', intro: 'हमारे पंडित वैदिक अनुष्ठान, संस्कृत पाठ और क्षेत्रीय परंपराओं में अनुभवी हैं।', specialty: 'विशेषता', experience: 'अनुभव', languages: 'भाषाएं', reviews: 'समीक्षाएं', bookWith: 'बुक करें' },
  testimonials: { tag: 'परिवार क्या कहते हैं', title: 'आशीर्वाद और समीक्षाएं' },
  booking: { ...translations.en.booking, tag: 'अपना पवित्र अनुष्ठान आरक्षित करें', title: 'पूजा बुक करें', intro: 'अपनी जानकारी भरें और हम आपके शुभ अवसर के लिए सही पूजा की व्यवस्था करेंगे।', labels: ['पूरा नाम', 'फोन नंबर', 'ईमेल', 'पूजा प्रकार', 'पसंदीदा तारीख', 'पसंदीदा समय', 'पसंदीदा पंडित', 'शहर / स्थान', 'पूरा पता (वैकल्पिक)', 'विशेष निर्देश / संदेश'], placeholders: ['आपका पूरा नाम', '10 अंकों का मोबाइल नंबर', 'your@email.com', 'आपका शहर', 'घर नंबर, सड़क, क्षेत्र...', 'विशेष आवश्यकताएं, कुल देवता, क्षेत्रीय परंपरा या शुभ समय...'], selectPooja: 'पूजा चुनें', selectTime: 'समय चुनें', anyAvailable: 'कोई भी उपलब्ध', note: 'बुकिंग की पुष्टि और सामग्री पर चर्चा के लिए हमारे पंडित 2 घंटे में कॉल करेंगे।', submit: 'बुकिंग पुष्टि करें', submitting: 'सबमिट हो रहा है', successTitle: 'बुकिंग अनुरोध प्राप्त हुआ!', successSub: 'आपका अनुष्ठान शुभ और आशीर्वादमय हो।', another: 'एक और पूजा बुक करें', errors: ['नाम आवश्यक है', 'सही 10 अंकों का नंबर दर्ज करें', 'सही ईमेल दर्ज करें', 'कृपया पूजा प्रकार चुनें', 'कृपया तारीख चुनें', 'कृपया समय चुनें', 'शहर आवश्यक है'] },
  contact: { ...translations.en.contact, tag: 'संपर्क करें', title: 'हमसे संपर्क करें', reach: 'हमसे बात करें', intro: 'हमारी टीम आपकी पूजा को श्रद्धा और देखभाल से योजना बनाने के लिए तैयार है।', labels: ['फोन', 'ईमेल', 'स्थान', 'उपलब्ध'], values: ['+91 8179960741', 'booking@dharmasankalpam.in', 'Road no. 8, Sri Sai Narayana colony, Nagole, Hyderabad, Telangana 500068', 'प्रतिदिन सुबह 6:00 - रात 9:00 IST'], follow: 'हमारी यात्रा से जुड़ें', faqTitle: 'अक्सर पूछे जाने वाले प्रश्न', faqs: [['कितना पहले बुक करना चाहिए?', 'हम कम से कम 3-5 दिन पहले बुक करने की सलाह देते हैं। विवाह जैसे बड़े अनुष्ठानों के लिए 2-3 सप्ताह पहले बुक करें।'], ['क्या पंडित पूजा सामग्री लाएंगे?', 'हां। हमारे पंडित अतिरिक्त शुल्क पर आवश्यक सामग्री ला सकते हैं।'], ['क्या आप बड़े शहरों के बाहर सेवा देते हैं?', 'हम वर्तमान में प्रमुख महानगरीय क्षेत्रों में सेवा देते हैं। अपने क्षेत्र में उपलब्धता के लिए हमसे संपर्क करें।'], ['आपके पंडित कौन सी भाषाएं बोलते हैं?', 'हिंदी, तेलुगु, तमिल, कन्नड़, मराठी, गुजराती और संस्कृत।']] },
  footer: { ...translations.en.footer, desc: 'विद्वान पंडितों द्वारा भक्ति भाव से किए गए प्रामाणिक वैदिक अनुष्ठान, जो आपके घर और परिवार में दिव्य आशीर्वाद लाते हैं।', service: 'सेवाएं', quick: 'त्वरित लिंक', cities: 'शहर', copy: 'भारत में भक्ति के साथ निर्मित।' },
};

Object.assign(translations.te.booking, {
  securePaymentBanner: 'స్ట్రైప్ ద్వారా సురక్షిత అడ్వాన్స్ చెల్లింపు — UPI, కార్డులు, నెట్ బ్యాంకింగ్ ఆమోదించబడతాయి',
  whatsappButton: 'వాట్సాప్ ద్వారా పంపండి',
  proceedToPayment: 'చెల్లింపుకు కొనసాగండి →',
  loginToBook: 'బుక్ చేయడానికి లాగిన్ చేయండి',
});

Object.assign(translations.hi.booking, {
  securePaymentBanner: 'Stripe के माध्यम से सुरक्षित अग्रिम भुगतान — UPI, कार्ड और नेट बैंकिंग स्वीकार किए जाते हैं',
  whatsappButton: 'व्हाट्सएप से भेजें',
  proceedToPayment: 'भुगतान के लिए आगे बढ़ें →',
  loginToBook: 'बुक करने के लिए लॉग इन करें',
});

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'hi', label: 'हिन्दी' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('site-language') || 'en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const setSiteLanguage = (nextLanguage) => {
      setLanguage(nextLanguage);
      localStorage.setItem('site-language', nextLanguage);
      document.documentElement.lang = nextLanguage;
    };

    return {
      language,
      setLanguage: setSiteLanguage,
      content: translations[language] || translations.en,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

export function getServiceItems(language) {
  return serviceItems[language] || serviceItems.en;
}
