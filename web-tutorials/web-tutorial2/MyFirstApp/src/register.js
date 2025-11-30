const html = document.documentElement;
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

registerForm.addEventListener('submit', async(event)=> {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const dob = document.getElementById('dob').value;

    registerMessage.textContent = "";

    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match.";
        registerMessage.classList.remove("text-green-500");
        registerMessage.classList.add("text-red-500");
        return;
    }

    try {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.username === username || user.email === email)) {
            registerMessage.textContent = "Username or email already exists.";
            registerMessage.classList.remove("text-green-500");
            registerMessage.classList.add("text-red-500");
            return;
        }

        const role = users.length === 0 ? 'admin' : 'user';

        users.push({ username, email, password, dob, role });

        localStorage.setItem('users', JSON.stringify(users));

        registerMessage.textContent = "Registration successful! (Data stored in local storage)";
        registerMessage.classList.remove("text-red-500");
        registerMessage.classList.add("text-green-500");

        document.getElementById('username').value="";
        document.getElementById('email').value="";
        document.getElementById('password').value="";
        document.getElementById('confirmPassword').value="";
        document.getElementById('dob').value="";

    } catch (error) {
        registerMessage.textContent = "An error occurred during registration.";
        registerMessage.classList.remove("text-green-500");
        registerMessage.classList.add("text-red-500");
    }
})
