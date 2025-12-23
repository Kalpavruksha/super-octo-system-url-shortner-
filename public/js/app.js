// API Base URL
const API_BASE = 'http://localhost:3000/api';

// State Management
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// DOM Elements
const authModal = document.getElementById('authModal');
const createUrlModal = document.getElementById('createUrlModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const guestShortener = document.getElementById('guestShortener');
const navLinks = document.getElementById('navLinks');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    if (authToken) {
        try {
            await loadCurrentUser();
            showDashboard();
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        }
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('loginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });

    document.getElementById('registerBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterModal();
    });

    // Modal Controls
    document.getElementById('closeModal').addEventListener('click', closeAuthModal);
    document.getElementById('closeCreateModal').addEventListener('click', closeCreateUrlModal);
    document.querySelector('#authModal .modal-overlay').addEventListener('click', closeAuthModal);
    document.querySelector('#createUrlModal .modal-overlay').addEventListener('click', closeCreateUrlModal);

    // Auth Form Switching
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Form Submissions
    document.getElementById('loginFormSubmit').addEventListener('submit', handleLogin);
    document.getElementById('registerFormSubmit').addEventListener('submit', handleRegister);
    document.getElementById('shortenForm').addEventListener('submit', handleGuestShorten);
    document.getElementById('createUrlForm').addEventListener('submit', handleCreateUrl);

    // Dashboard
    const createNewBtn = document.getElementById('createNewBtn');
    if (createNewBtn) {
        createNewBtn.addEventListener('click', () => {
            openCreateUrlModal();
        });
    }

    // Copy Button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopy);
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);

            showToast('Login successful!', 'success');
            closeAuthModal();
            showDashboard();
            await loadUserUrls();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);

            showToast('Account created successfully!', 'success');
            closeAuthModal();
            showDashboard();
            await loadUserUrls();
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'error');
    }
}

async function loadCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    const data = await response.json();

    if (data.success) {
        currentUser = data.data;
    } else {
        throw new Error('Failed to load user');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');

    // Update UI
    dashboard.style.display = 'none';
    guestShortener.style.display = 'block';

    // Reset nav links
    navLinks.innerHTML = `
        <a href="#features">Features</a>
        <a href="#" id="loginBtn">Login</a>
        <button class="btn-primary" id="registerBtn">Get Started</button>
    `;

    // Re-attach event listeners
    document.getElementById('loginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });
    document.getElementById('registerBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterModal();
    });

    showToast('Logged out successfully', 'success');
}

// URL Management Functions
async function handleGuestShorten(e) {
    e.preventDefault();

    const originalUrl = document.getElementById('urlInput').value;

    try {
        const response = await fetch(`${API_BASE}/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalUrl })
        });

        const data = await response.json();

        if (data.success) {
            displayShortUrl(data.data.shortUrl);
            showToast('URL shortened successfully!', 'success');
        } else {
            showToast(data.error || 'Failed to shorten URL', 'error');
        }
    } catch (error) {
        console.error('Shorten error:', error);
        showToast('Failed to shorten URL. Please try again.', 'error');
    }
}

async function handleCreateUrl(e) {
    e.preventDefault();

    const originalUrl = document.getElementById('createOriginalUrl').value;
    const customAlias = document.getElementById('createCustomAlias').value;
    const expiryDays = document.getElementById('createExpiryDays').value;
    const description = document.getElementById('createDescription').value;

    const body = { originalUrl };
    if (customAlias) body.customAlias = customAlias;
    if (expiryDays) body.expiryDays = parseInt(expiryDays);
    if (description) body.description = description;

    try {
        const response = await fetch(`${API_BASE}/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success) {
            showToast('URL created successfully!', 'success');
            closeCreateUrlModal();
            document.getElementById('createUrlForm').reset();
            await loadUserUrls();
        } else {
            showToast(data.error || 'Failed to create URL', 'error');
        }
    } catch (error) {
        console.error('Create URL error:', error);
        showToast('Failed to create URL. Please try again.', 'error');
    }
}

async function loadUserUrls() {
    try {
        const response = await fetch(`${API_BASE}/urls`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayUserUrls(data.data);
        } else {
            showToast('Failed to load URLs', 'error');
        }
    } catch (error) {
        console.error('Load URLs error:', error);
        showToast('Failed to load URLs', 'error');
    }
}

async function deleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this URL?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/urls/${shortCode}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            showToast('URL deleted successfully', 'success');
            await loadUserUrls();
        } else {
            showToast(data.error || 'Failed to delete URL', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete URL', 'error');
    }
}

async function viewAnalytics(shortCode) {
    try {
        const response = await fetch(`${API_BASE}/urls/${shortCode}/analytics`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayAnalytics(data.data);
        } else {
            showToast(data.error || 'Failed to load analytics', 'error');
        }
    } catch (error) {
        console.error('Analytics error:', error);
        showToast('Failed to load analytics', 'error');
    }
}

// UI Functions
function showDashboard() {
    dashboard.style.display = 'block';
    guestShortener.style.display = 'none';

    // Update nav links
    navLinks.innerHTML = `
        <a href="#dashboard">Dashboard</a>
        <span style="color: var(--text-secondary);">Welcome, ${currentUser.username}</span>
        <button class="btn-primary" onclick="logout()">Logout</button>
    `;

    loadUserUrls();
}

function displayShortUrl(shortUrl) {
    const resultDisplay = document.getElementById('resultDisplay');
    const shortUrlResult = document.getElementById('shortUrlResult');

    shortUrlResult.value = shortUrl;
    resultDisplay.style.display = 'block';
}

function displayUserUrls(urls) {
    const urlsList = document.getElementById('urlsList');

    if (urls.length === 0) {
        urlsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>No URLs yet. Create your first short link!</p>
            </div>
        `;
        return;
    }

    urlsList.innerHTML = urls.map(url => `
        <div class="url-card">
            <div class="url-card-header">
                <div class="url-info">
                    <h3>${url.shortUrl}</h3>
                    <p class="url-original">${url.originalUrl}</p>
                    ${url.description ? `<p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">${url.description}</p>` : ''}
                </div>
                <div class="url-actions">
                    <button class="btn-icon" onclick="copyToClipboard('${url.shortUrl}')" title="Copy">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="viewAnalytics('${url.shortCode}')" title="Analytics">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2 12L8 6L12 10L18 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="deleteUrl('${url.shortCode}')" title="Delete">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 6H16M14 6V16C14 16.5304 13.7893 17.0391 13.4142 17.4142C13.0391 17.7893 12.5304 18 12 18H8C7.46957 18 6.96086 17.7893 6.58579 17.4142C6.21071 17.0391 6 16.5304 6 16V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2C10.5304 2 11.0391 2.21071 11.4142 2.58579C11.7893 2.96086 12 3.46957 12 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="url-card-stats">
                <div class="stat-box">
                    <div class="stat-box-label">Total Clicks</div>
                    <div class="stat-box-value">${url.clickCount}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Created</div>
                    <div class="stat-box-value" style="font-size: 1rem;">${formatDate(url.createdAt)}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Status</div>
                    <div class="stat-box-value" style="font-size: 1rem;">
                        ${url.isExpired ? '<span style="color: #f5576c;">Expired</span>' :
            url.isActive ? '<span style="color: #43e97b;">Active</span>' :
                '<span style="color: #ffa500;">Inactive</span>'}
                    </div>
                </div>
                ${url.expiresAt ? `
                <div class="stat-box">
                    <div class="stat-box-label">Expires</div>
                    <div class="stat-box-value" style="font-size: 1rem;">${formatDate(url.expiresAt)}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function displayAnalytics(data) {
    const analyticsHtml = `
        <div class="analytics-modal">
            <h3>Analytics for ${data.url.shortUrl}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${data.url.originalUrl}</p>
            
            <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-box">
                    <div class="stat-box-label">Total Clicks</div>
                    <div class="stat-box-value">${data.analytics.totalClicks}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Last 24 Hours</div>
                    <div class="stat-box-value">${data.analytics.clicksLast24h}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Last 7 Days</div>
                    <div class="stat-box-value">${data.analytics.clicksLast7d}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Last 30 Days</div>
                    <div class="stat-box-value">${data.analytics.clicksLast30d}</div>
                </div>
            </div>
            
            ${data.analytics.topReferrers.length > 0 ? `
                <h4 style="margin-bottom: 1rem;">Top Referrers</h4>
                <div style="margin-bottom: 2rem;">
                    ${data.analytics.topReferrers.map(ref => `
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-card); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                            <span>${ref.referrer}</span>
                            <span style="font-weight: 600;">${ref.count}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${data.analytics.recentClicks.length > 0 ? `
                <h4 style="margin-bottom: 1rem;">Recent Clicks</h4>
                <div>
                    ${data.analytics.recentClicks.map(click => `
                        <div style="padding: 0.5rem; background: var(--bg-card); border-radius: 0.5rem; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            <div style="color: var(--text-secondary);">${formatDateTime(click.timestamp)}</div>
                            <div style="color: var(--text-muted); font-size: 0.75rem;">${click.referrer} • ${click.userAgent?.substring(0, 50) || 'Unknown'}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    // Create a temporary modal for analytics
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 800px;">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            ${analyticsHtml}
        </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// Modal Functions
function showLoginModal() {
    authModal.classList.add('active');
    showLoginForm();
}

function showRegisterModal() {
    authModal.classList.add('active');
    showRegisterForm();
}

function closeAuthModal() {
    authModal.classList.remove('active');
}

function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function openCreateUrlModal() {
    createUrlModal.classList.add('active');
}

function closeCreateUrlModal() {
    createUrlModal.classList.remove('active');
}

// Utility Functions
function handleCopy() {
    const shortUrlResult = document.getElementById('shortUrlResult');
    shortUrlResult.select();
    document.execCommand('copy');
    showToast('Copied to clipboard!', 'success');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}
