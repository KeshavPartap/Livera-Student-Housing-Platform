// auth.js
function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword');
    
    // Password confirmation check (only in signup mode)
    if (confirmPassword && confirmPassword.parentElement.style.display !== 'none') {
        if (password !== confirmPassword.value) {
            document.getElementById('passwordMismatch').style.display = 'block';
            confirmPassword.style.borderColor = '#ef4444';
            return;
        }
        document.getElementById('passwordMismatch').style.display = 'none';
        confirmPassword.style.borderColor = '';
    }

    // Password strength check
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // Save user credentials to localStorage for login
    const users = JSON.parse(localStorage.getItem('livera_users') || '{}');
    if (users[email]) {
        alert('An account with this email already exists. Please log in instead.');
        return;
    }
    users[email] = { password: password, role: null, createdAt: new Date().toISOString() };
    localStorage.setItem('livera_users', JSON.stringify(users));
    
    // Save current session
    localStorage.setItem('user', JSON.stringify({ email: email, role: null }));
    
    // Hide auth, show onboarding
    document.getElementById('authWrapper').style.display = 'none';
    const onboarding = document.getElementById('onboardingScreen');
    onboarding.style.display = 'flex';
    onboarding.style.opacity = '0';
    setTimeout(() => {
        onboarding.style.transition = 'opacity 0.6s ease';
        onboarding.style.opacity = '1';
    }, 50);
}

function handleGoogleAuth() {
    // Disabled — OAuth not connected
    alert('Google Sign-In is coming soon. Please use email and password to sign up.');
}

function selectRole(role) {
    const user = JSON.parse(localStorage.getItem('user')) || { email: '', role: null };
    
    // Save role
    user.role = role; 
    localStorage.setItem('user', JSON.stringify(user));

    // Also update in users store
    const users = JSON.parse(localStorage.getItem('livera_users') || '{}');
    if (users[user.email]) {
        users[user.email].role = role;
        localStorage.setItem('livera_users', JSON.stringify(users));
    }
    
    routeUser();
}

function routeUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        if(window.location.pathname.indexOf('login.html') === -1) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    if (user.role === 'student') {
        window.location.href = 'explore.html'; // Student Demand Side
    } else if (user.role === 'lister') {
        window.location.href = 'dashboard.html'; // Lister Supply Side
    }
}

// Check role on load for the login page
document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.indexOf('login.html') !== -1) {
        const userStr = localStorage.getItem('user');
        if(userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.role) {
                    routeUser(); // Redirect to their perspective dashboard
                } else if (user && !user.role) {
                    // They signed up but refreshed before picking a role
                    document.getElementById('authWrapper').style.display = 'none';
                    document.getElementById('onboardingScreen').style.display = 'flex';
                }
            }catch(e){}
        }
    }
});
