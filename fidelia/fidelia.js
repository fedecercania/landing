// JavaScript específico para la página de Fidelización

// Elementos del DOM específicos de Fidelización
const demoBtn = document.getElementById('demoBtn');
const contactBtn = document.getElementById('contactBtn');
const demoModal = document.getElementById('demoModal');
const contactModal = document.getElementById('contactModal');
const demoScratch = document.getElementById('demoScratch');
const resetDemo = document.getElementById('resetDemo');
const contactForm = document.getElementById('contactForm');
const scratchOverlay = document.getElementById('scratchOverlay');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupFideliaEventListeners();
    initializeScratchCard();
    setupScrollAnimations();
});

// Configurar event listeners específicos de Fidelización
function setupFideliaEventListeners() {
    // Botones principales
    if (demoBtn) {
        demoBtn.addEventListener('click', openDemoModal);
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', openContactModal);
    }

    // Modales
    setupModalEvents();
    
    // Demo de raspadita
    if (demoScratch) {
        demoScratch.addEventListener('click', revealDemoPrize);
    }
    
    if (resetDemo) {
        resetDemo.addEventListener('click', resetDemoScratch);
    }
    
    // Formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Scratch card principal
    const mainScratchCard = document.querySelector('.scratch-card');
    if (mainScratchCard) {
        mainScratchCard.addEventListener('click', revealMainPrize);
    }
}

// Configurar eventos de modales
function setupModalEvents() {
    const modals = [demoModal, contactModal];
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    modals.forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
}

// Abrir modal de demo
function openDemoModal() {
    if (demoModal) {
        demoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Resetear demo
        resetDemoScratch();
        
        // Animación de entrada
        const modalContent = demoModal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }
}

// Abrir modal de contacto
function openContactModal() {
    if (contactModal) {
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animación de entrada
        const modalContent = contactModal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }
}

// Cerrar modal
function closeModal(modal) {
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Revelar premio en demo
function revealDemoPrize() {
    const overlay = demoScratch.querySelector('.demo-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        
        // Efecto de confetti
        createConfetti(demoScratch);
        
        // Mostrar botón de reset después de un tiempo
        setTimeout(() => {
            if (resetDemo) {
                resetDemo.style.display = 'block';
                resetDemo.style.animation = 'fadeInUp 0.5s ease';
            }
        }, 1000);
    }
}

// Resetear demo de raspadita
function resetDemoScratch() {
    const overlay = demoScratch.querySelector('.demo-overlay');
    if (overlay) {
        overlay.style.opacity = '1';
    }
    
    if (resetDemo) {
        resetDemo.style.display = 'none';
    }
}

// Revelar premio en scratch card principal
function revealMainPrize() {
    if (scratchOverlay) {
        scratchOverlay.style.opacity = '0';
        createConfetti(document.querySelector('.scratch-card'));
        
        // Resetear después de 5 segundos
        setTimeout(() => {
            if (scratchOverlay) {
                scratchOverlay.style.opacity = '1';
            }
        }, 5000);
    }
}

// Inicializar scratch card
function initializeScratchCard() {
    const scratchCard = document.querySelector('.scratch-card');
    if (scratchCard) {
        // Añadir efecto hover
        scratchCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        scratchCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Crear efecto de confetti
function createConfetti(container) {
    const colors = ['#00ff88', '#00cc6a', '#4ade80', '#ffffff'];
    const confettiCount = 20;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(container, colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(container, color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${color};
        top: 50%;
        left: 50%;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    container.appendChild(confetti);
    
    // Animación de confetti
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const gravity = 0.5;
    let x = 0;
    let y = 0;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    
    function animateConfetti() {
        x += vx * 0.02;
        y += vy * 0.02;
        vy += gravity;
        
        confetti.style.transform = `translate(${x}px, ${y}px)`;
        confetti.style.opacity = Math.max(0, 1 - Math.abs(y) / 200);
        
        if (confetti.style.opacity > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            container.removeChild(confetti);
        }
    }
    
    requestAnimationFrame(animateConfetti);
}

// Manejar envío del formulario de contacto
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Simular envío
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = '¡Enviado! ✓';
        submitBtn.style.background = 'var(--primary-green)';
        
        setTimeout(() => {
            closeModal(contactModal);
            showSuccessNotification('¡Gracias! Te contactaremos pronto.');
            
            // Resetear formulario
            setTimeout(() => {
                e.target.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 1000);
        }, 1500);
    }, 2000);
}

// Mostrar notificación de éxito
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--gradient-green)',
        color: 'var(--black)',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        zIndex: '1001',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 10px 30px rgba(0, 255, 136, 0.3)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Configurar animaciones de scroll específicas
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animaciones específicas para diferentes elementos
                if (entry.target.classList.contains('benefit-card')) {
                    animateBenefitCard(entry.target);
                } else if (entry.target.classList.contains('pricing-card')) {
                    animatePricingCard(entry.target);
                } else if (entry.target.classList.contains('flow-step')) {
                    animateFlowStep(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observar elementos específicos
    const animateElements = document.querySelectorAll(
        '.benefit-card, .pricing-card, .flow-step, .config-item, .analytics-card'
    );
    animateElements.forEach(el => observer.observe(el));
}

// Animar tarjeta de beneficio
function animateBenefitCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, Math.random() * 200);
}

// Animar tarjeta de precio
function animatePricingCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, Math.random() * 300);
}

// Animar paso del flujo
function animateFlowStep(step) {
    const stepNumber = step.querySelector('.step-number');
    const stepContent = step.querySelector('.step-content');
    
    if (stepNumber) {
        stepNumber.style.transform = 'scale(0)';
        setTimeout(() => {
            stepNumber.style.transition = 'transform 0.5s ease';
            stepNumber.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (stepContent) {
        stepContent.style.opacity = '0';
        stepContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            stepContent.style.transition = 'all 0.5s ease';
            stepContent.style.opacity = '1';
            stepContent.style.transform = 'translateY(0)';
        }, 400);
    }
}

// Efectos para las tarjetas de configuración
document.addEventListener('DOMContentLoaded', function() {
    const configItems = document.querySelectorAll('.config-item, .prize-item');
    
    configItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Contador animado para las características
function animateCounters() {
    const counters = document.querySelectorAll('.promocion-number');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateNumber(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateNumber(element) {
    const text = element.textContent;
    if (text === '10') {
        let current = 0;
        const increment = () => {
            if (current <= 10) {
                element.textContent = current;
                current++;
                setTimeout(increment, 100);
            }
        };
        increment();
    }
}

// Efecto de typing para textos destacados
function setupTypingEffect() {
    const highlightTexts = document.querySelectorAll('.highlight-text');
    
    highlightTexts.forEach(text => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.typed) {
                    entry.target.dataset.typed = 'true';
                    typeWriter(entry.target, entry.target.textContent, 30);
                }
            });
        });
        
        observer.observe(text);
    });
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Inicializar efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    setupTypingEffect();
});

// Smooth scrolling mejorado para navegación interna
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Offset para header fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Destacar enlace activo
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// Destacar sección activa en navegación
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Inicializar destacado de sección activa
document.addEventListener('DOMContentLoaded', highlightActiveSection);
