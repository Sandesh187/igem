/**
 * ═══════════════════════════════════════════════════════════════
 * IIT Bombay iGEM 2026 - PET-DESTROYER OCEANIC INTERACTION SUITE
 * Marine Bacteria Theme - Advanced Interactive Features
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// GLOBAL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    particles: {
        count: 50,
        speed: 0.3,
        glowIntensity: 0.6
    },
    animations: {
        counterSpeed: 150,
        scrollRevealDelay: 100,
        particleRefreshRate: 60
    },
    effects: {
        cursorTrail: true,
        oceanWaves: true,
        bioluminescence: true
    }
};

// ═══════════════════════════════════════════════════════════════
// MAIN INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle the navigation visibility
            navLinks.classList.toggle('nav-active');
            
            // Animate the hamburger icon (optional)
            menuToggle.classList.toggle('toggle-transform');
        });
    }
});
// ═══════════════════════════════════════════════════════════════
// 1. ADVANCED NAVIGATION SYSTEM
// ═══════════════════════════════════════════════════════════════

function initNavigationSystem() {
    const navbar = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
    
    // Enhanced Sticky Navbar with Hide/Show on Scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// 2. SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════

function initScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress');
    
    // Create if doesn't exist
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ═══════════════════════════════════════════════════════════════
// 3. BIOLUMINESCENT PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════

function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.6';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * CONFIG.particles.speed;
            this.speedY = Math.random() * CONFIG.particles.speed + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '#00fff5' : '#39ff14';
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Pulsing effect
            this.pulsePhase += this.pulseSpeed;
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            
            // Reset if out of bounds
            if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
                this.reset();
                this.y = 0;
            }
            
            this.draw(pulse);
        }
        
        draw(pulse) {
            ctx.save();
            ctx.globalAlpha = this.opacity * pulse;
            
            // Glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 4
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Core particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < CONFIG.particles.count; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => particle.update());
        requestAnimationFrame(animate);
    }
    animate();
}

// ═══════════════════════════════════════════════════════════════
// 4. ADVANCED SCROLL REVEAL SYSTEM
// ═══════════════════════════════════════════════════════════════

function initScrollEffects() {
    // Stats Counter
    const counters = document.querySelectorAll('.counter');
    let hasCounterStarted = false;
    
    function startCounters() {
        if (hasCounterStarted) return;
        hasCounterStarted = true;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    
                    // Start counters if stats section
                    if (entry.target.classList.contains('stats-section') || 
                        entry.target.closest('.stats-section')) {
                        startCounters();
                    }
                }, index * CONFIG.animations.scrollRevealDelay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('section, .glass-card, .entry, .team-member, .result-card').forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });
    
    // Add CSS for reveal animation
    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.textContent = `
            .reveal-element {
                opacity: 0;
                transform: translateY(50px) scale(0.95);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .reveal-element.revealed {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        `;
        document.head.appendChild(style);
    }
}

// ═══════════════════════════════════════════════════════════════
// 5. CUSTOM CURSOR WITH BIOLUMINESCENT TRAIL
// ═══════════════════════════════════════════════════════════════

function initCursorEffects() {
    if (!CONFIG.effects.cursorTrail) return;
    if (window.innerWidth < 768) return; // Disable on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorGlow);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--bioluminescent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transition: transform 0.15s ease;
            box-shadow: 0 0 20px var(--bioluminescent);
        }
        .cursor-glow {
            position: fixed;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, rgba(0, 255, 245, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            mix-blend-mode: screen;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        a:hover ~ .custom-cursor,
        button:hover ~ .custom-cursor {
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(style);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth following effect
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorGlow.style.left = (glowX - 20) + 'px';
        cursorGlow.style.top = (glowY - 20) + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => {
        el.style.cursor = 'none';
    });
}

// ═══════════════════════════════════════════════════════════════
// 6. INTERACTIVE GLASS CARDS
// ═══════════════════════════════════════════════════════════════

function initInteractiveElements() {
    // 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Ripple Effect on Click
    document.querySelectorAll('.btn, .glass-card').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 245, 0.4);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// ═══════════════════════════════════════════════════════════════
// 7. TYPING EFFECT FOR HERO TEXT
// ═══════════════════════════════════════════════════════════════

function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const speed = 50;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                element.classList.add('typing-complete');
            }
        }
        
        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Add cursor blink animation
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .typing-effect::after {
            content: '|';
            color: var(--bioluminescent);
            animation: blink 0.7s infinite;
        }
        .typing-effect.typing-complete::after {
            display: none;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(cursorStyle);
}

// ═══════════════════════════════════════════════════════════════
// 8. OCEAN WAVE SOUND AMBIENCE (Optional)
// ═══════════════════════════════════════════════════════════════

function initOceanAmbience() {
    if (!CONFIG.effects.oceanWaves) return;
    
    // Create a subtle audio toggle button
    const audioToggle = document.createElement('button');
    audioToggle.className = 'audio-toggle';
    audioToggle.innerHTML = '🔇';
    audioToggle.setAttribute('aria-label', 'Toggle ocean sounds');
    
    const style = document.createElement('style');
    style.textContent = `
        .audio-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            color: var(--bioluminescent);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 255, 245, 0.2);
        }
        .audio-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(0, 255, 245, 0.4);
        }
        .audio-toggle.playing {
            background: var(--glass-hover);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(audioToggle);
    
    // Note: Actual audio implementation would require audio files
    // This is a placeholder for the UI element
    let isPlaying = false;
    audioToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        audioToggle.innerHTML = isPlaying ? '🔊' : '🔇';
        audioToggle.classList.toggle('playing');
        // Add actual audio play/pause logic here
    });
}

// ═══════════════════════════════════════════════════════════════
// 9. BACTERIA MOVEMENT ANIMATION
// ═══════════════════════════════════════════════════════════════

function initBacteriaAnimation() {
    const bacteriaElements = document.querySelectorAll('.bacteria-icon, .bacteria-model');
    
    bacteriaElements.forEach(bacteria => {
        // Swimming motion
        bacteria.style.animation = 'bacteriaSwim 3s ease-in-out infinite';
        
        // Random delay for each bacteria
        bacteria.style.animationDelay = `${Math.random() * 2}s`;
    });
    
    const bacteriaStyle = document.createElement('style');
    bacteriaStyle.textContent = `
        @keyframes bacteriaSwim {
            0%, 100% {
                transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
                transform: translateY(-10px) translateX(5px) rotate(5deg);
            }
            50% {
                transform: translateY(0) translateX(10px) rotate(0deg);
            }
            75% {
                transform: translateY(10px) translateX(5px) rotate(-5deg);
            }
        }
    `;
    document.head.appendChild(bacteriaStyle);
}

// ═══════════════════════════════════════════════════════════════
// 10. PERFORMANCE OPTIMIZATION
// ═══════════════════════════════════════════════════════════════

// Debounce function for scroll/resize events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// ═══════════════════════════════════════════════════════════════
// 11. EASTER EGGS & SPECIAL INTERACTIONS
// ═══════════════════════════════════════════════════════════════

// Konami Code Easter Egg
(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateSecretMode() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        console.log('🧬 Secret Bacteria Mode Activated! 🦠');
    }
})();

// ═══════════════════════════════════════════════════════════════
// CONSOLE EASTER EGG
// ═══════════════════════════════════════════════════════════════

console.log(`
%c
   ╔═══════════════════════════════════════════════╗
   ║   🧬 IIT BOMBAY iGEM 2026 - PET-DESTROYER    ║
   ║   Cleaning Oceans with V. natriegens         ║
   ║   Built with ❤️ by Team IITB                 ║
   ╚═══════════════════════════════════════════════╝
`, 'color: #00fff5; font-size: 12px; font-family: monospace;');

console.log('%cInterested in our code? Check out our GitHub!', 'color: #39ff14; font-size: 14px;');

// ═══════════════════════════════════════════════════════════════
// EXPORT FOR TESTING (if needed)
// ═══════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigationSystem,
        initParticleSystem,
        initScrollEffects
    };
}
document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT THE ELEMENTS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const teamCards = document.querySelectorAll('.team-card');

    // 2. ONLY RUN IF WE ARE ON THE TEAM PAGE
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                teamCards.forEach(card => {
                    // Filter logic
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        setTimeout(() => { card.style.opacity = '1'; }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});