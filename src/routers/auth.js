// src/routers/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Modelo de usuário deve estar corretamente configurado
const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Comparando senhas
        const isMatch = user.password === password; // Para produção, use bcrypt

        if (!isMatch) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        // Geração do token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
});

module.exports = router;
