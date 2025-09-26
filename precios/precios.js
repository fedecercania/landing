// JavaScript para la página de precios
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupInteractions();
    addScrollEffects();
});

// Inicializar animaciones de entrada
function initializeAnimations() {
    const elements = document.querySelectorAll('.pricing-card, .service-card, .contact-button');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Configurar interacciones
function setupInteractions() {
    // Efectos hover para las tarjetas de precios
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efectos para las tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efectos para botones de contacto
    const contactButtons = document.querySelectorAll('.contact-button');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    // Animar números de precios
    animatePriceNumbers();
}

// Crear efecto ripple en botones
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

// Animar números de precios
function animatePriceNumbers() {
    const priceElements = document.querySelectorAll('.amount');
    
    priceElements.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(element);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

function animateNumber(element) {
    const finalValue = element.textContent;
    const isDecimal = finalValue.includes('.');
    
    if (isDecimal) {
        // Para números decimales como 0.03, 0.05, etc.
        const [integer, decimal] = finalValue.split('.');
        const decimalValue = parseFloat(finalValue);
        let currentValue = 0;
        const increment = decimalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= decimalValue) {
                currentValue = decimalValue;
                clearInterval(timer);
            }
            element.textContent = currentValue.toFixed(decimal.length);
        }, 30);
    } else {
        // Para números enteros como 25
        const finalNum = parseInt(finalValue);
        let currentNum = 0;
        const increment = Math.ceil(finalNum / 50);
        
        const timer = setInterval(() => {
            currentNum += increment;
            if (currentNum >= finalNum) {
                currentNum = finalNum;
                clearInterval(timer);
            }
            element.textContent = currentNum.toString();
        }, 30);
    }
}

// Efectos de scroll
function addScrollEffects() {
    // Parallax effect para el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Efecto de brillo en las categorías
    const categories = document.querySelectorAll('.pricing-category');
    categories.forEach(category => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.background = 'linear-gradient(135deg, var(--medium-gray), rgba(0, 255, 136, 0.05))';
                } else {
                    entry.target.style.background = 'var(--medium-gray)';
                }
            });
        });
        
        observer.observe(category);
    });
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
                setTimeout(typeTitle, 100);
            }
        }
        
        setTimeout(typeTitle, 500);
    }
}

// Comparador de precios interactivo
function createPriceComparator() {
    const comparator = document.createElement('div');
    comparator.className = 'price-comparator';
    comparator.innerHTML = `
        <h3>Comparador de Costos</h3>
        <div class="comparator-input">
            <label>Número de mensajes por día:</label>
            <input type="number" id="messageCount" value="100" min="1" max="10000">
        </div>
        <div class="comparator-results" id="comparatorResults">
            <!-- Results will be populated here -->
        </div>
    `;
    
    // Estilos para el comparador
    comparator.style.cssText = `
        background: var(--medium-gray);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid var(--light-gray);
    `;
    
    const input = comparator.querySelector('#messageCount');
    const results = comparator.querySelector('#comparatorResults');
    
    function calculateCosts() {
        const messages = parseInt(input.value) || 0;
        const monthlyMessages = messages * 30;
        
        const deepseekCost = monthlyMessages * 0.03;
        const geminiCost = monthlyMessages * 0.05;
        const openaiCost = monthlyMessages * 0.10;
        
        results.innerHTML = `
            <div class="cost-comparison">
                <div class="cost-item deepseek">
                    <span class="provider">DeepSeek</span>
                    <span class="cost">$${deepseekCost.toFixed(2)}/mes</span>
                </div>
                <div class="cost-item gemini">
                    <span class="provider">Gemini</span>
                    <span class="cost">$${geminiCost.toFixed(2)}/mes</span>
                </div>
                <div class="cost-item openai">
                    <span class="provider">OpenAI</span>
                    <span class="cost">$${openaiCost.toFixed(2)}/mes</span>
                </div>
            </div>
        `;
    }
    
    input.addEventListener('input', calculateCosts);
    calculateCosts();
    
    // Insertar después de la sección de hero
    const heroSection = document.querySelector('.hero-section');
    heroSection.parentNode.insertBefore(comparator, heroSection.nextSibling);
}

// Inicializar comparador
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createPriceComparator, 2000);
    setTimeout(animateTitle, 500);
});

// Efecto de partículas de fondo
function createBackgroundParticles() {
    const container = document.body;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: var(--primary-green);
            border-radius: 50%;
            left: ${Math.random() * window.innerWidth}px;
            top: 100vh;
            pointer-events: none;
            z-index: -1;
            animation: floatUp 10s linear forwards;
            opacity: 0.3;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 10000);
    }
    
    // Crear partículas cada 2 segundos
    setInterval(createParticle, 2000);
}

// Inicializar partículas solo en desktop
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', createBackgroundParticles);
}

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
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .cost-comparison {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .cost-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid var(--light-gray);
        transition: all 0.3s ease;
    }
    
    .cost-item.deepseek {
        border-color: var(--deepseek-blue);
        background: rgba(0, 102, 204, 0.1);
    }
    
    .cost-item.gemini {
        border-color: var(--gemini-purple);
        background: rgba(139, 92, 246, 0.1);
    }
    
    .cost-item.openai {
        border-color: var(--openai-green);
        background: rgba(16, 163, 127, 0.1);
    }
    
    .cost-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 255, 136, 0.2);
    }
    
    .provider {
        font-weight: 600;
        color: var(--white);
    }
    
    .cost {
        font-weight: 700;
        color: var(--primary-green);
        font-size: 1.1rem;
    }
    
    .comparator-input {
        margin: 1rem 0;
    }
    
    .comparator-input label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--white);
        font-weight: 500;
    }
    
    .comparator-input input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--light-gray);
        border-radius: 8px;
        background: var(--dark-gray);
        color: var(--white);
        font-size: 1rem;
    }
    
    .comparator-input input:focus {
        outline: none;
        border-color: var(--primary-green);
    }
`;
document.head.appendChild(style);

// Smooth scrolling para navegación
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

// Inicializar smooth scrolling
document.addEventListener('DOMContentLoaded', setupSmoothScrolling);

// Efecto de hover en el badge incluido
function animateIncludedBadge() {
    const badge = document.querySelector('.included-badge');
    if (badge) {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(0, 255, 136, 0.4)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 255, 136, 0.3)';
        });
    }
}

// Inicializar efectos del badge
document.addEventListener('DOMContentLoaded', animateIncludedBadge);
