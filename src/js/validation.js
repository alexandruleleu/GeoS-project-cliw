let users = {
    'stefi': '1234',
    'alex': '1234',
    'george': '1234'
};

const validateUser = (username, password) => {
    let found = false;
    Object.keys(users).map((key) => {
        if (username === key && password === users[key]) {
            found = true;
        }
    });
    return found;
};

export default validateUser;