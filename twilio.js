const accountSid = 'ACdc931f028e2a1b0d05a36e1eca67b2fb'; // Substitua com suas credenciais
const authToken = '3abac777aa984cc88d024825f6dce992'; // Substitua com suas credenciais
const client = require('twilio')(accountSid, authToken);

module.exports = { client };