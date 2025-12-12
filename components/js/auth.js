// Authentication functionality
function initAuth() {
    const authModal = document.getElementById('authModal');
    const userIcon = document.getElementById('user-icon');
    const authClose = document.querySelector('.auth-close');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');

    if (!authModal || !userIcon) return;

    // Open auth modal
    function openAuthModal() {
        authModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Reset to login tab
        switchTab('login');
    }

    // Close auth modal
    function closeAuthModal() {
        authModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Switch between login and signup tabs
    function switchTab(tabName) {
        authTabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        if (tabName === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        }
    }

    // Handle tab clicks
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Handle login form submission
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Save current user
                const currentUser = {
                    email: user.email,
                    name: user.name,
                    rememberMe: rememberMe
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show success message
                showAuthNotification('Successfully logged in!', 'success');
                closeAuthModal();
                
                // Update UI to show logged in state
                updateUserIcon(true);
            } else {
                showAuthNotification('Invalid email or password', 'error');
            }
        });
    }

    // Handle signup form submission
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                showAuthNotification('Passwords do not match', 'error');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.find(u => u.email === email)) {
                showAuthNotification('Email already registered', 'error');
                return;
            }

            // Add new user
            const newUser = {
                name: name,
                email: email,
                password: password
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login
            const currentUser = {
                email: email,
                name: name,
                rememberMe: false
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Show success message
            showAuthNotification('Account created successfully!', 'success');
            closeAuthModal();
            
            // Update UI to show logged in state
            updateUserIcon(true);
        });
    }

    // Show notification
    function showAuthNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'auth-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Update user icon based on login state
    function updateUserIcon(isLoggedIn) {
        if (isLoggedIn) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (currentUser) {
                userIcon.classList.add('logged-in');
                userIcon.title = `Logged in as ${currentUser.name}`;
            }
        } else {
            userIcon.classList.remove('logged-in');
            userIcon.title = 'Login / Sign Up';
        }
    }

    // Check if user is logged in on page load
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        updateUserIcon(true);
    }

    // Add logout functionality (click when logged in)
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            // Show logout confirmation
            if (confirm(`Logout from ${currentUser.name}?`)) {
                localStorage.removeItem('currentUser');
                updateUserIcon(false);
                showAuthNotification('Logged out successfully', 'success');
            }
        } else {
            openAuthModal();
        }
    });

    // Close modal events
    if (authClose) {
        authClose.addEventListener('click', closeAuthModal);
    }

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('show')) {
            closeAuthModal();
        }
    });
}

