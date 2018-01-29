const userDetails = {
    'stefi': {
        name: 'Stefania Simon',
        initials: 'SS'
    },
    'alex': {
        name: 'ALexandru Leleu',
        initials: 'AL'
    },
    'george': {
        name: 'George Carbune',
        initials: 'GC'
    }
};

const getUserDetails = username => userDetails[username];

export default getUserDetails;