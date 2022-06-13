// Ensure email is valid
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Ensure password is valid
function verifyPassword(password) {
    if(!password || typeof password !== "string") 
        return "Invalid password"
    if(password.length <= 5)
        return "Password is too short (it should be at least 6 characters)"

    return "password is good"
}

module.exports = {
    validateEmail,
    verifyPassword
}