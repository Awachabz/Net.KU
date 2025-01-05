/**
 * @jest-environment jsdom
 */
const { showSignup, showLogin, signup, login } = require('./script');

describe('User Authentication System', () => {
    let document;

    beforeEach(() => {
        // Mock DOM structure
        document = new DOMParser().parseFromString(`
            <div class="login-container">
                <input type="text" id="username" placeholder="Enter your username">
                <input type="password" id="password" placeholder="Enter your password">
                <div id="error"></div>
            </div>
            <div class="signup-container" id="signup-container" style="display: none;">
                <input type="text" id="signup-username" placeholder="Choose a username">
                <input type="password" id="signup-password" placeholder="Create a password">
                <div id="signup-error"></div>
            </div>
        `, 'text/html');
        global.document = document;
        global.window = document.defaultView;
    });

    afterEach(() => {
        jest.resetModules(); // Reset module state after each test
    });

    test('should switch to sign-up view', () => {
        showSignup();
        expect(document.querySelector('.login-container').style.display).toBe('none');
        expect(document.getElementById('signup-container').style.display).toBe('block');
    });

    test('should switch to login view', () => {
        showSignup(); // Ensure sign-up is visible first
        showLogin();
        expect(document.getElementById('signup-container').style.display).toBe('none');
        expect(document.querySelector('.login-container').style.display).toBe('block');
    });

    test('should show error if username already exists during sign-up', () => {
        document.getElementById('signup-username').value = 'testuser';
        document.getElementById('signup-password').value = 'password123';

        global.users = { testuser: 'password123' }; // Mock existing users

        signup();

        const error = document.getElementById('signup-error').textContent;
        expect(error).toBe('Username already exists.');
    });

    test('should create a new account and switch to login view', () => {
        document.getElementById('signup-username').value = 'newuser';
        document.getElementById('signup-password').value = 'newpassword';

        global.users = {}; // Ensure no existing users

        const mockAlert = jest.spyOn(global, 'alert').mockImplementation(() => {});
        signup();

        expect(global.users.newuser).toBe('newpassword');
        expect(mockAlert).toHaveBeenCalledWith('Account created successfully!');
        expect(document.getElementById('signup-container').style.display).toBe('none');
        expect(document.querySelector('.login-container').style.display).toBe('block');
        mockAlert.mockRestore();
    });

    test('should show error if fields are empty during sign-up', () => {
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';

        signup();

        const error = document.getElementById('signup-error').textContent;
        expect(error).toBe('Please fill out all fields.');
    });

    test('should log in successfully with valid credentials', () => {
        global.users = { testuser: 'password123' }; // Mock existing users

        document.getElementById('username').value = 'testuser';
        document.getElementById('password').value = 'password123';

        const mockAlert = jest.spyOn(global, 'alert').mockImplementation(() => {});
        login();

        expect(mockAlert).toHaveBeenCalledWith('Login successful!');
        mockAlert.mockRestore();
    });

    test('should show error for invalid login credentials', () => {
        global.users = { testuser: 'password123' }; // Mock existing users

        document.getElementById('username').value = 'wronguser';
        document.getElementById('password').value = 'wrongpassword';

        login();

        const error = document.getElementById('error').textContent;
        expect(error).toBe('Invalid username or password.');
    });
});
