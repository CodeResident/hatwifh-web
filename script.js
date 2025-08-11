// Interactive JavaScript for Hatwifhat Memecoin Website

// Countdown timer for metaverse launch
let countdownInterval;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    startCountdownTimer();
    addScrollEffects();
    addInteractiveElements();
});

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.reason-card, .timeline-content, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Start countdown timer
async function startCountdownTimer() {
    try {
        // Fetch countdown data from Supabase
        const { data: countdownData, error } = await supabaseClient
            .from('metaverse_countdown')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error) throw error;
        
        if (countdownData && countdownData.launch_date) {
            const launchDate = new Date(countdownData.launch_date);
            const message = countdownData.message || 'Metaverse Launch Countdown';
            
            // Update message if available
            const countdownMessage = document.querySelector('.countdown-container h3');
            if (countdownMessage) {
                countdownMessage.textContent = message;
            }
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = launchDate.getTime() - now;
                
                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    document.getElementById('days').textContent = days.toString().padStart(2, '0');
                    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
                } else {
                    // Countdown finished
                    clearInterval(countdownInterval);
                    document.querySelector('.countdown-container').innerHTML = `
                        <h3>🎉 Metaverse is Live! 🎉</h3>
                        <p style="font-size: 1.5rem; color: #4ecdc4; margin: 2rem 0;">Welcome to the Hatwifhat Metaverse! 🎮🌍</p>
                        <p style="color: #cccccc;">Your virtual hat is waiting for you!</p>
                    `;
                }
            }
            
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
            
            console.log('Countdown loaded from Supabase:', launchDate);
        } else {
            // Fallback to default countdown if no data
            setDefaultCountdown();
        }
        
    } catch (error) {
        console.error('Failed to load countdown from Supabase:', error);
        // Fallback to default countdown
        setDefaultCountdown();
    }
}

// Fallback countdown function
function setDefaultCountdown() {
    // Set countdown to 12 days from now as fallback
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 12);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Countdown finished
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = `
                <h3>🎉 Metaverse is Live! 🎉</h3>
                <p style="font-size: 1rem; color: #4ecdc4; margin: 2rem 0;">Welcome to the Hatwifhat Metaverse! 🎮🌍</p>
                <p style="color: #cccccc;">Your virtual hat is waiting for you!</p>
            `;
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    console.log('Using fallback countdown');
}

// Refresh countdown from database
async function refreshCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    await startCountdownTimer();
    showNotification('🔄 Countdown refreshed from database!', 'success');
}

// Add scroll effects
function addScrollEffects() {
    let ticking = false;
    
    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.stars');
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Add interactive elements
function addInteractiveElements() {
    // Add click effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.reason-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    typeWriter();
}

// Create ripple effect for buttons
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Typewriter effect for hero title
function typeWriter() {
    const title = document.querySelector('.gradient-text');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function type() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(type, typeSpeed);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
}

// Copy contract address to clipboard
function copyContractAddress() {
    const contractText = '5cmfyAZyReGR7pnWdok9Z2wwhNApc9STjPPawsispump';
    
    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(contractText).then(() => {
            showNotification('📋 Contract address copied to clipboard! 🎩', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(contractText);
        });
    } else {
        fallbackCopyTextToClipboard(contractText);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('📋 Contract address copied to clipboard! 🎩', 'success');
    } catch (err) {
        showNotification('❌ Failed to copy contract address', 'error');
    }
    
    document.body.removeChild(textArea);
}



function joinTelegram() {
    window.open('https://t.me/hatwifhatchannel', '_blank');
    showNotification('📱 Welcome to the Hatwifhat Telegram channel! 🎩', 'success');
}

function joinTwitter() {
    window.open('https://x.com/i/communities/1953169616609656886', '_blank');
    showNotification('🐦 Welcome to the Hatwifhat Twitter community! 🎩', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add CSS for ripple effect
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;

// Inject ripple styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Add floating particles effect
function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const emojis = ['🎩', '🚀', '⭐', '💎', '🌙'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    particle.textContent = randomEmoji;
    particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        opacity: ${Math.random() * 0.5 + 0.3};
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 15000);
}

// Add particle animation styles
const particleStyles = `
    @keyframes float-particle {
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
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;

const particleStyleSheet = document.createElement('style');
particleStyleSheet.textContent = particleStyles;
document.head.appendChild(particleStyleSheet);

// Start floating particles
setTimeout(createFloatingParticles, 1000);

// Add smooth scrolling for navigation links
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

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add confetti effect for special interactions
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation styles
const confettiStyles = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
`;

const confettiStyleSheet = document.createElement('style');
confettiStyleSheet.textContent = confettiStyles;
document.head.appendChild(confettiStyleSheet);

// Trigger confetti on special events
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-primary')) {
        setTimeout(createConfetti, 1000);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        buyNow();
    }
});

// Add Easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Easter egg found! You\'re a true hat enthusiast! 🎩', 'success');
        createConfetti();
        konamiCode = [];
    }
});

// Game Variables
let canvas, ctx;
let gameRunning = false;
let gamePaused = false;
let playerName = '';
let marketCap = 0;
let distance = 0;
let asteroidsDestroyed = 0;
let gameSpeed = 2;
let asteroidSpeed = 3;
let lastAsteroidSpawn = 0;
let lastBulletSpawn = 0;
let lastMillionMilestone = 0;

// Game Objects
let player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    speed: 5
};

let bullets = [];
let asteroids = [];
let stars = [];

// Supabase configuration
const SUPABASE_URL = 'https://somyzdyoktkmsdgyfjpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbXl6ZHlva3RrbXNkZ3lmanBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDUxNjIsImV4cCI6MjA3MDMyMTE2Mn0.PayrDCBEyooWO5QnW6E2lqP1ZQc1O3gTlH4uudIXqnY';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase functions
async function getLeaderboard() {
    try {
        const { data, error } = await supabaseClient
            .from('game_leaderboard')
            .select('*')
            .order('market_cap', { ascending: false })
            .limit(15);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

async function getPlayerPosition(playerName) {
    try {
        // Get all scores to find player's position
        const { data, error } = await supabaseClient
            .from('game_leaderboard')
            .select('*')
            .order('market_cap', { ascending: false });
        
        if (error) throw error;
        
        // Find player's position
        const playerIndex = data.findIndex(entry => entry.player_name === playerName);
        if (playerIndex !== -1) {
            return {
                position: playerIndex + 1,
                score: data[playerIndex]
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting player position:', error);
        return null;
    }
}

async function addScore(playerName, marketCap, distance, asteroidsDestroyed) {
    try {
        // Check if player already has a score
        const { data: existingScore, error: checkError } = await supabaseClient
            .from('game_leaderboard')
            .select('*')
            .eq('player_name', playerName)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw checkError;
        }
        
        if (existingScore) {
            // Player already has a score, check if new score is higher
            if (marketCap > existingScore.market_cap) {
                // Update with higher score
                const { error: updateError } = await supabaseClient
                    .from('game_leaderboard')
                    .update({
                        market_cap: marketCap,
                        distance: distance,
                        asteroids_destroyed: asteroidsDestroyed,
                        created_at: new Date().toISOString()
                    })
                    .eq('player_name', playerName);
                
                if (updateError) throw updateError;
                console.log('Player score updated with higher score');
            } else {
                console.log('New score is lower, keeping existing score');
            }
        } else {
            // Player doesn't have a score yet, insert new one
            const { error: insertError } = await supabaseClient
                .from('game_leaderboard')
                .insert([
                    {
                        player_name: playerName,
                        market_cap: marketCap,
                        distance: distance,
                        asteroids_destroyed: asteroidsDestroyed,
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (insertError) throw insertError;
            console.log('New player score added to leaderboard');
        }
        
        return true;
    } catch (error) {
        console.error('Error adding/updating score:', error);
        return null;
    }
}

// Global leaderboard data
let leaderboard = [];

// Authentication variables
let currentUser = null;
let isLoggedIn = false;



// Initialize the website
document.addEventListener('DOMContentLoaded', async function() {
    initializeAnimations();
    startCountdownTimer();
    addScrollEffects();
    addInteractiveElements();
    initializeGame();
    
    // Load leaderboard from Supabase
    try {
        leaderboard = await getLeaderboard();
        console.log('Leaderboard loaded from Supabase');
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }
    

});

// Initialize game
function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Load player image
    const playerImg = new Image();
    playerImg.src = 'Hatwifhat.png';
    playerImg.onload = function() {
        player.image = playerImg;
    };
    
    // Initialize stars
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2 + 1
        });
    }
    
    // Set up keyboard controls
    setupKeyboardControls();
}

// Start game
function startGame() {
    if (!isLoggedIn || !currentUser) {
        showNotification('Please login to play! 🔐', 'info');
        return;
    }
    
    playerName = currentUser.username;
    
    // Reset game state
    marketCap = 0;
    distance = 0;
    asteroidsDestroyed = 0;
    gameSpeed = 2;
    asteroidSpeed = 3;
    lastMillionMilestone = 0;
    bullets = [];
    asteroids = [];
    gameRunning = true;
    gamePaused = false;
    
    // Show game canvas
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('gameCanvasContainer').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    
    // Start game loop
    gameLoop();
    
    showNotification(`Welcome ${playerName}! Let's reach the moon! 🚀`, 'success');
}

// Game loop
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update player position based on input
    updatePlayerMovement();
    
    // Update bullets
    updateBullets();
    
    // Update asteroids
    updateAsteroids();
    
    // Update stars
    updateStars();
    
    // Spawn asteroids
    if (Date.now() - lastAsteroidSpawn > 2000 / gameSpeed) {
        spawnAsteroid();
        lastAsteroidSpawn = Date.now();
    }
    
    // Update scores
    distance += gameSpeed;
    marketCap = Math.floor(distance * 1000 + asteroidsDestroyed * 50000);
    
    // Check for 10 million milestones and increase asteroid speed
    const currentTenMillion = Math.floor(marketCap / 10000000);
    if (currentTenMillion > lastMillionMilestone) {
        asteroidSpeed += 1.0;
        lastMillionMilestone = currentTenMillion;
        showNotification(`🚀 Market Cap: $${currentTenMillion * 10}M! Asteroids getting faster! ⚡`, 'success');
    }
    
    // Update UI
    updateGameUI();
    
    // Check collisions
    checkCollisions();
    
    // Increase game speed over time
    if (distance % 1000 === 0) {
        gameSpeed += 0.1;
    }
}

// Global key state
let keys = {};

// Setup keyboard controls
function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        // Don't handle game controls if user is typing in input field
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        
        keys[e.code] = true;
        
        // Shooting
        if (e.code === 'Space' && gameRunning && !gamePaused && Date.now() - lastBulletSpawn > 300) {
            e.preventDefault();
            shootBullet();
            lastBulletSpawn = Date.now();
        }
        
        // Prevent default for game keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        // Don't handle game controls if user is typing in input field
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        
        keys[e.code] = false;
    });
}

// Update player movement
function updatePlayerMovement() {
    // Move player based on current key states
    if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['KeyW']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) player.y += player.speed;
    
    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// Shoot bullet
function shootBullet() {
    bullets.push({
        x: player.x + player.width,
        y: player.y + player.height / 2,
        width: 10,
        height: 4,
        speed: 10
    });
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].speed;
        
        // Remove bullets that are off screen
        if (bullets[i].x > canvas.width) {
            bullets.splice(i, 1);
        }
    }
}

// Spawn asteroid
function spawnAsteroid() {
    const size = Math.random() * 30 + 20;
    asteroids.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size,
        speed: Math.random() * 3 + asteroidSpeed,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.2
    });
}

// Update asteroids
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].x -= asteroids[i].speed;
        asteroids[i].rotation += asteroids[i].rotationSpeed;
        
        // Remove asteroids that are off screen
        if (asteroids[i].x + asteroids[i].width < 0) {
            asteroids.splice(i, 1);
        }
    }
}

// Update stars
function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].x -= stars[i].speed;
        if (stars[i].x < 0) {
            stars[i].x = canvas.width;
            stars[i].y = Math.random() * canvas.height;
        }
    }
}

// Check collisions
function checkCollisions() {
    // Check bullet-asteroid collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (bullets[i] && asteroids[j] && 
                bullets[i].x < asteroids[j].x + asteroids[j].width &&
                bullets[i].x + bullets[i].width > asteroids[j].x &&
                bullets[i].y < asteroids[j].y + asteroids[j].height &&
                bullets[i].y + bullets[i].height > asteroids[j].y) {
                
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                asteroidsDestroyed++;
                break;
            }
        }
    }
    
    // Check player-asteroid collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
        if (player.x < asteroids[i].x + asteroids[i].width &&
            player.x + player.width > asteroids[i].x &&
            player.y < asteroids[i].y + asteroids[i].height &&
            player.y + player.height > asteroids[i].y) {
            
            gameOver();
            break;
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0c0c0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw player
    if (player.image) {
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(Math.sin(Date.now() * 0.005) * 0.1);
        ctx.drawImage(player.image, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    } else {
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    
    // Draw bullets
    ctx.fillStyle = '#ff6b6b';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw asteroids
    ctx.fillStyle = '#666666';
    for (let asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        ctx.rotate(asteroid.rotation);
        ctx.fillRect(-asteroid.width / 2, -asteroid.height / 2, asteroid.width, asteroid.height);
        ctx.restore();
    }
    
    // Draw moon in the distance
    const moonX = canvas.width - 100;
    const moonY = 100;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.arc(moonX - 10, moonY - 10, 10, 0, Math.PI * 2);
    ctx.fill();
}

// Update game UI
function updateGameUI() {
    document.getElementById('marketCapScore').textContent = '$' + marketCap.toLocaleString();
    document.getElementById('distanceScore').textContent = Math.floor(distance) + ' km';
    document.getElementById('asteroidsDestroyed').textContent = asteroidsDestroyed;
}

// Game over
async function gameOver() {
    gameRunning = false;
    
    // Update final scores
    document.getElementById('finalMarketCap').textContent = '$' + marketCap.toLocaleString();
    document.getElementById('finalDistance').textContent = Math.floor(distance) + ' km';
    document.getElementById('finalAsteroids').textContent = asteroidsDestroyed;
    
    // Add to leaderboard
    await addToLeaderboard(playerName, marketCap, Math.floor(distance));
    
    // Show game over screen
    document.getElementById('gameCanvasContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    
    showNotification(`Game Over! Your market cap: $${marketCap.toLocaleString()} 🎮`, 'info');
}

// Pause game
function pauseGame() {
    if (gamePaused) {
        gamePaused = false;
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Pause';
        gameLoop();
    } else {
        gamePaused = true;
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

// Restart game
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'block';
    
    // Show user profile instead of login form
    showUserProfile();
    
    // Auto-start the game after a short delay
    setTimeout(() => {
        startGame();
    }, 500);
}

// Add to leaderboard
async function addToLeaderboard(name, marketCap, distance) {
    try {
        // Add/update score to Supabase (only saves highest score)
        const result = await addScore(name, marketCap, distance, asteroidsDestroyed);
        
        if (result) {
            // Refresh leaderboard from database
            leaderboard = await getLeaderboard();
            console.log('Score processed in Supabase leaderboard');
        }
    } catch (error) {
        console.error('Failed to add score to leaderboard:', error);
        // Fallback to local storage if Supabase fails
        const existingIndex = leaderboard.findIndex(entry => entry.player_name === name);
        
        if (existingIndex !== -1) {
            // Update existing score if higher
            if (marketCap > leaderboard[existingIndex].market_cap) {
                leaderboard[existingIndex] = {
                    player_name: name,
                    market_cap: marketCap,
                    distance: distance,
                    asteroids_destroyed: asteroidsDestroyed
                };
            }
        } else {
            // Add new score
            leaderboard.push({
                player_name: name,
                market_cap: marketCap,
                distance: distance,
                asteroids_destroyed: asteroidsDestroyed
            });
        }
        
        leaderboard.sort((a, b) => b.market_cap - a.market_cap);
        leaderboard = leaderboard.slice(0, 15);
    }
}

// Show leaderboard
async function showLeaderboard() {
    try {
        // Refresh leaderboard from Supabase
        leaderboard = await getLeaderboard();
    } catch (error) {
        console.error('Failed to refresh leaderboard:', error);
    }
    
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';
    
    // Show top 15
    leaderboard.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'leaderboard-entry';
        
        // Check if this is the current player's entry
        if (entry.player_name === playerName) {
            entryDiv.classList.add('current-player');
        }
        
        entryDiv.innerHTML = `
            <span>${index + 1}</span>
            <span>${entry.player_name}</span>
            <span>$${entry.market_cap.toLocaleString()}</span>
            <span>${entry.distance} km</span>
        `;
        leaderboardBody.appendChild(entryDiv);
    });
    
    // Check if current player is not in top 15 and show their position
    if (playerName && playerName !== 'Anonymous') {
        const playerPosition = await getPlayerPosition(playerName);
        if (playerPosition && playerPosition.position > 15) {
            // Add separator
            const separatorDiv = document.createElement('div');
            separatorDiv.className = 'leaderboard-separator';
            separatorDiv.innerHTML = '<span>...</span>';
            leaderboardBody.appendChild(separatorDiv);
            
            // Add player's position
            const playerDiv = document.createElement('div');
            playerDiv.className = 'leaderboard-entry player-position current-player';
            playerDiv.innerHTML = `
                <span>${playerPosition.position}</span>
                <span>${playerPosition.score.player_name}</span>
                <span>$${playerPosition.score.market_cap.toLocaleString()}</span>
                <span>${playerPosition.score.distance} km</span>
            `;
            leaderboardBody.appendChild(playerDiv);
        }
    }
    
    document.getElementById('leaderboard').style.display = 'block';
}

// Hide leaderboard
function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
}



// Authentication functions
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userProfile').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('userProfile').style.display = 'none';
}

function showUserProfile() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userProfile').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('userDisplayName').textContent = currentUser.username;
        document.getElementById('userInfoUsername').textContent = currentUser.username;
    }
}

async function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        showNotification('Please fill in all fields! 📝', 'info');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match! ❌', 'info');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters! 🔒', 'info');
        return;
    }
    
    try {
        // Check if username already exists
        const { data: existingUsers, error: checkError } = await supabaseClient
            .from('users')
            .select('username')
            .eq('username', username);
        
        if (checkError) throw checkError;
        
        if (existingUsers && existingUsers.length > 0) {
            showNotification('Username already taken! Try another one! 🚫', 'info');
            return;
        }
        
        // Create new user
        const { data, error } = await supabaseClient
            .from('users')
            .insert([
                {
                    username: username,
                    password: password, // In production, this should be hashed
                    created_at: new Date().toISOString()
                }
            ])
            .select();
        
        if (error) throw error;
        
        currentUser = data[0];
        isLoggedIn = true;
        playerName = username;
        
        showUserProfile();
        showNotification('Account created successfully! Welcome to Hatwifhat! 🎉', 'success');
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Failed to create account. Please try again! ❌', 'info');
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showNotification('Please enter username and password! 📝', 'info');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error) throw error;
        
        if (!data) {
            showNotification('Invalid username or password! ❌', 'info');
            return;
        }
        
        currentUser = data;
        isLoggedIn = true;
        playerName = username;
        
        showUserProfile();
        showNotification('Login successful! Welcome back! 🎉', 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Invalid username or password! ❌', 'info');
    }
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    playerName = '';
    
    // Clear form fields
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showLoginForm();
    showNotification('Logged out successfully! 👋', 'info');
}

function logoutFromGame() {
    if (gameRunning) {
        gameRunning = false;
    }
    
    logout();
    
    // Return to login screen
    document.getElementById('gameCanvasContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'block';
}

function changeUsername() {
    const newUsername = prompt('Enter new username:');
    if (newUsername && newUsername.trim()) {
        // In a real app, you'd update this in the database
        currentUser.username = newUsername.trim();
        playerName = newUsername.trim();
        showUserProfile();
        showNotification('Username updated! ✏️', 'success');
    }
}

console.log('🚀 Hatwifhat website loaded successfully! 🎩');
console.log('💡 Try the Konami code for a surprise!');
console.log('🎮 Space game ready to play!');
console.log('🔐 Authentication system ready!');
