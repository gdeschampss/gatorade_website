/* ==========================================================================
   GATORADE ® — AWWWARDS SITE-EXPERIÊNCIA v3
   GSAP 3 + ScrollTrigger + Lenis Smooth Scroll Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  /* --------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLL INITIALIZATION
     -------------------------------------------------------------------------- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /* --------------------------------------------------------------------------
     2. PRELOADER ENGINE & HERO ENTRANCE
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloader-fill');
  const preloaderCounter = document.getElementById('preloader-counter');

  const imagesToLoad = [
    'imagens/imgGATORADE.png',
    'imagens/imgGATORADE (1).png',
    'imagens/imgGATORADE (3).png',
    'imagens/imgGATORADE (4).png',
    'imagens/imgGATORADE (5).png',
    'imagens/imgGATORADE (7).png',
    'imagens/ChatGPT Image 3 de ago. de 2026, 21_14_01.png',
    'imagens/ChatGPT Image 3 de ago. de 2026, 21_15_03.png',
    'imagens/ChatGPT Image 3 de ago. de 2026, 21_15_51.png'
  ];

  let loadedCount = 0;
  const totalImages = imagesToLoad.length;

  function updateProgress() {
    loadedCount++;
    const progress = Math.round((loadedCount / totalImages) * 100);
    
    if (preloaderFill) preloaderFill.style.width = `${progress}%`;
    if (preloaderCounter) preloaderCounter.textContent = progress < 10 ? `0${progress}` : progress;

    if (loadedCount >= totalImages) {
      setTimeout(finishPreloader, 400);
    }
  }

  imagesToLoad.forEach(src => {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress;
    img.src = src;
  });

  // Fallback in case of slow network
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      finishPreloader();
    }
  }, 3500);

  function finishPreloader() {
    if (preloader) preloader.classList.add('loaded');

    // Hero Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl
      .from('.hero-logo-badge', {
        y: -30,
        opacity: 0,
        delay: 0.2
      })
      .from('.hero-title', {
        y: '100%',
        opacity: 0,
        duration: 1.2
      }, '-=0.8')
      .from('.hero-description', {
        y: 16,
        opacity: 0,
        duration: 0.85
      }, '-=0.8')
      .from('.hero-lineup-img', {
        scale: 0.85,
        opacity: 0,
        duration: 1.4
      }, '-=0.8')
      .from('.floating-spec', {
        y: 20,
        opacity: 0,
        stagger: 0.15
      }, '-=1.0');
  }

  /* --------------------------------------------------------------------------
     3. DYNAMIC FLAVORS DATA & SPOTLIGHT PINNED STACK ENGINE
     -------------------------------------------------------------------------- */
  const flavors = [
    {
      id: 0,
      name: "MORANGO MARACUJÁ",
      bgText: "MORANGO",
      img: "imagens/imgGATORADE (5).png",
      glowColor: "#FF1E43",
      bgColor: "#1A0408",
      codeTag: "#01",
      desc: "Equilíbrio energético vibrante com o dulçor natural do morango e a acidez revigorante do maracujá.",
      purity: "94%",
      vol: "500ml",
      na: "230mg",
      k: "60mg",
      carbo: "30g"
    },
    {
      id: 1,
      name: "UVA INTENSO",
      bgText: "UVA",
      img: "imagens/imgGATORADE (4).png",
      glowColor: "#8A2BE2",
      bgColor: "#150524",
      codeTag: "#02",
      desc: "Sabor encorpado e refrescância acelerada para uma recuperação muscular e hidratação profunda.",
      purity: "98%",
      vol: "500ml",
      na: "240mg",
      k: "70mg",
      carbo: "32g"
    },
    {
      id: 2,
      name: "BERRY BLUE",
      bgText: "BERRY",
      img: "imagens/imgGATORADE.png",
      glowColor: "#0070FF",
      bgColor: "#041126",
      codeTag: "#03",
      desc: "Carga de eletrólitos com perfil sensorial gelado e explosão refrescante de frutas azuis.",
      purity: "96%",
      vol: "500ml",
      na: "225mg",
      k: "65mg",
      carbo: "29g"
    },
    {
      id: 3,
      name: "LARANJA SOLAR",
      bgText: "LARANJA",
      img: "imagens/imgGATORADE (1).png",
      glowColor: "#FF6B00",
      bgColor: "#240B00",
      codeTag: "#04",
      desc: "Impulso citrino de energia solar para repor fluidos perdidos em treinos de alta intensidade.",
      purity: "92%",
      vol: "500ml",
      na: "235mg",
      k: "58mg",
      carbo: "31g"
    }
  ];

  let currentFlavorIndex = 0;
  const root = document.documentElement;

  // UI Elements for Spotlight
  const spotlightBottleImg = document.getElementById('spotlight-bottle-img');
  const flavorBgText = document.getElementById('flavor-bg-text');
  const flavorCodeTag = document.getElementById('flavor-code-tag');
  const flavorTitle = document.getElementById('flavor-title');
  const flavorDesc = document.getElementById('flavor-desc');
  const purityFill = document.getElementById('purity-fill');
  const specVol = document.getElementById('spec-vol');
  const specNa = document.getElementById('spec-na');
  const specK = document.getElementById('spec-k');
  const specCarbo = document.getElementById('spec-carbo');
  const currentSlideNum = document.getElementById('current-slide-num');
  const dotBtns = document.querySelectorAll('.dot-btn');

  function updateFlavorUI(index, animate = true) {
    if (index === currentFlavorIndex && animate) return;
    const flavor = flavors[index];
    currentFlavorIndex = index;

    // Update CSS Custom Properties for Dynamic Ambient Glow & Background Color!
    root.style.setProperty('--glow-current', flavor.glowColor);
    root.style.setProperty('--bg-current-flavor', flavor.bgColor);

    if (animate) {
      // Animate Bottle Transition (Scale + Crossfade)
      gsap.to(spotlightBottleImg, {
        scale: 0.82,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          spotlightBottleImg.src = flavor.img;
          spotlightBottleImg.alt = `Gatorade ${flavor.name}`;
          gsap.to(spotlightBottleImg, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.4)"
          });
        }
      });

      // Animate Text Morphing
      gsap.to([flavorTitle, flavorDesc, flavorBgText], {
        y: -15,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          if (flavorBgText) flavorBgText.textContent = flavor.bgText;
          if (flavorCodeTag) flavorCodeTag.textContent = flavor.codeTag;
          if (flavorTitle) flavorTitle.textContent = flavor.name;
          if (flavorDesc) flavorDesc.textContent = flavor.desc;
          if (specVol) specVol.textContent = flavor.vol;
          if (specNa) specNa.textContent = flavor.na;
          if (specK) specK.textContent = flavor.k;
          if (specCarbo) specCarbo.textContent = flavor.carbo;
          if (purityFill) purityFill.style.width = flavor.purity;
          if (currentSlideNum) currentSlideNum.textContent = `0${index + 1}`;

          gsap.to([flavorTitle, flavorDesc, flavorBgText], {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out"
          });
        }
      });

    } else {
      // Instant initial load
      if (spotlightBottleImg) spotlightBottleImg.src = flavor.img;
      if (flavorBgText) flavorBgText.textContent = flavor.bgText;
      if (flavorCodeTag) flavorCodeTag.textContent = flavor.codeTag;
      if (flavorTitle) flavorTitle.textContent = flavor.name;
      if (flavorDesc) flavorDesc.textContent = flavor.desc;
      if (specVol) specVol.textContent = flavor.vol;
      if (specNa) specNa.textContent = flavor.na;
      if (specK) specK.textContent = flavor.k;
      if (specCarbo) specCarbo.textContent = flavor.carbo;
      if (purityFill) purityFill.style.width = flavor.purity;
      if (currentSlideNum) currentSlideNum.textContent = `0${index + 1}`;
    }

    // Update Indicator Dots
    dotBtns.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // GSAP ScrollTrigger Pinned Spotlight Section
  const spotlightPin = document.getElementById('spotlight-pin');
  if (spotlightPin) {
    ScrollTrigger.create({
      trigger: spotlightPin,
      start: "top top",
      end: "+=2800",
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        let targetIndex = Math.floor(progress * flavors.length);
        if (targetIndex >= flavors.length) targetIndex = flavors.length - 1;
        updateFlavorUI(targetIndex, true);
      }
    });
  }

  // Dot buttons click listener
  dotBtns.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const targetSlide = parseInt(e.currentTarget.getAttribute('data-slide'));
      updateFlavorUI(targetSlide, true);
    });
  });

  /* --------------------------------------------------------------------------
     4. SLIDE FLOATING BENEFIT BALLOONS & HAND-DRAWN ARROWS ON SCROLL
     -------------------------------------------------------------------------- */
  const benefitsPin = document.getElementById('benefits-pin');
  const balloons = document.querySelectorAll('.benefit-balloon');
  const arrows = document.querySelectorAll('.hand-drawn-arrow');

  if (benefitsPin && balloons.length) {
    const benefitsTl = gsap.timeline({
      scrollTrigger: {
        trigger: benefitsPin,
        start: "top top",
        end: "+=2200",
        pin: true,
        scrub: 0.8
      }
    });

    // Initialize arrows stroke dasharray/offset for drawing animation
    arrows.forEach((arrow) => {
      const length = arrow.getTotalLength ? arrow.getTotalLength() : 400;
      gsap.set(arrow, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0
      });
    });

    balloons.forEach((balloon, i) => {
      const startTime = i * 0.8;

      // Animate Card
      benefitsTl.to(balloon, {
        opacity: 1,
        y: 0,
        scale: 1.02,
        duration: 1,
        ease: "power2.out"
      }, startTime);

      // Animate corresponding hand-drawn arrow line drawing effect
      if (arrows[i]) {
        benefitsTl.to(arrows[i], {
          opacity: 1,
          duration: 0.1
        }, startTime);

        benefitsTl.to(arrows[i], {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power1.inOut"
        }, startTime + 0.1);
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. CHATGPT VISUAL SHOWCASE ENGINE ON SCROLL WITH PIN & FRAME SWAP
     -------------------------------------------------------------------------- */
  const turntablePin = document.getElementById('turntable-pin');
  const showcaseFrames = document.querySelectorAll('.showcase-fullscreen-frame');
  let currentActiveFrame = 0;

  if (turntablePin && showcaseFrames.length) {
    ScrollTrigger.create({
      trigger: turntablePin,
      start: "top top",
      end: "+=2600",
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        let frameIndex = Math.floor(progress * showcaseFrames.length);
        if (frameIndex >= showcaseFrames.length) frameIndex = showcaseFrames.length - 1;

        if (frameIndex !== currentActiveFrame) {
          showcaseFrames[currentActiveFrame].classList.remove('active-frame');
          showcaseFrames[frameIndex].classList.add('active-frame');
          currentActiveFrame = frameIndex;
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. HERO PARALLAX & BOTTLE FLOATING PHYSICS
     -------------------------------------------------------------------------- */
  const heroStage = document.querySelector('.hero-lineup-stage');
  const heroImg = document.getElementById('hero-lineup-img');

  if (heroStage && heroImg) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(heroImg, {
        rotateY: x * 0.03,
        rotateX: -y * 0.03,
        x: x * 0.02,
        y: y * 0.02,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    heroStage.addEventListener('mouseleave', () => {
      gsap.to(heroImg, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1,
        ease: "power2.out"
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. ASYMMETRIC SELECTION CARDS — 3D TILT & HOVER GLOW
     -------------------------------------------------------------------------- */
  const asymmetricCards = document.querySelectorAll('.asymmetric-card');
  
  asymmetricCards.forEach((card) => {
    const customGlow = card.getAttribute('data-glow');
    const customBg = card.getAttribute('data-bg');
    card.style.setProperty('--card-glow', customGlow);

    card.addEventListener('mouseenter', () => {
      if (customGlow) root.style.setProperty('--glow-current', customGlow);
      if (customBg) root.style.setProperty('--bg-current-flavor', customBg);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;

      gsap.to(card, {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    card.addEventListener('click', () => {
      const flavorIndex = Array.from(asymmetricCards).indexOf(card);
      lenis.scrollTo('#spotlight-pin');
      setTimeout(() => {
        updateFlavorUI(flavorIndex, true);
      }, 500);
    });
  });

  /* --------------------------------------------------------------------------
     8. ANIMAÇÕES DE ENTRADA E SCROLL COM HIERARQUIA VISUAL
     -------------------------------------------------------------------------- */

  // A. H1 / H2 Display Titles Reveal (Reveal de baixo pra cima com clip-path)
  const animTitles = document.querySelectorAll('.anim-title');
  animTitles.forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 88%",
        toggleActions: "play none none reverse"
      },
      y: "100%",
      opacity: 0,
      duration: 1.1,
      ease: "power4.out"
    });
  });

  // B. Paragraphs / Supportive Text (Entrada suave simples 16px)
  const animDescs = document.querySelectorAll('.anim-desc');
  animDescs.forEach((desc) => {
    gsap.from(desc, {
      scrollTrigger: {
        trigger: desc,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      y: 16,
      opacity: 0,
      duration: 0.85,
      ease: "power2.out"
    });
  });

  // C. Secondary Specs / Badges / Sub-elements (Entrada rápida imperceptível com stagger)
  const animSubs = document.querySelectorAll('.anim-sub');
  animSubs.forEach((sub) => {
    gsap.from(sub, {
      scrollTrigger: {
        trigger: sub,
        start: "top 92%",
        toggleActions: "play none none reverse"
      },
      y: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power1.out"
    });
  });

});
