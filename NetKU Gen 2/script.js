const users = {}; // Object to store user accounts

function showSignup() {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const signupError = document.getElementById('signup-error');

    signupError.textContent = '';

    if (username in users) {
        signupError.textContent = 'Username already exists.';
    } else if (username && password) {
        users[username] = password;
        alert('Account created successfully!');
        showLogin();
    } else {
        signupError.textContent = 'Please fill out all fields.';
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    error.textContent = '';

    if (users[username] === password) {
        alert('Login successful!');
    } else {
        error.textContent = 'Invalid username or password.';
    }
}
