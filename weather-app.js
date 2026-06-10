// ==============================================
// THIS IS THE WEATHER APP APPLICATION AREA
// ==============================================

class WeatherApp {
    constructor() {
        this.apiKey = 'e119787bc7af44a2a9404145250811';
        this.currentCity = 'Kelowna';
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.loadWeather(this.currentCity);
    }

    cacheDOMElements() {
        // This is the input elements area
        this.citySearch = document.getElementById('citySearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');

        // This is the state elements area
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.weatherContent = document.getElementById('weatherContent');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');

        // This is the weather display elements area
        this.cityName = document.getElementById('cityName');
        this.countryName = document.getElementById('countryName');
        this.localTime = document.getElementById('localTime');
        this.temperature = document.getElementById('temperature');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDesc = document.getElementById('weatherDesc');
        this.feelsLike = document.getElementById('feelsLike');
        this.windSpeed = document.getElementById('windSpeed');
        this.humidity = document.getElementById('humidity');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.uvIndex = document.getElementById('uvIndex');
        this.cloudCover = document.getElementById('cloudCover');

        // This is the forecast containers area
        this.forecastContainer = document.getElementById('forecastContainer');
        this.hourlyContainer = document.getElementById('hourlyContainer');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.locationBtn.addEventListener('click', () => this.getUserLocation());
        this.retryBtn.addEventListener('click', () => this.loadWeather(this.currentCity));
    }

    handleSearch() {
        const city = this.citySearch.value.trim();
        if (city) {
            this.loadWeather(city);
        } else {
            this.showNotification('Please enter a city name', 'error');
        }
    }

    getUserLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.loadWeatherByCoords(lat, lon);
                },
                (error) => {
                    this.showError('Unable to get your location. Please search manually.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            this.showNotification('Geolocation is not supported by your browser', 'error');
        }
    }

    async loadWeather(city) {
        this.showLoading();
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=3&aqi=no`
            );

            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            this.currentCity = city;
            this.displayWeather(data);
            this.showContent();
        } catch (error) {
            this.showError(`Unable to load weather for "${city}". Please check the city name and try again.`);
            console.error('Weather fetch error:', error);
        }
    }

    async loadWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=3&aqi=no`
            );

            if (!response.ok) {
                throw new Error('Location not found');
            }

            const data = await response.json();
            this.currentCity = data.location.name;
            this.displayWeather(data);
            this.showContent();
        } catch (error) {
            this.showError('Unable to load weather for your location.');
            console.error('Weather fetch error:', error);
        }
    }

    displayWeather(data) {
        const { location, current, forecast } = data;

        // This is the update current weather area
        this.cityName.textContent = location.name;
        this.countryName.textContent = `${location.region}, ${location.country}`;
        this.localTime.textContent = `Local time: ${location.localtime}`;
        this.temperature.textContent = Math.round(current.temp_c);
        this.weatherIcon.src = `https:${current.condition.icon}`;
        this.weatherIcon.alt = current.condition.text;
        this.weatherDesc.textContent = current.condition.text;
        this.feelsLike.textContent = Math.round(current.feelslike_c);

        // This is the update weather details area
        this.windSpeed.textContent = `${current.wind_kph} km/h`;
        this.humidity.textContent = `${current.humidity}%`;
        this.pressure.textContent = `${current.pressure_mb} mb`;
        this.visibility.textContent = `${current.vis_km} km`;
        this.uvIndex.textContent = current.uv;
        this.cloudCover.textContent = `${current.cloud}%`;

        // This is the update search input area
        this.citySearch.value = '';

        // This is the display forecast area
        this.displayForecast(forecast.forecastday);

        // This is the display hourly forecast area
        this.displayHourlyForecast(forecast.forecastday[0].hour);

        this.showNotification(`Weather loaded for ${location.name}`, 'success');
    }

    displayForecast(forecastDays) {
        this.forecastContainer.innerHTML = '';

        forecastDays.forEach((day, index) => {
            if (index === 0) return; // Skip today

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <div class="forecast-date" style="font-size: 0.9rem; color: var(--text-secondary);">${dateStr}</div>
                <div class="forecast-icon">
                    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                </div>
                <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</div>
                <div class="forecast-desc">${day.day.condition.text}</div>
                <div class="forecast-details">
                    <div class="forecast-detail">
                        <i class="fas fa-temperature-high"></i>
                        <span>${Math.round(day.day.maxtemp_c)}°C</span>
                    </div>
                    <div class="forecast-detail">
                        <i class="fas fa-temperature-low"></i>
                        <span>${Math.round(day.day.mintemp_c)}°C</span>
                    </div>
                    <div class="forecast-detail">
                        <i class="fas fa-tint"></i>
                        <span>${day.day.avghumidity}%</span>
                    </div>
                </div>
            `;
            this.forecastContainer.appendChild(card);
        });
    }

    displayHourlyForecast(hours) {
        this.hourlyContainer.innerHTML = '';

        const currentHour = new Date().getHours();
        const nextHours = hours.slice(currentHour, currentHour + 12);

        nextHours.forEach(hour => {
            const time = new Date(hour.time);
            const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${timeStr}</div>
                <div class="hourly-icon">
                    <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
                </div>
                <div class="hourly-temp">${Math.round(hour.temp_c)}°C</div>
                <div class="hourly-desc">${Math.round(hour.chance_of_rain)}% rain</div>
            `;
            this.hourlyContainer.appendChild(card);
        });
    }

    showLoading() {
        this.loadingState.classList.add('show');
        this.errorState.classList.remove('show');
        this.weatherContent.classList.remove('show');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorState.classList.add('show');
        this.loadingState.classList.remove('show');
        this.weatherContent.classList.remove('show');
    }

    showContent() {
        this.weatherContent.classList.add('show');
        this.loadingState.classList.remove('show');
        this.errorState.classList.remove('show');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// This is the add notification animations area
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// This is the initialize app when DOM is ready area
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
    console.log('☀️ Weather App initialized');
});
