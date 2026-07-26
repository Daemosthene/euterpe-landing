import React, { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Aurora from './blocks/Backgrounds/Aurora/Aurora';
import { ParallaxHeroImages } from './components/ui/parallax-hero-images';
import './App.css';

const releaseNotesRoute = '#releases';
const checkoutRoute = '#checkout';
const checkoutSuccessRoute = '#checkout/success';
const heroImages = ['/EuterpeHero1.png', '/EuterpeHero2.png', '/EuterpeHero3.png'];
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const heroBenefits = [
  { icon: 'library', label: 'Local library first' },
  { icon: 'bolt', label: 'Fast and responsive' },
  { icon: 'shield', label: 'Private by design' },
  { icon: 'windows', label: 'Built for Windows' }
];

const whyCards = [
  {
    icon: 'library',
    title: 'Local library first',
    description: 'Keep your collection on your machine instead of depending on a browser tab.'
  },
  {
    icon: 'bolt',
    title: 'Fast and responsive',
    description: 'Search, queue, and jump between tracks without waiting on a heavy web app.'
  },
  {
    icon: 'shield',
    title: 'Private by design',
    description: 'Play your own files and keep the listening workflow centered on your device.'
  },
  {
    icon: 'windows',
    title: 'Built for Windows',
    description: 'A desktop-first experience tuned for the way Windows users expect apps to behave.'
  }
];

const workflow = [
  {
    step: '1',
    title: 'Local Library',
    description: 'Import tracks and keep your collection organized on disk.',
    icon: 'library'
  },
  {
    step: '2',
    title: 'Queue and Play',
    description: 'Search, reorder, and resume your queue without breaking the flow.',
    icon: 'queue'
  },
  {
    step: '3',
    title: 'Downloads',
    description: 'Add new audio in the background while playback stays smooth.',
    icon: 'download'
  }
];

const features = [
  {
    title: 'Resume exactly where you stopped',
    description: 'Playlist persistence keeps playback and queue state ready for the next launch.',
    icon: 'playlist'
  },
  {
    title: 'Find tracks quickly',
    description: 'Fast search and queueing keep large libraries manageable without friction.',
    icon: 'search'
  },
  {
    title: 'Background downloads',
    description: 'Download new audio while the player remains responsive and focused.',
    icon: 'download'
  },
  {
    title: 'Tray mini-player',
    description: 'Keep playback available from the tray without losing your place.',
    icon: 'monitor'
  },
  {
    title: 'Metadata aware',
    description: 'Track names and ordering stay easy to scan and simple to manage.',
    icon: 'tag'
  },
  {
    title: 'Built around local files',
    description: 'The app works best when your music lives on your own computer.',
    icon: 'library'
  }
];

const releaseHighlights = [
  'Modernized dark interface with responsive layout behavior',
  'Enhanced playlist workflow with drag-and-drop reordering',
  'Built-in downloader tab for songs, playlists, and mixes',
  'Tray mode mini-player for compact always-on-top control',
  'Improved release-readiness documentation for publishing'
];

const releaseSections = [
  {
    title: 'Playback and Controls',
    items: [
      'Smooth play/pause, previous, next, shuffle, and repeat controls',
      'Seek bar supports click and drag for precise navigation',
      'Keyboard shortcuts cover core playback and search operations'
    ]
  },
  {
    title: 'Playlist Experience',
    items: [
      'One-click playlist loading',
      'Track sorting modes: Default, A-Z, Z-A, Recent',
      'In-app search for faster track discovery',
      'Drag-and-drop track ordering for custom sequence control'
    ]
  },
  {
    title: 'Downloader',
    items: [
      'URL download support for single items and larger lists',
      'Output options for MP3 or original audio',
      'Cookie support from file and pasted Netscape-format text'
    ]
  },
  {
    title: 'Build and Distribution',
    items: [
      'Verified Windows executable build flow via build_exe.py',
      'Added LICENSE, CONTRIBUTING, CHANGELOG, and publication hygiene files'
    ]
  },
  {
    title: 'Packaging Notes',
    items: [
      'Executable output: dist/Euterpe.exe',
      'Core Python dependencies installed through requirements.txt',
      'FFmpeg recommended for normalization and MP3 conversion behavior'
    ]
  },
  {
    title: 'Known Considerations',
    items: [
      'Some sources may require fresh cookies for downloader success',
      'FFmpeg must be installed and available on PATH for certain audio operations'
    ]
  },
  {
    title: 'Upgrade Notes',
    items: [
      'Existing users can keep their local settings and playlists in the .euterpe data directory',
      'Rebuild the executable with python build_exe.py after updating source files'
    ]
  }
];

const installOptions = [
  {
    title: 'Option 1: Download Executable',
    items: [
      { label: 'Open releases', href: 'https://github.com/Daemosthene/euterpe-music-player/releases' },
      { label: 'Download Euterpe.exe from the latest release assets', href: 'https://github.com/Daemosthene/euterpe-music-player/releases' },
      { label: 'Run directly on Windows' }
    ]
  },
  {
    title: 'Option 2: Build from Source',
    items: [
      { label: 'Clone: https://github.com/Daemosthene/euterpe-music-player', href: 'https://github.com/Daemosthene/euterpe-music-player' },
      { label: 'Install dependencies: pip install -r requirements.txt' },
      { label: 'Run from source: python pyside6_main.py' },
      { label: 'Build executable (optional): python build_exe.py' }
    ]
  }
];

function getRouteFromHash() {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const [hashPath] = window.location.hash.split('?');

  if (hashPath === releaseNotesRoute) {
    return 'releases';
  }

  if (hashPath === checkoutRoute || hashPath === checkoutSuccessRoute) {
    return 'checkout';
  }

  return 'home';
}

function App() {
  const totalHeroSlides = heroImages.length;
  const heroRepeatCount = 9;
  const heroMiddleRepeatBlock = Math.floor(heroRepeatCount / 2);
  const loopedHeroImages = Array.from({ length: heroRepeatCount }, () => heroImages).flat();
  const normalizeHeroIndex = (index) => ((index % totalHeroSlides) + totalHeroSlides) % totalHeroSlides;

  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(getRouteFromHash());
  const [activeHeroSlide, setActiveHeroSlide] = useState(heroMiddleRepeatBlock * totalHeroSlides);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const [isHeroLoopResetting, setIsHeroLoopResetting] = useState(false);
  const [heroDragOffsetPx, setHeroDragOffsetPx] = useState(0);
  const heroViewportRef = useRef(null);
  const heroDragStateRef = useRef({
    pointerId: null,
    startX: 0,
    lastX: 0,
    moved: false
  });

  const shiftHeroSlide = (delta) => {
    setActiveHeroSlide((current) => current + delta);
  };

  const goToHeroSlide = (targetIndex) => {
    const normalizedCurrent = normalizeHeroIndex(activeHeroSlide);
    const normalizedTarget = normalizeHeroIndex(targetIndex);
    const forwardDistance = (normalizedTarget - normalizedCurrent + totalHeroSlides) % totalHeroSlides;
    const backwardDistance = forwardDistance - totalHeroSlides;
    const delta = Math.abs(forwardDistance) <= Math.abs(backwardDistance) ? forwardDistance : backwardDistance;

    if (delta !== 0) {
      shiftHeroSlide(delta);
    }
  };

  const handleHeroPointerDown = (event) => {
    const viewport = heroViewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.setPointerCapture(event.pointerId);
    heroDragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false
    };
    setIsHeroDragging(true);
    setHeroDragOffsetPx(0);
  };

  const handleHeroPointerMove = (event) => {
    const dragState = heroDragStateRef.current;
    if (!isHeroDragging || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.moved = true;
    }

    dragState.lastX = event.clientX;
    setHeroDragOffsetPx(deltaX);
  };

  const finishHeroDrag = (event) => {
    const dragState = heroDragStateRef.current;
    if (dragState.pointerId !== event.pointerId) {
      return;
    }

    const viewport = heroViewportRef.current;
    if (!viewport) {
      return;
    }

    const deltaX = dragState.lastX - dragState.startX;
    const threshold = Math.max(60, viewport.clientWidth * 0.12);

    if (Math.abs(deltaX) >= threshold) {
      if (deltaX < 0) {
        shiftHeroSlide(1);
      } else {
        shiftHeroSlide(-1);
      }
    }

    viewport.releasePointerCapture(event.pointerId);
    heroDragStateRef.current = {
      pointerId: null,
      startX: 0,
      lastX: 0,
      moved: false
    };
    setIsHeroDragging(false);
    setHeroDragOffsetPx(0);
  };

  const handleHeroPointerUp = (event) => {
    finishHeroDrag(event);
  };

  const handleHeroPointerCancel = (event) => {
    finishHeroDrag(event);
  };

  const handleHeroKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      shiftHeroSlide(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      shiftHeroSlide(-1);
    }
  };

  const handleHeroTrackTransitionEnd = () => {
    if (isHeroDragging || isHeroLoopResetting) {
      return;
    }

    const leftGuardIndex = totalHeroSlides;
    const rightGuardIndex = loopedHeroImages.length - totalHeroSlides - 1;

    if (activeHeroSlide <= leftGuardIndex || activeHeroSlide >= rightGuardIndex) {
      const resetTarget = heroMiddleRepeatBlock * totalHeroSlides + normalizeHeroIndex(activeHeroSlide);
      if (resetTarget === activeHeroSlide) {
        return;
      }

      setIsHeroLoopResetting(true);
      setActiveHeroSlide(resetTarget);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsHeroLoopResetting(false);
        });
      });
    }
  };

  const heroViewportWidth = heroViewportRef.current?.clientWidth ?? 0;
  const isNarrowHeroViewport = heroViewportWidth > 0 && heroViewportWidth <= 760;
  const heroSlideWidthPct = isNarrowHeroViewport ? 84 : 62;
  const heroSlideGapPct = isNarrowHeroViewport ? 2 : 2.5;
  const heroSlideStepPct = heroSlideWidthPct + heroSlideGapPct;
  const heroSlideOffsetPct = (100 - heroSlideWidthPct) / 2;
  const heroSideAngle = isNarrowHeroViewport ? 18 : 30;
  const normalizedActiveHeroSlide = normalizeHeroIndex(activeHeroSlide);

  const baseHeroTranslatePct = heroSlideOffsetPct - activeHeroSlide * heroSlideStepPct;
  const liveDragTranslatePct = heroViewportWidth
    ? (heroDragOffsetPx / heroViewportWidth) * 100
    : 0;
  const heroCenterFloatIndex = activeHeroSlide - liveDragTranslatePct / heroSlideStepPct;

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
      setMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (route === 'releases') {
      document.title = 'Euterpe | Release Notes';
    } else if (route === 'checkout') {
      document.title = 'Euterpe | Checkout';
    } else {
      document.title = 'Euterpe | Music Player';
    }

    window.scrollTo(0, 0);
  }, [route]);

  if (route === 'releases') {
    return (
      <div className="landing-page releases-page">
        <ReleaseHeader checkoutRoute={checkoutRoute} />
        <main className="release-notes-shell">
          <section className="section release-hero">
            <div className="container release-hero-grid">
              <div className="release-hero-copy">
                <p className="eyebrow">Release notes</p>
                <h1>Euterpe v1.0.0</h1>
                <p>
                  Cleaner playlist control, improved playback UX, and integrated downloading in one desktop app.
                </p>
                <div className="hero-actions release-actions">
                  <a className="btn btn-primary" href={checkoutRoute}>
                    Download for Windows
                  </a>
                  <a className="btn btn-secondary" href="#top">
                    Back to Home
                  </a>
                </div>
              </div>

              <div className="release-hero-panel" aria-label="Release summary">
                <div className="release-summary-card">
                  <span>Version 1.0.0 launch line</span>
                  <strong>Desktop-first release notes</strong>
                  <p>Everything below is pulled from the launch prep notes and release file.</p>
                </div>
                <div className="release-summary-card muted">
                  <span>Target platform</span>
                  <strong>Windows 10+ / 64-bit</strong>
                  <p>$2.99 paywall unlocks the Windows executable.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section release-highlights-section">
            <div className="container">
              <div className="section-title-wrap">
                <h2>Highlights</h2>
              </div>
              <div className="release-highlight-grid">
                {releaseHighlights.map((item) => (
                  <article key={item} className="release-highlight-card">
                    <span />
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section release-sections-section">
            <div className="container release-section-grid">
              {releaseSections.map((section) => (
                <article key={section.title} className="release-section-card">
                  <h2>{section.title}</h2>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="section release-install-section">
            <div className="container">
              <div className="section-title-wrap">
                <h2>Installation and Distribution</h2>
              </div>
              <div className="install-grid">
                {installOptions.map((option) => (
                  <article key={option.title} className="install-card">
                    <h3>{option.title}</h3>
                    <ul>
                      {option.items.map((item) => (
                        <li key={item.label || item}>
                          {item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a> : item.label}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section release-callout-section">
            <div className="container release-callout">
              <div>
                <p className="eyebrow">Quick thanks</p>
                <h2>Thanks to everyone testing and iterating on Euterpe workflows and packaging quality.</h2>
              </div>
              <a className="btn btn-primary" href={checkoutRoute}>
                Download for Windows
              </a>
            </div>
          </section>
        </main>

        <SiteFooter checkoutRoute={checkoutRoute} releaseNotesRoute={releaseNotesRoute} />
      </div>
    );
  }

  if (route === 'checkout') {
    return (
      <div className="landing-page checkout-page">
        <CheckoutHeader checkoutRoute={checkoutRoute} />
        <CheckoutPage checkoutRoute={checkoutRoute} releaseNotesRoute={releaseNotesRoute} />
        <SiteFooter checkoutRoute={checkoutRoute} releaseNotesRoute={releaseNotesRoute} />
      </div>
    );
  }

  return (
    <div className="landing-page">
      <LandingHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        checkoutRoute={checkoutRoute}
        releaseNotesRoute={releaseNotesRoute}
      />

      <main id="top">
        <section className="hero section">
          <div className="aurora-background" aria-hidden="true">
            <Aurora
              colorStops={['#4d4d4d', '#c9c9c9', '#4d4d4d']}
              amplitude={0.45}
              blend={0.55}
              speed={0.7}
            />
          </div>

          <div className="container hero-grid">
            <div className="hero-copy" id="download">
              <p className="eyebrow">Windows desktop music player</p>
              <h1>Your music. On your terms.</h1>
              <p>
                A local-first Windows music player with fast queueing, responsive playback, and dependable downloads.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href={checkoutRoute}>
                  Download for Windows
                </a>
                <a className="btn btn-secondary" href={releaseNotesRoute}>
                  View Release Notes
                </a>
              </div>

              <p className="hero-meta">Windows 10+ • 64-bit • Version 1.0.0 • $2.99 one-time unlock</p>

              <ul className="benefits-row" aria-label="Key benefits">
                {heroBenefits.map((benefit) => (
                  <li key={benefit.label} className="benefit-chip">
                    <Icon name={benefit.icon} />
                    <span>{benefit.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`hero-screenshot hero-carousel${isHeroDragging ? ' is-dragging' : ''}`}
              aria-label="Euterpe interface screenshot carousel"
              role="region"
              tabIndex={0}
              onKeyDown={handleHeroKeyDown}
            >
              <div
                ref={heroViewportRef}
                className="hero-carousel-viewport"
                onPointerDown={handleHeroPointerDown}
                onPointerMove={handleHeroPointerMove}
                onPointerUp={handleHeroPointerUp}
                onPointerCancel={handleHeroPointerCancel}
                onPointerLeave={handleHeroPointerCancel}
              >
                <div
                  className={`hero-carousel-track${isHeroDragging || isHeroLoopResetting ? ' no-transition' : ''}`}
                  style={{
                    '--hero-slide-width': `${heroSlideWidthPct}%`,
                    '--hero-slide-gap': `${heroSlideGapPct}%`,
                    transform: `translateX(${baseHeroTranslatePct + liveDragTranslatePct}%)`
                  }}
                  onTransitionEnd={handleHeroTrackTransitionEnd}
                >
                  {loopedHeroImages.map((imageSrc, index) => {
                    const slideDistance = index - heroCenterFloatIndex;
                    const clampedDistance = Math.max(-1.2, Math.min(1.2, slideDistance));
                    const absoluteDistance = Math.min(Math.abs(slideDistance), 1.2);
                    const rotateY = clampedDistance * heroSideAngle;
                    const scale = 1 - absoluteDistance * 0.12;
                    const opacity = 1 - absoluteDistance * 0.38;
                    const blurPx = absoluteDistance * 1.2;
                    const brightness = 1 - absoluteDistance * 0.16;
                    const depthZ = (1 - absoluteDistance) * 48;
                    const zIndex = 100 - Math.round(absoluteDistance * 20);

                    return (
                      <div
                        className="hero-carousel-slide"
                        key={`${imageSrc}-${index}`}
                        aria-hidden={index !== activeHeroSlide}
                        style={{
                          transform: `translateZ(${depthZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                          opacity,
                          filter: `blur(${blurPx}px) brightness(${brightness})`,
                          zIndex
                        }}
                      >
                        <ParallaxHeroImages
                          images={[imageSrc]}
                          variant="edge-focus"
                          imageClassName="hero-screenshot-image"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hero-carousel-dots" aria-label="Hero image selector">
                {heroImages.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-dot`}
                    type="button"
                    className={`hero-carousel-dot${index === normalizedActiveHeroSlide ? ' active' : ''}`}
                    onClick={() => goToHeroSlide(index)}
                    aria-label={`Show hero image ${index + 1}`}
                    aria-pressed={index === normalizedActiveHeroSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section why-section" id="why-euterpe">
          <div className="container">
            <div className="section-title-wrap">
              <h2>Why Euterpe</h2>
            </div>
            <div className="why-grid">
              {whyCards.map((card) => (
                <article key={card.title} className="why-card">
                  <div className="feature-icon-wrap">
                    <Icon name={card.icon} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
            <div className="release-facts" aria-label="Launch facts">
              <span>Windows 10+</span>
              <span>64-bit build</span>
              <span>Version 1.0.0</span>
              <span>$2.99 unlock</span>
            </div>
          </div>
        </section>

        <section className="section" id="workflow">
          <div className="container">
            <div className="section-title-wrap">
              <h2>Core Workflows</h2>
            </div>
            <div className="workflow-grid">
              {workflow.map((item) => (
                <article key={item.step} className="workflow-card">
                  <div className="workflow-number">{item.step}</div>
                  <div className="workflow-icon-wrap">
                    <Icon name={item.icon} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-title-wrap">
              <h2>Features</h2>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article key={feature.title} className="feature-card">
                  <div className="feature-icon-wrap">
                    <Icon name={feature.icon} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <div className="section-title-wrap">
              <h2>About Euterpe</h2>
            </div>
            <p className="about-text">
              Euterpe is for listeners who want a Windows-native player that keeps the full music workflow local,
              from library management to queue control and background downloads, without the clutter of a browser-first app.
            </p>
          </div>
        </section>

        <section className="final-cta section">
          <div className="container final-cta-inner">
            <div>
              <p className="eyebrow">Ready to listen</p>
              <h2>Unlock Euterpe for Windows and keep your music workflow in one place.</h2>
            </div>
            <div className="final-cta-actions">
              <a className="btn btn-primary" href={checkoutRoute}>
                Download for Windows
              </a>
              <a className="btn btn-secondary" href={releaseNotesRoute}>
                View Release Notes
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter checkoutRoute={checkoutRoute} releaseNotesRoute={releaseNotesRoute} />
    </div>
  );
}

function LandingHeader({ menuOpen, setMenuOpen, checkoutRoute, releaseNotesRoute }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a className="brand" href="#top" aria-label="Euterpe home">
          <img src="/EuterpeLogoBackgroundless.png" alt="Euterpe logo" />
          <span>Euterpe</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#why-euterpe" onClick={() => setMenuOpen(false)}>Why Euterpe</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href={releaseNotesRoute} onClick={() => setMenuOpen(false)}>Releases</a>
        </nav>

        <a className="btn btn-top" href={checkoutRoute}>
          Download for Windows
        </a>
      </div>
    </header>
  );
}

function ReleaseHeader({ checkoutRoute }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner topbar-release">
        <a className="brand" href="#top" aria-label="Euterpe home">
          <img src="/EuterpeLogoBackgroundless.png" alt="Euterpe logo" />
          <span>Euterpe</span>
        </a>

        <div className="release-topbar-actions">
          <a className="btn btn-secondary" href="#top">
            Back to Home
          </a>
          <a className="btn btn-primary" href={checkoutRoute}>
            Download for Windows
          </a>
        </div>
      </div>
    </header>
  );
}

function CheckoutHeader({ checkoutRoute }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner topbar-checkout">
        <a className="brand" href="#top" aria-label="Euterpe home">
          <img src="/EuterpeLogoBackgroundless.png" alt="Euterpe logo" />
          <span>Euterpe</span>
        </a>

        <a className="btn btn-top" href={checkoutRoute}>
          Download EXE
        </a>
      </div>
    </header>
  );
}

function CheckoutPage({ checkoutRoute, releaseNotesRoute }) {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [isEmbeddedMounted, setIsEmbeddedMounted] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [downloadToken, setDownloadToken] = useState('');
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const checkoutMountRef = useRef(null);
  const embeddedCheckoutRef = useRef(null);

  const [hashValue, setHashValue] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash));
  const [hashPath, hashQuery = ''] = hashValue.split('?');
  const isSuccessView = hashPath === checkoutSuccessRoute;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncHashValue = () => {
      setHashValue(window.location.hash);
    };

    window.addEventListener('hashchange', syncHashValue);
    window.addEventListener('popstate', syncHashValue);

    // Fallback for integrations that mutate URL without consistently emitting events.
    const fallbackInterval = setInterval(syncHashValue, 250);

    return () => {
      window.removeEventListener('hashchange', syncHashValue);
      window.removeEventListener('popstate', syncHashValue);
      clearInterval(fallbackInterval);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (embeddedCheckoutRef.current) {
        embeddedCheckoutRef.current.destroy();
        embeddedCheckoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isSuccessView) {
      setIsVerifyingPayment(false);
      setIsPaymentVerified(false);
      setVerificationMessage('');
      setDownloadToken('');
      return;
    }

    const params = new URLSearchParams(hashQuery);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setIsPaymentVerified(false);
      setVerificationMessage('Missing checkout session. Return to checkout and try again.');
      setDownloadToken('');
      return;
    }

    let cancelled = false;
    const verify = async () => {
      try {
        setIsVerifyingPayment(true);
        setVerificationMessage('');
        const response = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        const result = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok || !result.verified) {
          setIsPaymentVerified(false);
          setVerificationMessage(result.message || 'Payment is not verified yet. If you just paid, retry verification in a moment.');
          setDownloadToken('');
          return;
        }

        const token = typeof result.downloadToken === 'string' ? result.downloadToken : '';
        if (!token) {
          setIsPaymentVerified(false);
          setVerificationMessage('Payment was found, but a secure download token could not be generated. Retry verification.');
          setDownloadToken('');
          return;
        }

        setIsPaymentVerified(true);
        setDownloadToken(token);
      } catch (error) {
        if (!cancelled) {
          setIsPaymentVerified(false);
          setVerificationMessage('Could not verify payment right now. Retry verification in a moment.');
          setDownloadToken('');
        }
      } finally {
        if (!cancelled) {
          setIsVerifyingPayment(false);
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [hashQuery, isSuccessView, verificationAttempt]);

  const handleRetryVerification = () => {
    if (isVerifyingPayment) {
      return;
    }
    setVerificationAttempt((previous) => previous + 1);
  };

  const handleStartCheckout = async () => {
    setCheckoutError('');

    if (!email.trim()) {
      setCheckoutError('Enter an email address to continue.');
      return;
    }

    if (!stripePromise) {
      setCheckoutError('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY and redeploy.');
      return;
    }

    try {
      setIsStartingCheckout(true);
      if (embeddedCheckoutRef.current) {
        embeddedCheckoutRef.current.destroy();
        embeddedCheckoutRef.current = null;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          country
        })
      });

      const result = await response.json();
      if (!response.ok || !result.clientSecret) {
        throw new Error(result.error || 'Could not start checkout session.');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize.');
      }

      const embeddedCheckout = await stripe.createEmbeddedCheckoutPage({
        clientSecret: result.clientSecret
      });

      embeddedCheckoutRef.current = embeddedCheckout;
      if (checkoutMountRef.current) {
        embeddedCheckout.mount(checkoutMountRef.current);
      }

      setIsEmbeddedMounted(true);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Could not start checkout.');
      setIsEmbeddedMounted(false);
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <main className="checkout-main" id="top">
      <section className="section checkout-section">
        <div className="container checkout-shell">
          <a className="checkout-back" href="#">Back to product</a>

          <div className="checkout-intro">
            <h1>{isSuccessView ? 'Payment complete' : 'Complete your download'}</h1>
            <p>
              {isSuccessView
                ? 'Verify your payment and download Euterpe for Windows.'
                : 'Secure Stripe checkout for Euterpe on Windows.'}
            </p>
          </div>

          <div className="checkout-grid">
            <article className="checkout-card order-card" aria-label="Order summary">
              <h2>Your order</h2>

              <div className="order-product-row">
                <img src="/EuterpeLogoBackgroundless.png" alt="Euterpe app icon" />
                <div>
                  <strong>Euterpe Desktop App</strong>
                  <p>One-time purchase</p>
                </div>
                <span className="order-badge">ONE-TIME</span>
              </div>

              <ul className="order-list">
                <li>Windows EXE download</li>
                <li>Private local-first playback workflow</li>
                <li>Lifetime updates on this version line</li>
                <li>Single Windows device license</li>
              </ul>

              <div className="order-total-row">
                <span>Total (USD)</span>
                <strong>$2.99</strong>
              </div>

              <p className="checkout-meta">No subscription. Pay once and own forever.</p>
            </article>

            <article className="checkout-card payment-card" aria-label="Payment details">
              <div className="payment-card-head">
                <h2>{isSuccessView ? 'Download access' : 'Checkout'}</h2>
                <span>{isSuccessView ? 'Verified by server' : 'Stripe embedded checkout'}</span>
              </div>

              {isSuccessView ? (
                <div className="checkout-form" role="status">
                  {isVerifyingPayment ? (
                    <p className="checkout-disclaimer">Verifying payment status...</p>
                  ) : null}

                  {verificationMessage ? (
                    <p className="checkout-placeholder-note">{verificationMessage}</p>
                  ) : null}

                  {isPaymentVerified ? (
                    <>
                      <p className="checkout-disclaimer">
                        Payment verified. Your download button is now unlocked.
                      </p>
                      <a
                        className="btn btn-primary checkout-submit"
                        href={`/api/download?token=${encodeURIComponent(downloadToken)}`}
                      >
                        Download Euterpe.exe
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary checkout-submit"
                        onClick={handleRetryVerification}
                        disabled={isVerifyingPayment}
                      >
                        {isVerifyingPayment ? 'Verifying payment...' : 'Retry verification'}
                      </button>
                      <a className="btn btn-secondary checkout-submit" href={checkoutRoute}>
                        Return to checkout
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <form className="checkout-form" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    Email
                    <input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>

                  <label>
                    Country / region
                    <select
                      value={country}
                      aria-label="Country or region"
                      onChange={(event) => setCountry(event.target.value)}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="btn btn-primary checkout-submit"
                    onClick={handleStartCheckout}
                    disabled={isStartingCheckout}
                  >
                    {isStartingCheckout ? 'Starting secure checkout...' : 'Continue to secure checkout'}
                  </button>

                  {checkoutError ? (
                    <p className="checkout-placeholder-note" role="alert">
                      {checkoutError}
                    </p>
                  ) : null}

                  <p className="checkout-disclaimer">
                    Secure checkout is handled by Stripe. Card and wallet options appear in the embedded form.
                  </p>

                  <div
                    className={`embedded-checkout-shell${isEmbeddedMounted ? ' is-ready' : ''}`}
                    ref={checkoutMountRef}
                    aria-live="polite"
                  />
                </form>
              )}
            </article>
          </div>

          <div className="checkout-trust-row" aria-label="Checkout trust indicators">
            <article className="trust-item">
              <h3>Secure checkout</h3>
              <p>Payments are handled by Stripe with server-side session verification.</p>
            </article>
            <article className="trust-item">
              <h3>Instant access</h3>
              <p>After payment is verified, download access is unlocked immediately.</p>
            </article>
            <article className="trust-item">
              <h3>Windows ready</h3>
              <p>Built for Windows 10 and newer, optimized for desktop playback.</p>
            </article>
          </div>

          <div className="checkout-alt-links">
            <a href="#top">Return to home</a>
            <a href={releaseNotesRoute}>View release notes</a>
            <a href={checkoutRoute}>Stay on checkout</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SiteFooter({ checkoutRoute, releaseNotesRoute }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="Euterpe home">
            <img src="/EuterpeLogoBackgroundless.png" alt="Euterpe logo" />
            <span>Euterpe</span>
          </a>
          <p>Focused listening. Local libraries. Zero clutter.</p>
        </div>

        <div className="footer-column">
          <h3>Product</h3>
          <a href="#features">Features</a>
          <a href="#why-euterpe">Why Euterpe</a>
          <a href="#about">About</a>
          <a href={releaseNotesRoute}>Releases</a>
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          <a href={releaseNotesRoute}>Release Notes</a>
          <a href={releaseNotesRoute}>Version Details</a>
          <a href="#about">Documentation</a>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <a href="mailto:support@euterpe.app">Contact Support</a>
          <a href="mailto:support@euterpe.app?subject=Euterpe%20Issue">Report an Issue</a>
          <a href="#about">Privacy</a>
        </div>

        <div className="footer-column footer-download">
          <h3>Download</h3>
          <a className="btn btn-primary" href={checkoutRoute}>
            Download for Windows
          </a>
          <a href={releaseNotesRoute}>View Release Notes</a>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container footer-legal-inner">
          <span>© 2026 Euterpe Project</span>
          <span>Built for focused listening</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'library':
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M5 6v13h14V6" />
          <path d="M9 10h6" />
          <path d="M9 14h4" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
        </svg>
      );
    case 'windows':
      return (
        <svg {...common}>
          <path d="M3 4l8-1v8H3V4z" />
          <path d="M13 3l8-1v9h-8V3z" />
          <path d="M3 13h8v8l-8-1v-7z" />
          <path d="M13 13h8v9l-8-1v-8z" />
        </svg>
      );
    case 'queue':
      return (
        <svg {...common}>
          <path d="M4 7h10" />
          <path d="M4 12h10" />
          <path d="M4 17h10" />
          <path d="M17 10l3 2-3 2z" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M12 3v11" />
          <path d="M8 10l4 4 4-4" />
          <path d="M4 20h16" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case 'playlist':
      return (
        <svg {...common}>
          <path d="M4 6h10" />
          <path d="M4 12h10" />
          <path d="M4 18h6" />
          <path d="M16 8v8" />
          <path d="M13 13l3 3 3-3" />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...common}>
          <path d="M20 12l-8 8-8-8V4h8l8 8z" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
    default:
      return null;
  }
}

export default App;