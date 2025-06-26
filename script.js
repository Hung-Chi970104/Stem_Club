// STEM Club Mario-Style Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeNavigation();
    addInteractiveEffects();
    addSoundEffects();
    addParticleEffects();
});

// Navigation System
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const worlds = document.querySelectorAll('.world');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const worldName = this.getAttribute('data-world');
            switchWorld(worldName, navButtons, worlds);
        });
    });
}

function switchWorld(targetWorld, navButtons, worlds) {
    // Play switch sound
    playSound('switch');
    
    // Update navigation buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-world') === targetWorld) {
            btn.classList.add('active');
        }
    });
    
    // Switch worlds with animation
    worlds.forEach(world => {
        world.classList.remove('active');
        if (world.id === targetWorld + '-world') {
            setTimeout(() => {
                world.classList.add('active');
            }, 150);
        }
    });
}

// Interactive Effects
function addInteractiveEffects() {
    const cards = document.querySelectorAll('.card');
    const joinButton = document.querySelector('.join-btn');
    
    // Card hover effects with power-up sounds
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            playSound('powerup');
            addFloatingText('POWER UP!', this);
        });
        
        card.addEventListener('click', function() {
            playSound('coin');
            addClickEffect(this);
        });
    });
    
    // Join button special effect
    if (joinButton) {
        joinButton.addEventListener('click', function(e) {
            e.preventDefault();
            playSound('levelup');
            showJoinModal();
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        handleKeyboardNavigation(e);
    });
}

// Sound Effects System
function addSoundEffects() {
    // Create audio context for Web Audio API sounds
    window.audioContext = null;
    
    // Initialize audio on first user interaction
    document.addEventListener('click', initializeAudio, { once: true });
}

function initializeAudio() {
    try {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playSound(type) {
    if (!window.audioContext) return;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    // Different sound frequencies for different actions
    const sounds = {
        'switch': [800, 0.1],
        'powerup': [523.25, 0.2], // C5 note
        'coin': [1047, 0.1], // C6 note
        'levelup': [659.25, 0.3] // E5 note
    };
    
    const [frequency, duration] = sounds[type] || [400, 0.1];
    
    oscillator.frequency.setValueAtTime(frequency, window.audioContext.currentTime);
    oscillator.type = 'square'; // 8-bit style square wave
    
    gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
    
    oscillator.start(window.audioContext.currentTime);
    oscillator.stop(window.audioContext.currentTime + duration);
}

// Visual Effects
function addFloatingText(text, element) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
        position: absolute;
        top: -20px;
        right: 10px;
        color: #ff0000;
        font-size: 0.5rem;
        font-family: 'Press Start 2P', cursive;
        pointer-events: none;
        z-index: 1000;
        text-shadow: 1px 1px 0px #000000;
        animation: float-up 1s ease-out forwards;
    `;
    
    // Add CSS animation if not already added
    if (!document.querySelector('#floating-text-style')) {
        const style = document.createElement('style');
        style.id = 'floating-text-style';
        style.textContent = `
            @keyframes float-up {
                0% {
                    opacity: 1;
                    transform: translateY(0px);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.appendChild(floatingText);
    
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1000);
}

function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    element.style.filter = 'brightness(1.2)';
    
    setTimeout(() => {
        element.style.transform = '';
        element.style.filter = '';
    }, 150);
}

// Particle Effects
function addParticleEffects() {
    // Simple particle system on page load
    createParticles();
    
    // Add floating coins animation
    setInterval(createFloatingCoin, 5000);
}

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createParticle(particleContainer), i * 200);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.textContent = '✨';
    particle.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 10 + 10}px;
        animation: particle-fall ${Math.random() * 3 + 2}s linear forwards;
        pointer-events: none;
    `;
    
    // Add particle animation CSS if not already added
    if (!document.querySelector('#particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particle-fall {
                0% {
                    transform: translateY(-20px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            @keyframes coin-float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-50px) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 5000);
}

function createFloatingCoin() {
    const coin = document.createElement('div');
    coin.textContent = '🪙';
    coin.style.cssText = `
        position: fixed;
        bottom: -30px;
        right: ${Math.random() * 50 + 10}%;
        font-size: 20px;
        animation: coin-float 4s ease-out forwards;
        pointer-events: none;
        z-index: 10;
    `;
    
    document.body.appendChild(coin);
    
    setTimeout(() => {
        if (coin.parentNode) {
            coin.parentNode.removeChild(coin);
        }
    }, 4000);
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const currentActive = document.querySelector('.nav-btn.active');
    const currentIndex = Array.from(navButtons).indexOf(currentActive);
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : navButtons.length - 1;
            navButtons[prevIndex].click();
            break;
            
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            const nextIndex = currentIndex < navButtons.length - 1 ? currentIndex + 1 : 0;
            navButtons[nextIndex].click();
            break;
            
        case 'Enter':
        case ' ':
            if (e.target.classList.contains('nav-btn')) {
                e.preventDefault();
                e.target.click();
            }
            break;
    }
}

// Join Modal System
function showJoinModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
            border: 4px solid #000000;
            padding: 2rem;
            max-width: 500px;
            text-align: center;
            font-family: 'Press Start 2P', cursive;
            color: #000000;
            box-shadow: 8px 8px 0px #ff0000;
        ">
            <h2 style="color: #ff0000; margin-bottom: 1rem; font-size: 1rem;">🎮 GAME OVER... JUST KIDDING!</h2>
            <p style="margin-bottom: 1.5rem; font-size: 0.7rem; line-height: 1.4;">
                Ready to join the STEM Club adventure? Contact us at stemclub@school.edu or visit Room 205!
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #ff0000;
                color: white;
                border: 3px solid #000000;
                padding: 0.8rem 1.5rem;
                font-family: 'Press Start 2P', cursive;
                font-size: 0.6rem;
                cursor: pointer;
            ">CONTINUE</button>
        </div>
    `;
    
    // Add fade in animation
    if (!document.querySelector('#modal-style')) {
        const style = document.createElement('style');
        style.id = 'modal-style';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.parentNode) {
            modal.remove();
        }
    });
}

// Performance Optimization
function debounce(func, wait) {
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

// Initialize lazy loading for better performance
function initializeLazyLoading() {
    const cards = document.querySelectorAll('.card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize lazy loading when page loads
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Console easter egg
console.log(`
🍄 STEM CLUB WEBSITE 🍄
=====================
Welcome to our pixelated world!
Try these keyboard shortcuts:
- Arrow keys: Navigate sections
- A/D keys: Navigate sections
- Enter/Space: Activate buttons

Built with ❤️ and lots of ☕
`);