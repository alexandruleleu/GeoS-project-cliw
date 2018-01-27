let users = {
    'stefi': '1234',
    'alex': '1234',
    'george': '1234'
};

const validateUser = (username, password) => {
    return Object.keys(users).map((key) => {
        if (username === key && password === users[key]) {
            return true;
        }
    });
};

export default validateUser;