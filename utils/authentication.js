// Ensure email is valid
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Ensure password is valid
function verifyPassword(password) {
    if(!password || typeof password !== 'string') 
        return "invalid password"
    if(password <= 5)
        return "password is too short (it should be at least 6 characters)"

    return "password is good"
}

module.exports = {
    validateEmail,
    verifyPassword
}