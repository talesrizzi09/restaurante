const User = require('../model/user');
const jwt = require('jsonwebtoken');


async function register(req, res) {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
}


async function login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Credenciais inválidas!' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ auth: true, token });
}

module.exports = { register, login };
