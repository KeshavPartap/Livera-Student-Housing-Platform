/* ========================================
   LivEra — Property Detail JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR: Glassmorphism on Scroll =====
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)'; // Keep opaque on detail page
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // ===== FULLSCREEN IMAGE GALLERY LOGIC =====
    const galleryItems = [
        'images/property-exterior.png',
        'images/property-livingroom.png',
        'images/property-kitchen.png',
        'images/property-bedroom.png',
        'images/property-bathroom.png'
    ];

    const fsOverlay = document.getElementById('fsGalleryOverlay');
    const fsImage = document.getElementById('fsGalleryImage');
    const fsClose = document.getElementById('fsGalleryClose');
    const fsPrev = document.getElementById('fsPrev');
    const fsNext = document.getElementById('fsNext');
    const fsCurrentIndexEl = document.getElementById('fsCurrentIndex');
    
    let currentImageIndex = 0;

    // Open gallery from specific main grid images
    const openGallery = (index) => {
        currentImageIndex = index;
        updateGalleryImage();
        fsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeGallery = () => {
        fsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateGalleryImage();
    };

    const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateGalleryImage();
    };

    const updateGalleryImage = () => {
        // Simple fade out/in effect
        fsImage.style.opacity = '0';
        setTimeout(() => {
            fsImage.src = galleryItems[currentImageIndex];
            fsCurrentIndexEl.textContent = currentImageIndex + 1;
            fsImage.style.opacity = '1';
        }, 200);
    };

    // Attach click events to grid items
    const mainBtn = document.getElementById('galleryBtnMain');
    const btn1 = document.getElementById('galleryBtn1');
    const btn2 = document.getElementById('galleryBtn2');
    const btn3 = document.getElementById('galleryBtn3');
    const btn4 = document.getElementById('galleryBtn4');

    if(mainBtn) mainBtn.addEventListener('click', () => openGallery(0));
    if(btn1) btn1.addEventListener('click', () => openGallery(1));
    if(btn2) btn2.addEventListener('click', () => openGallery(2));
    if(btn3) btn3.addEventListener('click', () => openGallery(3));
    if(btn4) btn4.addEventListener('click', () => openGallery(4)); // View All button triggers this too

    // Fullscreen Navigation
    if(fsClose) fsClose.addEventListener('click', closeGallery);
    if(fsNext) fsNext.addEventListener('click', nextImage);
    if(fsPrev) fsPrev.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!fsOverlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeGallery();
        else if (e.key === 'ArrowRight') nextImage();
        else if (e.key === 'ArrowLeft') prevImage();
    });

    // Close on overlay backdrop click
    fsOverlay.addEventListener('click', (e) => {
        if (e.target === fsOverlay) {
            closeGallery();
        }
    });

});
