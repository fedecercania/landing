// Elementos del DOM
const notifyBtn = document.getElementById('notifyBtn');
const modal = document.getElementById('notificationModal');
const closeBtn = document.querySelector('.close');
const notificationForm = document.getElementById('notificationForm');

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Modal de notificación
    notifyBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Formulario de notificación
    notificationForm.addEventListener('submit', handleNotificationSubmit);

    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Parallax effect para elementos flotantes
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer para animaciones al hacer scroll
    setupScrollAnimations();
}

// Abrir modal
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animación de entrada
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
}

// Cerrar modal
function closeModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Manejar envío del formulario
function handleNotificationSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simular envío
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = '¡Listo! ✓';
        submitBtn.style.background = 'var(--primary-green)';
        
        setTimeout(() => {
            closeModal();
            showSuccessNotification();
            
            // Resetear formulario y botón
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
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>¡Te notificaremos cuando estemos listos!</span>
    `;
    
    // Estilos para la notificación
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
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}


// Inicializar animaciones
function initializeAnimations() {
    // Animación de typing para el título
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.6s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 200 + index * 300);
    });

    // Animación de entrada para elementos flotantes
    const floatingElements = document.querySelectorAll('.element');
    floatingElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 1000 + index * 200);
    });
}

// Manejar efectos de scroll
function handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform += ` translateY(${yPos}px)`;
    });
}

// Configurar animaciones al hacer scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos que necesitan animación (si hay alguno en el futuro)
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}


// Efecto de partículas en el cursor (opcional)
let particles = [];
const particleCount = 5;

document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.8) { // Solo crear partículas ocasionalmente
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    
    Object.assign(particle.style, {
        position: 'fixed',
        left: x + 'px',
        top: y + 'px',
        width: '4px',
        height: '4px',
        background: 'var(--primary-green)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: '0.8',
        transform: 'scale(0)'
    });
    
    document.body.appendChild(particle);
    
    // Animar partícula
    particle.animate([
        { transform: 'scale(0)', opacity: '0.8' },
        { transform: 'scale(1)', opacity: '0.6' },
        { transform: 'scale(0)', opacity: '0' }
    ], {
        duration: 800,
        easing: 'ease-out'
    }).onfinish = () => {
        document.body.removeChild(particle);
    };
}

// Añadir estilos CSS para animaciones adicionales
const additionalStyles = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    .cursor-particle {
        animation: particleFloat 0.8s ease-out forwards;
    }
    
    @keyframes particleFloat {
        0% {
            transform: scale(0);
            opacity: 0.8;
        }
        50% {
            transform: scale(1);
            opacity: 0.6;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;

// Insertar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Efecto de máquina de escribir para el texto de descripción
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

// Aplicar efecto de máquina de escribir cuando la página se carga
window.addEventListener('load', function() {
    const description = document.querySelector('.description');
    if (description) {
        const originalText = description.textContent;
        setTimeout(() => {
            typeWriter(description, originalText, 30);
        }, 1500);
    }
});


// Easter egg: Konami code
let konamiSequence = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiSequence.push(e.code);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        activateEasterEgg();
        konamiSequence = [];
    }
});

function activateEasterEgg() {
    const body = document.body;
    body.style.filter = 'hue-rotate(180deg)';
    
    const message = document.createElement('div');
    message.innerHTML = '🚀 ¡Código secreto activado! Modo desarrollador ON';
    Object.assign(message.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--gradient-green)',
        color: 'var(--black)',
        padding: '2rem',
        borderRadius: '20px',
        fontSize: '1.5rem',
        fontWeight: '600',
        zIndex: '10000',
        textAlign: 'center'
    });
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        body.style.filter = '';
        document.body.removeChild(message);
    }, 3000);
}
