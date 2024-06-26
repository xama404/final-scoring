document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    // Get open modal buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Get close buttons
    const closeBtns = document.getElementsByClassName('close');
    
    // Event listeners for opening modals
    loginBtn.addEventListener('click', function() {
        console.log('Login button clicked');
        loginModal.style.display = 'block';
    });
    
    registerBtn.addEventListener('click', function() {
        console.log('Register button clicked');
        registerModal.style.display = 'block';
    });
    
    // Event listeners for closing modals
    for (let i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener('click', function() {
            console.log('Close button clicked');
            this.parentElement.parentElement.style.display = 'none';
        });
    }
    
    // Handle form submission for login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        console.log('Email:', email, 'Password:', password);

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => {
            console.log('Login response received');
            return response.json();
        })
        .then(data => {
            console.log('Login response data:', data);
            if (data.message === 'Login successful!') {
                window.location.href = '/add-data';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
        });
    });

    // Handle form submission for registration
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Register form submitted');
        var email = document.getElementById('regEmail').value;
        var password = document.getElementById('regPassword').value;
        console.log('Email:', email, 'Password:', password);

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => {
            console.log('Register response received');
            return response.json();
        })
        .then(data => {
            console.log('Register response data:', data);
            alert(data.message);
            registerModal.style.display = "none";
        })
        .catch((error) => {
            console.error('Register error:', error);
        });
    });
});
