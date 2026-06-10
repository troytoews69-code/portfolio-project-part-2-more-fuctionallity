// Enhanced Portfolio Website JavaScript
// Author: Troy Lussier

// ==============================================================
// THIS IS WHERE THE WEATHER WIDGET FUNCTIONALITY IS LOCATED
// ==============================================================

// This is the configure the weather widget area
const WEATHER_CONFIG = {
    apiKey: 'e119787bc7af44a2a9404145250811',
    city: 'Kelowna',
    country: 'CA',
    apiUrl: 'https://api.weatherapi.com/v1/current.json'
};

// This is where we initialize weather widget
function initWeatherWidget() {
    createWeatherHTML();

    // This is where we try to get weather data immediately
    getWeatherData();

    // This is where we update weather every 30 minutes
    setInterval(getWeatherData, 30 * 60 * 1000);
}

// This is where we create the weather widget HTML
function createWeatherHTML() {
    // The weather widget is now in the navigation bar in HTML
    // This is where we don't need to create it dynamically anymore
    console.log('Weather widget initialized in navigation bar');
}

// This is where we get weather data from API
async function getWeatherData() {
    try {
        // This is where we call WeatherAPI.com API
        const response = await fetch(
            `${WEATHER_CONFIG.apiUrl}?key=${WEATHER_CONFIG.apiKey}&q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.country}&aqi=no`
        );
        
        if (response.ok) {
            const weatherData = await response.json();
            updateWeatherDisplayWeatherAPI(weatherData);
            console.log('Weather data updated successfully from WeatherAPI.com');
        } else {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        } catch (error) {
            console.error('Weather widget error:', error);
            showWeatherError();
    
            // This is where we fallback to demo data if API fails
            const demoWeatherData = {
                current: {
                    temp_c: 12,
                    humidity: 65,
                    condition: {
                        text: 'Clear',
                        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
                    },
                    wind_kph: 15,
                    vis_km: 10
                }
            };
            
            updateWeatherDisplayWeatherAPI(demoWeatherData);
        }
    }
// This is where we update weather display with WeatherAPI.com data
function updateWeatherDisplayWeatherAPI(data) {
    const widget = document.querySelector('.weather-widget-nav');
    if (!widget) return;

    // This is where we update temperature (WeatherAPI provides temp in Celsius directly)
    const temp = widget.querySelector('.weather-temp-nav');
    temp.textContent = `${Math.round(data.current.temp_c)}°C`;

    // This is where we update weather icon
    const icon = widget.querySelector('.weather-icon-nav i');
    const conditionText = data.current.condition.text.toLowerCase();

    // This is where we map WeatherAPI conditions to Font Awesome icons
    const iconMap = {
        'sunny': 'fas fa-sun',
        'clear': 'fas fa-sun',
        'partly cloudy': 'fas fa-cloud-sun',
        'cloudy': 'fas fa-cloud',
        'overcast': 'fas fa-cloud',
        'mist': 'fas fa-smog',
        'fog': 'fas fa-smog',
        'patchy rain possible': 'fas fa-cloud-rain',
        'light rain': 'fas fa-cloud-rain',
        'moderate rain': 'fas fa-cloud-rain',
        'heavy rain': 'fas fa-cloud-showers-heavy',
        'light snow': 'fas fa-snowflake',
        'moderate snow': 'fas fa-snowflake',
        'heavy snow': 'fas fa-snowflake',
        'thundery outbreaks possible': 'fas fa-bolt',
        'blizzard': 'fas fa-snowflake',
        'drizzle': 'fas fa-cloud-drizzle'
    };

    // This is where we find matching icon or use cloud as default
    let iconClass = 'fas fa-cloud';
    for (const [condition, iconClassName] of Object.entries(iconMap)) {
        if (conditionText.includes(condition)) {
            iconClass = iconClassName;
            break;
        }
    }
    icon.className = iconClass;

    // This is where we add weather-based styling based on condition
    const mainCondition = getMainWeatherCondition(conditionText);
    widget.className = `weather-widget-nav weather-${mainCondition}`;

    // This is where we add temperature-based color hints
    const temperature = Math.round(data.current.temp_c);
    if (temperature >= 25) {
        widget.classList.add('weather-hot');
    } else if (temperature <= 0) {
        widget.classList.add('weather-cold');
    }

    // This is where we add tooltip with full weather info
    widget.title = `${data.current.condition.text}\nHumidity: ${data.current.humidity}%\nWind: ${Math.round(data.current.wind_kph)} km/h\nVisibility: ${data.current.vis_km} km`;
        console.log(`Weather updated in nav: ${temperature}°C, ${data.current.condition.text} in ${WEATHER_CONFIG.city}`);
        console.log(`Weather updated in nav: ${temperature}°C, ${data.current.condition.text} in ${WEATHER_CONFIG.city}`);
    }
// This is where we get the main weather condition for styling
function getMainWeatherCondition(conditionText) {
    const condition = conditionText.toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) return 'clear';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
    if (condition.includes('snow') || condition.includes('blizzard')) return 'snow';
    if (condition.includes('thunder')) return 'thunderstorm';
    if (condition.includes('mist') || condition.includes('fog')) return 'mist';
    if (condition.includes('cloud')) return 'clouds';

    return 'clear'; // This is where we set the default
}

// This is where we keep the old function for backwards compatibility (but it won't be used)
// This is where we update weather display with data
function updateWeatherDisplay(data) {
    const widget = document.querySelector('.weather-widget');
    if (!widget) return;

    // This is where we update temperature
    const temp = widget.querySelector('.weather-temp');
    temp.textContent = `${Math.round(data.main.temp)}°C`;

    // This is where we update weather icon
    const icon = widget.querySelector('.weather-icon i');
    const weatherMain = data.weather[0].main.toLowerCase();

    // This is where we map weather conditions to icons with better variety
    const iconMap = {
        'clear': 'fas fa-sun',
        'clouds': 'fas fa-cloud',
        'rain': 'fas fa-cloud-rain',
        'drizzle': 'fas fa-cloud-rain',
        'snow': 'fas fa-snowflake',
        'thunderstorm': 'fas fa-bolt',
        'mist': 'fas fa-smog',
        'fog': 'fas fa-smog',
        'haze': 'fas fa-smog',
        'dust': 'fas fa-smog',
        'sand': 'fas fa-smog',
        'ash': 'fas fa-smog',
        'squall': 'fas fa-wind',
        'tornado': 'fas fa-wind'
    };
    
    icon.className = iconMap[weatherMain] || 'fas fa-cloud';

    // This is where we update details with better formatting
    widget.querySelector('.weather-humidity').textContent = `${data.main.humidity}%`;

    // This is where we convert wind speed from m/s to km/h and format nicely
    const windSpeedKmh = Math.round(data.wind.speed * 3.6);
    widget.querySelector('.weather-wind').textContent = `${windSpeedKmh} km/h`;
    
    // This is where we format visibility (API returns in meters, convert to km)
    const visibilityKm = Math.round(data.visibility / 1000);
    widget.querySelector('.weather-visibility').textContent = `${visibilityKm} km`;
    
    // This is where we add weather-based styling
    widget.className = `weather-widget weather-${weatherMain}`;
    
    // This is where we add temperature-based color hints
    const temperature = Math.round(data.main.temp);
    if (temperature >= 25) {
        widget.classList.add('weather-hot');
    } else if (temperature <= 0) {
        widget.classList.add('weather-cold');
    }
    
    console.log(`Weather updated: ${temperature}°C, ${data.weather[0].main} in ${WEATHER_CONFIG.city}`);
}

// This is where we show weather errors
function showWeatherError() {
    const widget = document.querySelector('.weather-widget-nav');
    if (!widget) return;
    
    widget.querySelector('.weather-temp-nav').textContent = '--°';
    widget.querySelector('.weather-icon-nav i').className = 'fas fa-exclamation-triangle';
    widget.title = 'Weather data unavailable';
}

// ==============================================================
// THIS IS WHERE WE ENHANCED NAVIGATION FUNCTIONALITY AREA
// ==============================================================

// This is where we handle mobile navigation toggle with enhanced animations
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // This is where we add body scroll lock when mobile menu is open
    document.body.classList.toggle('menu-open');
});

// This is where we close mobile menu when clicking on a links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});
// This is where we enhance smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = target.offsetTop - navHeight - 10;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    });
});

// ===============================================================
// THIS IS WHERE WE ADD SCROLL EFFECTS AND ANIMATIONS AREA
// ===============================================================

// This is where we enhance navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 100;
    
    navbar.classList.toggle('scrolled', scrolled);

    // This is where we add active nav link highlighting
    highlightActiveSection();

    // This is where we show/hide scroll to top button
    toggleScrollToTopButton();
});

// ===============================================================
// THIS IS WHERE THE SCROLL TO TOP FUNCTIONALITY AREA
// ===============================================================

function toggleScrollToTopButton() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (!scrollToTopBtn) return;
    
    const scrolled = window.scrollY > 300;
    scrollToTopBtn.classList.toggle('visible', scrolled);
}

function initScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (!scrollToTopBtn) return;
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const scrollPosition = window.scrollY + navHeight + 50; // This is where we add some offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    // This is where we check if we're at the very top, highlight home
    if (window.scrollY < 100) {
        current = 'home';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ================================================================
// THIS IS WHERE THE INTERSECTION OBSERVER FOR ANIMATIONS AREA
// ================================================================

// This is where we animate elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // This is where we handle special animations for specific elements
            if (entry.target.classList.contains('stat')) {
                animateCounter(entry.target);
            }
            
            if (entry.target.classList.contains('skill-card')) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.classList.add('animated');

                    // This is where we animate progress bar if it exists
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const percentage = progressBar.getAttribute('data-percentage');
                        const progressFill = progressBar.querySelector('.progress-fill');
                        setTimeout(() => {
                            progressFill.style.width = percentage + '%';
                        }, 300);
                    }
                }, delay);
            }

            // This is where we unobserve the element after animation to prevent re-triggering
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// This is where we observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-card, .stat, .project-card, .about-text, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);

        // This is where we add stable positioning after a delay to prevent scroll jank
        setTimeout(() => {
            el.classList.add('animated-stable');
        }, 2000);
    });
});

// ================================================================
// THIS IS WHERE THE COUNTER ANIMATION FOR STATS AREA
// ================================================================

function animateCounter(element) {
    const target = element.querySelector('h3');
    const targetNumber = parseInt(target.textContent);
    const duration = 2000; // This is where we set the duration to 2 seconds
    const stepTime = 50; // This is where we update every 50ms
    const steps = duration / stepTime;
    const increment = targetNumber / steps;
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }

        // This is where we handle percentage and plus signs
        const originalText = target.textContent;
        if (originalText.includes('%')) {
            target.textContent = Math.floor(current) + '%';
        } else if (originalText.includes('+')) {
            target.textContent = Math.floor(current) + '+';
        } else {
            target.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ================================================================
// THIS IS WHERE THE ENHANCED CONTACT FORM AREA
// ================================================================

const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);

    // This is where we add real-time form validations
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formFields = Object.fromEntries(formData);

    // This is where we validate all fields
    let isValid = true;
    Object.keys(formFields).forEach(field => {
        const input = e.target.querySelector(`[name="${field}"]`);
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // This is where we show loading states
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // This is where we simulate form submissions (replace with actual form handling)
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        showNotification('Please fill out all required fields correctly.', 'error');
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;

    // This is where we remove existing errors
    clearErrors(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // This is where we handle Required field validations
    if (!value) {
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        isValid = false;
    } else {
        // This is where we handle Specific field validations
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearErrors(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
}

// ================================================================
// THIS IS WHERE THE NOTIFICATION SYSTEM AREA IS
// ================================================================

function showNotification(message, type = 'info') {
    // This is where we remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // This is where we add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '300px',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    // This is where we add Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0',
        marginLeft: 'auto'
    });
    
    document.body.appendChild(notification);

    // This is where we handle auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // This is where we handle Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// ================================================================
// THIS IS WHERE THE TYPING ANIMATION FOR HERO SECTION AREA
// ================================================================

function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Full Stack Developer',
        'Creative Problem Solver',
        'Former Carpenter',
        'Code Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // This is where we pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // This is where we pause before starting new text
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// ============================================================
// THIS IS WHERE THE THEME TOGGLE FUNCTIONALITY AREA
// ============================================================

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // This is where we set initial icon based on saved themes
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // This is where we update toggle icon with animations
        const icon = themeToggle.querySelector('i');
        if (icon) {
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
        
        // This is where we show notifications
        showNotification(`Switched to ${newTheme} mode`, 'info');
    });
}

// ============================================================
// THIS IS WHERE THE SKILL PROGRESS BARS ANIMATION AREA
// ============================================================

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        const progressFill = bar.querySelector('.progress-fill');
        
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = percentage + '%';
            }, 500);
        }
    });
}

// ============================================================================================
// THIS IS WHERE THE PARALLAX EFFECT FOR HERO SECTION IS (DISABLED TO PREVENT SCROLL ISSUES)
// ============================================================================================

function initParallaxEffect() {
    // This is where we disable the parallax effect to prevent scrolling issues with other elements
    // This is where we re-enable it later, uncomment the code below:
    
    /*
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
    */
}

// ================================================
// THIS IS WHERE THE LAZY LOADING FOR IMAGES AREA
// ================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================================
// THIS IS WHERE THE COPY TO CLIPBOARD FUNCTIONALITY AREA
// ============================================================

function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Failed to copy to clipboard', 'error');
            });
        });
    });
}

// ==============================================
// THIS IS WHERE WE INITIALIZE ALL FEATURES
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    // This is where we initialize all features
    initTypingAnimation();
    initThemeToggle();
    initParallaxEffect();
    initLazyLoading();
    initCopyToClipboard();
    initScrollToTop();
    initWeatherWidget();
    initProjectFilters();
    initNowPlayingWidget();
    initGitHubActivity();

    // This is where we add custom CSS animations
    addCustomAnimations();

    // This is where we stabilize all animated elements after the page loads
    setTimeout(stabilizeAnimatedElements, 3000);
    
    console.log('🚀 Portfolio website enhanced with JavaScript!');
});

// ==============================================
// THE PROJECT FILTERING FUNCTIONALITY AREA
// ==============================================

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            filterProjects(filterValue, projectCards);
        });
    });
}

function filterProjects(filter, cards) {
    cards.forEach((card, index) => {
        const categories = card.getAttribute('data-category');
        
        // Add delay for staggered animation
        setTimeout(() => {
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                
                // Trigger reflow for animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                // Hide after animation
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        }, index * 50); // Stagger effect
    });
}

// ==========================================================
// THIS IS THE NOW PLAYING / CURRENTLY LEARNING WIDGET AREA
// ==========================================================


function initNowPlayingWidget() {
    const widget = document.querySelector('.now-playing-widget');
    if (!widget) return;
    
    // Activity data - you can customize these
    const activities = [
        { 
            text: 'Learning React', 
            icon: 'fab fa-react', 
            status: 'learning',
            detail: 'Building modern web apps'
        },
        { 
            text: 'Studying Node.js', 
            icon: 'fab fa-node-js', 
            status: 'learning',
            detail: 'Backend development'
        },
        { 
            text: 'Practicing CSS', 
            icon: 'fab fa-css3-alt', 
            status: 'learning',
            detail: 'Advanced animations'
        },
        { 
            text: 'Building Projects', 
            icon: 'fas fa-code', 
            status: 'coding',
            detail: 'Portfolio work'
        },
        { 
            text: 'Reading Docs', 
            icon: 'fas fa-book', 
            status: 'learning',
            detail: 'Expanding knowledge'
        },
        { 
            text: 'Problem Solving', 
            icon: 'fas fa-brain', 
            status: 'coding',
            detail: 'Algorithm challenges'
        }
    ];
    
    let currentIndex = 0;
    
    // Update the widget with current activity
    function updateNowPlaying() {
        const activity = activities[currentIndex];
        const iconElement = widget.querySelector('.now-playing-icon i');
        const textElement = widget.querySelector('.now-playing-text');
        
        // Update content
        iconElement.className = activity.icon;
        textElement.textContent = activity.text;
        
        // Update widget status class
        widget.className = `now-playing-widget ${activity.status} active`;
        
        // Update tooltip
        widget.title = `${activity.text} - ${activity.detail}`;
        
        // Move to next activity
        currentIndex = (currentIndex + 1) % activities.length;
    }
    
    // Initial update
    updateNowPlaying();
    
    // Rotate activities every 10 seconds
    setInterval(updateNowPlaying, 10000);
    
    // Click to manually cycle
    widget.addEventListener('click', () => {
        updateNowPlaying();
        
        // Add click animation
        widget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            widget.style.transform = '';
        }, 150);
    });
    
    console.log('📚 Now Playing widget initialized');
}

// ==========================================================
// THIS IS THE GITHUB ACTIVITY FEED AREA
// ==========================================================

function initGitHubActivity() {
    const username = 'troytoews69-code'; // Your GitHub username
    
    // Fetch user stats
    fetchGitHubStats(username);
    
    // Fetch repositories
    fetchGitHubRepos(username);
    
    // Fetch recent activity
    fetchGitHubActivity(username);
}

async function fetchGitHubStats(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
            const data = await response.json();
            
            document.getElementById('totalRepos').textContent = data.public_repos;
            document.getElementById('totalFollowers').textContent = data.followers;
            
            // Animate the counters
            animateGitHubCounter('totalRepos', data.public_repos);
            animateGitHubCounter('totalFollowers', data.followers);
            
            // Fetch total stars
            fetchTotalStars(username);
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        document.getElementById('totalRepos').textContent = '0';
        document.getElementById('totalFollowers').textContent = '0';
    }
}

async function fetchTotalStars(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (response.ok) {
            const repos = await response.json();
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            document.getElementById('totalStars').textContent = totalStars;
            animateGitHubCounter('totalStars', totalStars);
        }
    } catch (error) {
        console.error('Error fetching stars:', error);
        document.getElementById('totalStars').textContent = '0';
    }
}

async function fetchGitHubRepos(username) {
    const reposList = document.getElementById('reposList');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        if (response.ok) {
            const repos = await response.json();
            
            reposList.innerHTML = '';
            
            repos.forEach(repo => {
                const repoItem = document.createElement('div');
                repoItem.className = 'repo-item';
                repoItem.innerHTML = `
                    <div class="repo-header">
                        <i class="fas fa-folder"></i>
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    </div>
                    <p class="repo-description">${repo.description || 'No description available'}</p>
                    <div class="repo-meta">
                        ${repo.language ? `<span><i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}"></i> ${repo.language}</span>` : ''}
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                `;
                reposList.appendChild(repoItem);
            });
            
            // Estimate total commits (simplified)
            document.getElementById('totalCommits').textContent = repos.length * 15 + '+';
        }
    } catch (error) {
        console.error('Error fetching repos:', error);
        reposList.innerHTML = '<p style="color: #999; text-align: center;">Unable to load repositories</p>';
    }
}

async function fetchGitHubActivity(username) {
    const activityFeed = document.getElementById('activityFeed');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`);
        if (response.ok) {
            const events = await response.json();
            
            activityFeed.innerHTML = '';
            
            events.slice(0, 8).forEach(event => {
                const activityItem = createActivityItem(event);
                if (activityItem) {
                    activityFeed.appendChild(activityItem);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching activity:', error);
        activityFeed.innerHTML = '<p style="color: #999; text-align: center;">Unable to load activity</p>';
    }
}

function createActivityItem(event) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    let icon = 'fas fa-circle';
    let typeText = '';
    let description = '';
    
    switch (event.type) {
        case 'PushEvent':
            icon = 'fas fa-code-branch';
            typeText = 'Pushed commits';
            const commitCount = event.payload.commits ? event.payload.commits.length : 0;
            description = `${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${event.repo.name}`;
            break;
        case 'CreateEvent':
            icon = 'fas fa-plus-circle';
            typeText = 'Created repository';
            description = event.repo.name;
            break;
        case 'WatchEvent':
            icon = 'fas fa-star';
            typeText = 'Starred repository';
            description = event.repo.name;
            break;
        case 'ForkEvent':
            icon = 'fas fa-code-branch';
            typeText = 'Forked repository';
            description = event.repo.name;
            break;
        case 'IssuesEvent':
            icon = 'fas fa-exclamation-circle';
            typeText = event.payload.action + ' issue';
            description = `in ${event.repo.name}`;
            break;
        case 'PullRequestEvent':
            icon = 'fas fa-code-branch';
            typeText = event.payload.action + ' pull request';
            description = `in ${event.repo.name}`;
            break;
        default:
            return null;
    }
    
    const timeAgo = getTimeAgo(new Date(event.created_at));
    
    item.innerHTML = `
        <div class="activity-type"><i class="${icon}"></i> ${typeText}</div>
        <div class="activity-description">${description}</div>
        <div class="activity-time">${timeAgo}</div>
    `;
    
    return item;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584'
    };
    return colors[language] || '#999';
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

function animateGitHubCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 1500;
    const steps = 50;
    const increment = target / steps;
    const stepTime = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===================================================
// THIS IS WHERE TO STABILIZE ANIMATED ELEMENTS AREA
// ===================================================

function stabilizeAnimatedElements() {
    const allAnimatedElements = document.querySelectorAll('.skill-card, .contact-form, .contact-info, .stat');
    
    allAnimatedElements.forEach(element => {
        // This is where we force stable positioning
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        element.style.position = 'relative';
        element.classList.add('animated-stable');

        // This is where we remove any conflicting classes that might cause movement
        element.classList.remove('fade-in');
        element.classList.add('visible');
    });
}

// ========================================================
// THIS IS WHERE TO ADD CUSTOM CSS ANIMATIONS IS LOCATED
// ========================================================

function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .skill-card {
            transform: translateY(30px);
            opacity: 0;
            transition: all 0.6s ease;
        }
        
        .skill-card.visible {
            transform: translateY(0);
            opacity: 1;
        }
        
        .error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
        }
        
        .nav-link.active {
            color: #2d5a27 !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        .typing-text {
            border-right: 2px solid #2d5a27;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: #2d5a27; }
        }
    `;
    
    document.head.appendChild(style);
}

// =============================================================
// THIS IS WHERE PERFORMANCE OPTIMIZATION AREAS ARE LOCATED
// =============================================================

// Debounce function for scroll events
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

// This is the throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// This is where we apply performance optimizations
window.addEventListener('scroll', debounce(() => {
    highlightActiveSection();
}, 100));

window.addEventListener('resize', throttle(() => {
    // This is where we handle resize events
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}, 250));