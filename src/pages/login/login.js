import '../../css/main.css';
import validateUser from '../../js/validation';

const submit = (name, password) => {
    if(validateUser(name, password)) {
        localStorage.setItem('username', name);
        window.location.pathname = '/dashboard.html';
    } else showErrorMessage('error');
};

const showErrorMessage = (type) => {
    const errorField = document.getElementById('error');
    errorField.style.display = 'block';
    switch(type) {
        case 'empty': errorField.innerHTML = 'Please fill in all fields';
        break;
        case 'error': errorField.innerHTML = 'Incorrect name or password';
        break;
        default: null;
    }
};

window.onload = () => {
    document.getElementById('error').style.display = 'none';
    document.getElementById('login').onclick = () => {
        let name = document.getElementById('name').value;
        let password = document.getElementById('password').value;
        name && password ? submit(name,password) : showErrorMessage('empty');
    }
};

