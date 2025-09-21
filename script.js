// Application State
let currentUser = null;
let currentRole = null;
let activeBus = null;
let tripStartTime = null;
let tripTimer = null;
let locationUpdateTimer = null;

// Mock data for demonstration
const mockLocations = [
    'Main Street & 2nd Avenue',
    'City Center Bus Stop',
    'University Campus - Gate A',
    'Shopping Mall Entrance',
    'Central Park East',
    'Hospital District',
    'Railway Station Plaza'
];

const mockBuses = {
    'CT-1234': { active: true, location: 'Main Street & 2nd Avenue' },
    'CT-5678': { active: true, location: 'University Campus - Gate A' },
    'CT-9012': { active: false, location: 'Bus Depot' }
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    driverLogin: document.getElementById('driverLogin'),
    passengerLogin: document.getElementById('passengerLogin'),
    driverDashboard: document.getElementById('driverDashboard'),
    driverTracking: document.getElementById('driverTracking'),
    passengerSearch: document.getElementById('passengerSearch'),
    busResults: document.getElementById('busResults')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showScreen('welcome');
    updateHeader();
}

function setupEventListeners() {
    // Role selection
    document.getElementById('driverBtn').addEventListener('click', () => {
        currentRole = 'driver';
        showScreen('driverLogin');
    });

    document.getElementById('passengerBtn').addEventListener('click', () => {
        currentRole = 'passenger';
        showScreen('passengerLogin');
    });

    // Back to welcome buttons
    document.getElementById('backToWelcome1').addEventListener('click', () => {
        currentRole = null;
        showScreen('welcome');
    });

    document.getElementById('backToWelcome2').addEventListener('click', () => {
        currentRole = null;
        showScreen('welcome');
    });

    // Login forms
    document.getElementById('driverLoginForm').addEventListener('submit', handleDriverLogin);
    document.getElementById('passengerLoginForm').addEventListener('submit', handlePassengerLogin);

    // Bus registration form
    document.getElementById('busRegistrationForm').addEventListener('submit', handleBusRegistration);

    // Bus search form
    document.getElementById('busSearchForm').addEventListener('submit', handleBusSearch);

    // Stop trip button
    document.getElementById('stopTripBtn').addEventListener('click', stopTrip);

    // Search another bus button
    document.getElementById('searchAnotherBtn').addEventListener('click', () => {
        showScreen('passengerSearch');
        document.getElementById('busSearchForm').reset();
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });

    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

function updateHeader() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (currentUser) {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
}

function handleDriverLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('driverEmail').value;
    const password = document.getElementById('driverPassword').value;
    
    // Mock authentication
    if (email && password) {
        currentUser = {
            email: email,
            role: 'driver',
            name: email.split('@')[0]
        };
        
        showScreen('driverDashboard');
        updateHeader();
        
        // Clear form
        document.getElementById('driverLoginForm').reset();
    }
}

function handlePassengerLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('passengerEmail').value;
    const password = document.getElementById('passengerPassword').value;
    
    // Mock authentication
    if (email && password) {
        currentUser = {
            email: email,
            role: 'passenger',
            name: email.split('@')[0]
        };
        
        showScreen('passengerSearch');
        updateHeader();
        
        // Clear form
        document.getElementById('passengerLoginForm').reset();
    }
}

function handleBusRegistration(e) {
    e.preventDefault();
    
    const busNumber = document.getElementById('busNumber').value.toUpperCase();
    
    if (busNumber) {
        activeBus = busNumber;
        tripStartTime = new Date();
        
        // Update tracking screen
        document.getElementById('activeBusNumber').textContent = busNumber;
        
        // Start trip tracking
        startTrip();
        showScreen('driverTracking');
        
        // Clear form
        document.getElementById('busRegistrationForm').reset();
    }
}

function startTrip() {
    // Start trip timer
    tripTimer = setInterval(updateTripDuration, 1000);
    
    // Start location updates
    updateLocation();
    locationUpdateTimer = setInterval(updateLocation, 5000); // Update every 5 seconds
    
    // Mark bus as active in mock data
    if (!mockBuses[activeBus]) {
        mockBuses[activeBus] = { active: true, location: mockLocations[0] };
    } else {
        mockBuses[activeBus].active = true;
    }
}

function updateTripDuration() {
    if (!tripStartTime) return;
    
    const now = new Date();
    const diff = now - tripStartTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('tripDuration').textContent = duration;
}

function updateLocation() {
    // Simulate GPS location updates
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    document.getElementById('currentLocation').textContent = randomLocation;
    
    // Update mock data
    if (mockBuses[activeBus]) {
        mockBuses[activeBus].location = randomLocation;
    }
}

function stopTrip() {
    // Clear timers
    if (tripTimer) {
        clearInterval(tripTimer);
        tripTimer = null;
    }
    
    if (locationUpdateTimer) {
        clearInterval(locationUpdateTimer);
        locationUpdateTimer = null;
    }
    
    // Mark bus as inactive
    if (mockBuses[activeBus]) {
        mockBuses[activeBus].active = false;
    }
    
    // Reset trip data
    activeBus = null;
    tripStartTime = null;
    
    // Return to dashboard
    showScreen('driverDashboard');
}

function handleBusSearch(e) {
    e.preventDefault();
    
    const busNumber = document.getElementById('searchBusNumber').value.toUpperCase();
    
    if (busNumber) {
        // Check if bus exists and is active
        const busData = mockBuses[busNumber];
        
        if (busData && busData.active) {
            // Update results screen
            document.getElementById('resultsBusNumber').textContent = busNumber;
            document.getElementById('busLocation').textContent = busData.location;
            document.getElementById('busStatus').textContent = 'Active';
            document.getElementById('busStatus').className = 'status-badge active';
            
            // Start live updates for passenger view
            startPassengerUpdates(busNumber);
            
            showScreen('busResults');
        } else {
            alert('Bus not found or not currently active. Please check the registration number.');
        }
        
        // Clear form
        document.getElementById('busSearchForm').reset();
    }
}

function startPassengerUpdates(busNumber) {
    // Update bus location every 10 seconds for passengers
    const passengerUpdateTimer = setInterval(() => {
        const busData = mockBuses[busNumber];
        if (busData && busData.active) {
            document.getElementById('busLocation').textContent = busData.location;
            updateArrivalTimes();
        } else {
            // Bus is no longer active
            document.getElementById('busStatus').textContent = 'Inactive';
            document.getElementById('busStatus').className = 'status-badge inactive';
            clearInterval(passengerUpdateTimer);
        }
    }, 10000);
    
    // Store timer reference for cleanup
    window.currentPassengerTimer = passengerUpdateTimer;
}

function updateArrivalTimes() {
    // Simulate changing arrival times
    const stopItems = document.querySelectorAll('.stop-item .arrival-time');
    const baseTimes = [3, 8, 15]; // Base arrival times in minutes
    
    stopItems.forEach((item, index) => {
        if (baseTimes[index]) {
            // Add some randomness to simulate real-time updates
            const variation = Math.floor(Math.random() * 3) - 1; // -1 to +1 minutes
            const newTime = Math.max(1, baseTimes[index] + variation);
            item.textContent = `Arrives in ${newTime} minute${newTime !== 1 ? 's' : ''}`;
        }
    });
}

function logout() {
    // Clear any active timers
    if (tripTimer) {
        clearInterval(tripTimer);
        tripTimer = null;
    }
    
    if (locationUpdateTimer) {
        clearInterval(locationUpdateTimer);
        locationUpdateTimer = null;
    }
    
    if (window.currentPassengerTimer) {
        clearInterval(window.currentPassengerTimer);
        window.currentPassengerTimer = null;
    }
    
    // Mark current bus as inactive if driver was tracking
    if (activeBus && mockBuses[activeBus]) {
        mockBuses[activeBus].active = false;
    }
    
    // Reset application state
    currentUser = null;
    currentRole = null;
    activeBus = null;
    tripStartTime = null;
    
    // Reset UI
    showScreen('welcome');
    updateHeader();
    
    // Clear all forms
    document.querySelectorAll('form').forEach(form => form.reset());
}

// Utility function to simulate network delay
function simulateNetworkDelay(callback, delay = 1000) {
    setTimeout(callback, delay);
}

// Handle browser refresh/close - cleanup
window.addEventListener('beforeunload', () => {
    if (activeBus && mockBuses[activeBus]) {
        mockBuses[activeBus].active = false;
    }
});

// Handle screen visibility changes (for mobile)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, you might want to pause some updates
    } else {
        // Page is visible, resume updates if needed
        if (currentUser && currentUser.role === 'passenger' && screens.busResults.classList.contains('active')) {
            const busNumber = document.getElementById('resultsBusNumber').textContent;
            if (busNumber && mockBuses[busNumber]) {
                updateArrivalTimes();
            }
        }
    }
});