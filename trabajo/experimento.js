// JavaScript para la página de trabajo temporal
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupInteractions();
    addUrgencyEffects();
});

// Inicializar animaciones de entrada
function initializeAnimations() {
    const elements = document.querySelectorAll('.detail-item, .step, .info-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Configurar interacciones
function setupInteractions() {
    // Efecto especial para el botón de WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            trackWhatsAppClick();
        });
    }
    
    // Efectos hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.detail-item, .step, .info-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación del badge de pago
    animatePaymentBadge();
}

// Crear efecto ripple en el botón
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Animar el badge de pago
function animatePaymentBadge() {
    const paymentBadge = document.querySelector('.payment-badge');
    if (paymentBadge) {
        // Efecto de entrada dramático
        paymentBadge.style.transform = 'scale(0)';
        paymentBadge.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            paymentBadge.style.transform = 'scale(1)';
        }, 500);
        
        // Efecto de hover
        paymentBadge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 20px 50px rgba(0, 208, 132, 0.6)';
        });
        
        paymentBadge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 208, 132, 0.3)';
        });
    }
}

// Añadir efectos de urgencia
function addUrgencyEffects() {
    // Contador regresivo simulado
    createCountdownEffect();
    
    // Efecto de parpadeo para el texto de urgencia
    const urgencyText = document.querySelector('.urgency-text');
    if (urgencyText) {
        setInterval(() => {
            urgencyText.style.opacity = urgencyText.style.opacity === '0.7' ? '1' : '0.7';
        }, 1500);
    }
    
    // Efecto de partículas de dinero
    createMoneyParticles();
}

// Crear efecto de contador
function createCountdownEffect() {
    const urgencyText = document.querySelector('.urgency-text span');
    if (urgencyText) {
        // Simular contador de vacantes disponibles
        let vacancies = Math.floor(Math.random() * 5) + 3; // 3-7 vacantes
        urgencyText.textContent = `${vacancies} VACANTES DISPONIBLES`;
        
        // Decrementar cada 30 segundos
        setInterval(() => {
            if (vacancies > 1) {
                vacancies--;
                urgencyText.textContent = `${vacancies} VACANTES DISPONIBLES`;
            }
        }, 30000);
    }
}

// Crear partículas de dinero
function createMoneyParticles() {
    const container = document.body;
    
    function createMoneyParticle() {
        const particle = document.createElement('div');
        particle.innerHTML = '💰';
        particle.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            left: ${Math.random() * window.innerWidth}px;
            top: 100vh;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 8s linear forwards;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }
    
    // Crear partículas cada 3 segundos
    setInterval(createMoneyParticle, 3000);
}

// Tracking de clics en WhatsApp
function trackWhatsAppClick() {
    console.log('WhatsApp button clicked - User interested in job');
    // Aquí podrías añadir analytics real
}

// Efecto de typing para el título principal
function animateTitle() {
    const title = document.querySelector('.main-title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        function typeTitle() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeTitle, 80);
            }
        }
        
        setTimeout(typeTitle, 1000);
    }
}

// Inicializar animación del título
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateTitle, 500);
});

// Efecto de scroll suave para elementos (si se añaden más secciones)
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Detectar dispositivo y ajustar animaciones
function detectDevice() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reducir animaciones en móvil para mejor rendimiento
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
}

// Manejar resize de ventana
window.addEventListener('resize', detectDevice);

// Inicializar detección de dispositivo
document.addEventListener('DOMContentLoaded', detectDevice);

// Añadir estilos CSS dinámicos
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .payment-badge {
        will-change: transform, box-shadow;
    }
    
    .whatsapp-button {
        will-change: transform, box-shadow;
    }
`;
document.head.appendChild(style);

// Efecto de "new" o "hot" para el trabajo
function addJobBadge() {
    const heroSection = document.querySelector('.hero-section');
    const badge = document.createElement('div');
    badge.innerHTML = '🔥 NUEVO';
    badge.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        animation: bounce 2s infinite;
    `;
    
    heroSection.style.position = 'relative';
    heroSection.appendChild(badge);
}

// Inicializar badge del trabajo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addJobBadge, 2000);
});

// Añadir animación de bounce para el badge
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(bounceStyle);