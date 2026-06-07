/* ========================================
   LivEra — Cinematic Landing Page Scripts
   GSAP + ScrollTrigger Animations + Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ===== CONSTANTS & EASING =====
    const CUSTOM_EASE = "power3.out";
    const CINEMATIC_EASE = "power3.inOut";
    const SPRING_EASE = "elastic.out(1, 0.75)";
    const isMobile = window.innerWidth < 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Ensure ScrollTrigger gets accurate measurements after images/fonts load
    window.addEventListener('load', () => {
        setTimeout(() => ScrollTrigger.refresh(), 500);
    });

    // ===== NAVBAR: Glassmorphism on Scroll =====
    const navbar = document.getElementById('navbar');
    const navLinksEl = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ===== HAMBURGER MENU =====
    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksEl.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksEl.classList.remove('active');
            });
        });
    }

    // ===== ACTIVE NAV LINK on Scroll =====
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ===== TEXT SPLITTING FOR HERO TITLE =====
    const words = document.querySelectorAll('#heroTitle .word');
    words.forEach(word => {
        const text = word.textContent;
        word.textContent = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            word.appendChild(span);
        });
    });

    // ===== CINEMATIC HERO ANIMATIONS (Overlapping Timeline — Time-Based) =====
    const customEase = "cubic-bezier(0.22, 1, 0.36, 1)";
    const heroTL = gsap.timeline({ delay: 0.2 });

    // Initial setups for mask and decorations
    gsap.set('.hero-line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.hero-dot', { scale: 0, opacity: 0 });

    heroTL
        // 1. Image Mask Reveal (expands from center)
        .to('#heroImageMask', {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.8,
            ease: "power3.inOut"
        }, 0)

        // 2. Hero Badge fades & slides early
        .to('#heroBadge', {
            opacity: 1, y: 0, duration: 1.2,
            ease: customEase,
            startAt: { y: 30 }
        }, 0.8)

        // 3. Staggered Character Reveal for Title (overlaps with badge)
        .to('.char', {
            y: "0%",
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: 0.03,
            ease: customEase
        }, "-=0.8")

        // 4. Subtitle fade up
        .to('#heroSubtitle', {
            opacity: 1, y: 0, duration: 1.2,
            ease: customEase,
            startAt: { y: 20 }
        }, "-=1")

        // 5. Buttons spring up
        .to('#heroButtons', {
            opacity: 1, y: 0, duration: 1.2,
            ease: SPRING_EASE,
            startAt: { y: 30 }
        }, "-=1.1")

        // 6. Reveal decorative lines and scroll indicator
        .to('.hero-line-1', { scaleX: 1, opacity: 1, duration: 1.5, ease: CUSTOM_EASE }, "-=1")
        .to('.hero-line-2', { scaleX: 1, opacity: 1, duration: 1.5, ease: CUSTOM_EASE }, "-=1.3")
        .to('#scrollIndicator', {
            opacity: 1, duration: 1.2,
            ease: "power2.out"
        }, "-=0.5");

    // ===== SCROLL PARALLAX (Depth illusion) =====
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
        gsap.to('#heroBgParallax', {
            yPercent: 12,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            }
        });

        gsap.to('#heroContentParallax', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            }
        });
    });

    // ===== REAL-TIME MOUSE PARALLAX & LIGHTING (ENHANCED with quickTo/lerp) =====
    const heroSection = document.getElementById('hero');
    const heroBg = document.getElementById('heroBgParallax');
    const heroContent = document.getElementById('heroContentParallax');
    const heroDecorations = document.getElementById('heroDecorations');
    const cursorLight = document.getElementById('cursorLight');

    if (heroSection && prefersHover && !isMobile) {
        // Show light layer after initial load
        setTimeout(() => { if (cursorLight) cursorLight.style.opacity = '1'; }, 2000);

        // GSAP quickTo for smooth lerp-based mouse tracking
        const bgMoveX = gsap.quickTo(heroBg, 'x', { duration: 1.2, ease: 'power2.out' });
        const bgMoveY = gsap.quickTo(heroBg, 'y', { duration: 1.2, ease: 'power2.out' });
        const contentMoveX = gsap.quickTo(heroContent, 'x', { duration: 1, ease: 'power2.out' });
        const contentMoveY = gsap.quickTo(heroContent, 'y', { duration: 1, ease: 'power2.out' });
        const decoMoveX = gsap.quickTo(heroDecorations, 'x', { duration: 1.5, ease: 'power2.out' });
        const decoMoveY = gsap.quickTo(heroDecorations, 'y', { duration: 1.5, ease: 'power2.out' });

        heroSection.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const xPos = (x / window.innerWidth) - 0.5;
            const yPos = (y / window.innerHeight) - 0.5;

            // Move the radial gradient center point smoothly
            if (cursorLight) {
                cursorLight.style.setProperty('--mouse-x', `${x}px`);
                cursorLight.style.setProperty('--mouse-y', `${y}px`);
            }

            // Multi-layer parallax with different intensities
            bgMoveX(xPos * -20);
            bgMoveY(yPos * -15);
            contentMoveX(xPos * 12);
            contentMoveY(yPos * 10);
            decoMoveX(xPos * 40);
            decoMoveY(yPos * 35);
        });

        heroSection.addEventListener('mouseleave', () => {
            bgMoveX(0); bgMoveY(0);
            contentMoveX(0); contentMoveY(0);
            decoMoveX(0); decoMoveY(0);
        });
    }

    // ===== GLOBAL MOUSE PARALLAX (applied to sections beyond hero) =====
    if (prefersHover && !isMobile) {
        let globalMouseX = 0, globalMouseY = 0;

        document.addEventListener('mousemove', (e) => {
            globalMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            globalMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        // Apply to background shapes in property preview
        const ppShapes = document.querySelectorAll('.pp-shape');
        if (ppShapes.length) {
            gsap.ticker.add(() => {
                ppShapes.forEach((shape, i) => {
                    const intensity = (i + 1) * 5;
                    gsap.set(shape, {
                        x: globalMouseX * intensity,
                        y: globalMouseY * intensity,
                    });
                });
            });
        }

        // Apply to amenities blobs
        const blobs = document.querySelectorAll('.amenities-blob');
        if (blobs.length) {
            gsap.ticker.add(() => {
                blobs.forEach((blob, i) => {
                    const intensity = (i + 1) * 8;
                    gsap.set(blob, {
                        x: globalMouseX * intensity,
                        y: globalMouseY * intensity,
                    });
                });
            });
        }
    }

    // ===== SCROLL REVEAL OBSERVER (Refined) =====
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
                let siblingIndex = 0;
                siblings.forEach((s, i) => { if (s === entry.target) siblingIndex = i; });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, siblingIndex * 150);

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => {
        el.classList.remove('revealed');
        revealObserver.observe(el);
    });

    // ===== SECTION ANIMATIONS (GSAP ScrollTrigger — Trigger-Based) =====

    // Problem cards
    gsap.from('.problem-card', {
        y: 60,
        scale: 0.95,
        rotation: 2,
        duration: 0.8,
        stagger: 0.15,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#problem',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // Solution cards
    gsap.from('.solution-card', {
        y: 60,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#solution',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // How it works
    gsap.from('.hiw-step', {
        y: 50,
        opacity: 0,
        scale: 0.92,
        duration: 0.8,
        stagger: 0.15,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#how-it-works',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // Testimonials
    gsap.from('.testimonial-card', {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // ===== TRUST SECTION: Animated Counters =====
    const trustNumbers = document.querySelectorAll('.trust-number[data-count]');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        trustNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic with slight bounce
                let eased;
                if (progress < 0.8) {
                    eased = 1 - Math.pow(1 - (progress / 0.8), 3);
                    eased *= 0.95;
                } else {
                    const bounceProgress = (progress - 0.8) / 0.2;
                    eased = 0.95 + (0.05 * bounceProgress);
                }
                eased = Math.min(eased, 1);
                const current = Math.round(target * eased);
                num.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    num.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const trustSection = document.getElementById('trust');
    if (trustSection) {
        const trustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    trustObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        trustObserver.observe(trustSection);
    }

    // Trust badges animation
    gsap.from('.trust-badge-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '.trust-badges',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // ===== AMENITIES SECTION ANIMATIONS =====
    gsap.from('#amenitiesHeader', {
        y: 40,
        duration: 0.8,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#student-living',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.amenity-card', {
        y: 50,
        duration: 0.7,
        stagger: 0.1,
        ease: CUSTOM_EASE,
        clearProps: 'all',
        scrollTrigger: {
            trigger: '#amenitiesGrid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // ===== FLOATING PARTICLES (GSAP-driven) =====
    const particlesContainer = document.getElementById('amenitiesParticles');
    if (particlesContainer) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(201, 168, 76, ${Math.random() * 0.12 + 0.04});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                will-change: transform;
            `;
            particlesContainer.appendChild(particle);

            // GSAP-driven floating animation
            gsap.to(particle, {
                x: `random(-30, 30)`,
                y: `random(-30, 30)`,
                scale: `random(0.8, 1.3)`,
                opacity: `random(0.2, 0.5)`,
                duration: `random(6, 14)`,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: `random(0, 5)`,
            });
        }
    }

    // ===== PROPERTY PREVIEW MODULE =====
    const floatingArea = document.getElementById('ppFloatingArea');

    if (floatingArea) {
        gsap.from('#ppHeader', {
            y: 40,
            duration: 0.8,
            ease: CUSTOM_EASE,
            scrollTrigger: {
                trigger: '#property-preview',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('#ppFilters', {
            y: 20,
            duration: 0.6,
            ease: CUSTOM_EASE,
            scrollTrigger: {
                trigger: '#property-preview',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.pp-property-card', {
            y: 60,
            rotation: 3,
            duration: 0.8,
            stagger: 0.1,
            ease: CUSTOM_EASE,
            clearProps: 'all',
            scrollTrigger: {
                trigger: '#ppFloatingArea',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Vanilla Tilt on desktop
        if (prefersHover && typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.pp-property-card, .amenity-card'), {
                max: 8,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
                scale: 1.02,
            });
        }
    }

    // ===== PROPERTY FILTERING WITH GSAP FLIP =====
    if (typeof Flip !== 'undefined') {
        gsap.registerPlugin(Flip);
    }

    const ppFilters = document.querySelectorAll('.glass-filter-bar select');
    const ppCardsContainer = document.querySelector('.pp-floating-area');
    let ppCards = Array.from(document.querySelectorAll('.pp-property-card'));

    function filterProperties() {
        const typeValue = document.getElementById('filter-type')?.value || 'all';
        const priceValue = document.getElementById('filter-price')?.value || 'all';
        const bedsValue = document.getElementById('filter-beds')?.value || 'all';
        const locationValue = document.getElementById('filter-location')?.value || 'all';

        let state;
        if (typeof Flip !== 'undefined') {
            state = Flip.getState(ppCards);
        }

        let visibleCount = 0;

        ppCards.forEach(card => {
            const type = card.getAttribute('data-type');
            const price = parseInt(card.getAttribute('data-price')) || 0;
            const beds = card.getAttribute('data-beds');
            const location = card.getAttribute('data-location');

            let matchType = (typeValue === 'all' || type === typeValue);
            let matchPrice = true;
            if (priceValue !== 'all') {
                if (priceValue === '5-10') matchPrice = (price >= 5000 && price <= 10000);
                else if (priceValue === '10-15') matchPrice = (price > 10000 && price <= 15000);
                else if (priceValue === '15-20') matchPrice = (price > 15000 && price <= 20000);
                else if (priceValue === '20+') matchPrice = (price > 20000);
            }
            let matchBeds = true;
            if (bedsValue !== 'all') {
                if (bedsValue === '4+') matchBeds = (parseInt(beds) >= 4);
                else matchBeds = (beds === bedsValue);
            }
            let matchLocation = (locationValue === 'all' || location === locationValue);
            const isMatch = matchType && matchPrice && matchBeds && matchLocation;

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const noResults = document.getElementById('ppNoResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (typeof Flip !== 'undefined' && state) {
            Flip.from(state, {
                duration: 0.5,
                ease: CUSTOM_EASE,
                scale: true,
                absolute: true,
                onEnter: elements => gsap.fromTo(elements,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 }
                ),
                onLeave: elements => gsap.to(elements,
                    { opacity: 0, scale: 0.8, duration: 0.3 }
                ),
                onComplete: () => ScrollTrigger.refresh()
            });
        }
    }

    window.resetPropertyFilters = function() {
        document.querySelectorAll('.glass-filter-bar select').forEach(s => s.value = 'all');
        filterProperties();
    };

    ppFilters.forEach(select => {
        select.addEventListener('change', filterProperties);
    });

    // ===== CTA ANIMATION =====
    gsap.from('#ctaTitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#cta',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.cta-subtitle, .cta-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#cta',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    // ===== CONTACT FORM ANIMATIONS =====
    gsap.from('.contact-info > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.contact-form-wrap', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    // ===== CONTACT FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !subject || !message) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('contactEmail').style.borderColor = '#ef4444';
                return;
            }

            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push({ name, email, subject, message, time: new Date().toISOString() });
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            contactForm.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';

            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                document.getElementById('formSuccess').style.display = 'none';
            }, 5000);
        });

        document.getElementById('contactEmail')?.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    }

    // ===== FOOTER FADE-IN =====
    gsap.from('.footer-grid > *', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: CUSTOM_EASE,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // ===== MICRO-INTERACTIONS =====
    // Button hover → scale + glow
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.04,
                duration: 0.35,
                ease: 'power2.out',
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
            });
        });
    });

    // ===== DEPTH LAYERING: Global scroll-based parallax =====
    if (!isMobile) {
        gsap.to('.cta-bg', {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: '#cta',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            }
        });

        gsap.to('.pp-shape-1', {
            y: -60, ease: 'none',
            scrollTrigger: { trigger: '#property-preview', start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.pp-shape-2', {
            y: 40, ease: 'none',
            scrollTrigger: { trigger: '#property-preview', start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.pp-shape-3', {
            y: -30, x: 20, ease: 'none',
            scrollTrigger: { trigger: '#property-preview', start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
    }

    // ===== SMOOTH SCROLL for anchor links (GSAP-powered) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 80, autoKill: false },
                    duration: 1.2,
                    ease: 'power3.inOut',
                });
            }
        });
    });

    // ===== HERO SLIDESHOW LOGIC =====
    const slides = document.querySelectorAll('#heroSlideshow .hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    const slideDuration = 5000;
    let slideTimer;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    if (slides.length > 0) {
        slideTimer = setInterval(nextSlide, slideDuration);

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(slideTimer);
                goToSlide(parseInt(dot.dataset.slide));
                slideTimer = setInterval(nextSlide, slideDuration);
            });
        });
    }

    // ===== STAT BARS & METRIC RINGS OBSERVER (Trigger on Scroll) =====
    const observeStats = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate bars
                const fills = entry.target.querySelectorAll('.problem-stat-fill, .timeline-fill, .rating-bar-fill');
                fills.forEach(fill => {
                    const width = fill.dataset.width || fill.dataset.hours || 0;
                    if(fill.classList.contains('timeline-fill')) {
                         fill.style.width = '100%'; // Full width for timeline
                    } else {
                         fill.style.width = `${width}%`;
                    }
                });

                // Animate SVG Rings
                const rings = entry.target.querySelectorAll('.metric-fill');
                rings.forEach(ring => {
                    const percent = ring.parentElement.parentElement.dataset.percent || 100;
                    ring.style.strokeDasharray = `${percent}, 100`;
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe sections containing these animated stats
    const sectionsToObserve = document.querySelectorAll('#problem, #solution, #testimonials, #trust');
    sectionsToObserve.forEach(section => observeStats.observe(section));
});
