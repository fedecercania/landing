// Elementos del DOM - solo los que existen
const notifyBtn = document.getElementById('notifyBtn');
const modal = document.getElementById('notificationModal');
const closeBtn = document.querySelector('.close');
const notificationForm = document.getElementById('notificationForm');

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    // Generar un nuevo SID de conversación por apertura de página (por sesión)
    try {
        const key = 'clara_conversation_sid';
        const newSid = generateUuid();
        sessionStorage.setItem(key, newSid);
    } catch (_) {}
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // CTA principal: hacer temblar el chat y abrirlo (no abrir modal)
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const chatWidget = document.getElementById('chatWidget');
            if (chatWidget) {
                chatWidget.style.display = 'flex';
                chatWidget.classList.remove('shake');
                // forzar reflow para reiniciar animación
                void chatWidget.offsetWidth;
                chatWidget.classList.add('shake');
                setTimeout(() => chatWidget.classList.remove('shake'), 700);
                // enfocar input de chat
                const input = document.getElementById('chatInput');
                if (input) {
                    setTimeout(() => input.focus(), 0);
                }
            }
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Formulario de notificación
    if (notificationForm) {
        notificationForm.addEventListener('submit', handleNotificationSubmit);
    }

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

    // Chat widget: abrir por defecto y permitir cerrar
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    if (chatWidget) {
        chatWidget.style.display = 'flex';
    }
    if (chatClose && chatWidget) {
        chatClose.addEventListener('click', function() {
            chatWidget.style.display = 'none';
        });
    }

    // Chat: manejo de envío de mensajes del usuario
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.querySelector('.chat-body');

    if (chatForm && chatInput && chatBody) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // Crear burbuja de mensaje del usuario
            const msg = document.createElement('div');
            msg.className = 'message user';
            const p = document.createElement('p');
            p.textContent = text;
            msg.appendChild(p);
            chatBody.appendChild(msg);

            // Limpiar input y hacer scroll al final
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            // Mostrar indicador de escritura de Clara y llamar al webhook
            const typingEl = showClaraTyping(chatBody);
            sendMessageToClara(text)
                .then((replyText) => {
                    removeClaraTyping(chatBody, typingEl);
                    appendClaraMessage(chatBody, replyText);
                })
                .catch(() => {
                    removeClaraTyping(chatBody, typingEl);
                    appendClaraMessage(chatBody, 'Disculpa, tuve un problema al responder. ¿Podemos intentar de nuevo?');
                });
        });
    }
}

// Llamar al webhook de n8n con Basic Auth y devolver texto de respuesta
function sendMessageToClara(userText) {
    const url = 'https://n8n.cercania.net/webhook/92093f2c-8c99-4e67-a09a-6d6ba9c60f94';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('n8n:n8n')
    };
    const sid = getConversationSid();

    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            message: userText,
            sid: sid,
            payload: { message: userText, sid: sid }
        })
    }).then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
            throw new Error('Bad response');
        }
        try {
            if (contentType.includes('application/json')) {
                const data = await res.json();
                const candidate = data.reply || data.message || data.text || data.answer || '';
                return (typeof candidate === 'string' && candidate.trim()) ? candidate : JSON.stringify(data);
            }
        } catch (_) {
            // fallback a texto
        }
        return res.text();
    });
}

// Obtener/generar sid persistente de la conversación
function getConversationSid() {
    try {
        const key = 'clara_conversation_sid';
        // Preferir por sesión (nuevo en cada apertura de página/ventana)
        let sid = sessionStorage.getItem(key);
        if (sid) return sid;
        // Fallback si sessionStorage no disponible
        sid = generateUuid();
        return sid;
    } catch (_) {
        // Si localStorage falla, genera uno volátil
        return generateUuid();
    }
}

function generateUuid() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Fallback simple v4-like
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Mostrar indicador de escritura de Clara
function showClaraTyping(chatBody) {
    const typing = document.createElement('div');
    typing.className = 'message bot typing';
    const avatar = document.createElement('video');
    avatar.className = 'avatar avatar-video';
    avatar.src = 'Clara.mp4';
    avatar.width = 40;
    avatar.height = 40;
    avatar.muted = true;
    avatar.autoplay = true;
    avatar.loop = true;
    avatar.playsInline = true;
    avatar.setAttribute('aria-label', 'Video de perfil de Clara');

    const p = document.createElement('p');
    p.textContent = 'Clara está escribiendo…';
    typing.appendChild(avatar);
    typing.appendChild(p);
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
}

function removeClaraTyping(chatBody, typingEl) {
    if (typingEl && chatBody.contains(typingEl)) {
        chatBody.removeChild(typingEl);
    }
}

// Agregar mensaje de Clara con avatar de video
function appendClaraMessage(chatBody, text) {
    const msg = document.createElement('div');
    msg.className = 'message bot';

    const avatar = document.createElement('video');
    avatar.className = 'avatar avatar-video';
    avatar.src = 'Clara.mp4';
    avatar.width = 40;
    avatar.height = 40;
    avatar.muted = true;
    avatar.autoplay = true;
    avatar.loop = true;
    avatar.playsInline = true;
    avatar.setAttribute('aria-label', 'Video de perfil de Clara');

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = renderMarkdownToHtml(text);

    msg.appendChild(avatar);
    msg.appendChild(content);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Utilidades de renderizado seguro (Markdown básico a HTML)
function renderMarkdownToHtml(raw) {
    const text = escapeHtml(raw || '');
    // bold **text**
    let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');
    // italics *text*
    html = html.replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1<em>$2<\/em>');
    // inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1<\/code>');
    // simple lists: lines starting with - or * or numbers
    html = html.replace(/(?:^|\n)(?:\s*)([-*])\s+(.+)(?=\n|$)/g, function(_, bullet, item){
        return `\n<li>${item}<\/li>`;
    });
    // wrap consecutive <li> into <ul>
    html = html.replace(/(?:<li>[\s\S]*?<\/li>)(?:(?:\n)?<li>[\s\S]*?<\/li>)*/g, function(list){
        const items = list.replace(/\n/g, '');
        return `<ul>${items}<\/ul>`;
    });
    // paragraphs: convert double newlines into <p>
    const blocks = html.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
    html = blocks.map(b => {
        // if already a block element
        if (b.startsWith('<ul>') || b.startsWith('<ol>')) return b;
        return `<p>${b}<\/p>`;
    }).join('');
    // line breaks
    html = html.replace(/\n/g, '<br/>');
    return html;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Abrir modal
function openModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animación de entrada
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
        }
    }
}

// Cerrar modal
function closeModal() {
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Manejar envío del formulario
function handleNotificationSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    if (!emailInput) return;
    
    const email = emailInput.value;
    
    // Simular envío
    const submitBtn = e.target.querySelector('button');
    if (!submitBtn) return;
    
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
