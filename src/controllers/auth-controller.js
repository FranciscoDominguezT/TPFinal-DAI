import { Router } from "express";
import AuthService from '../services/auth-service.js';
import jwt from "jsonwebtoken";

const router = Router();
const svc = new AuthService();

// Login
router.post('/login', async (req, res) => {
    console.log("Login request received with body:", req.body);

    try {
        const entity = req.body;
        const returnValue = await svc.loginAsync(entity);

        if (returnValue) {
            const secretKey = 'mysecretkey';
            const options = { expiresIn: '1h', issuer: 'dai-eventos' };
            const token = jwt.sign(returnValue, secretKey, options);

            console.log("Generated token:", token);
            res.status(200).json({
                success: true,
                message: 'Login exitoso.',
                token: token
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Usuario o clave inválida.',
                token: ""
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error interno', error: err.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const entity = req.body;

        // Validaciones
        if (typeof entity.first_name !== 'string' || typeof entity.last_name !== 'string' || 
            entity.username.includes('@') || entity.password.length < 3) {
            return res.status(400).send('Error de validación');
        }

        const returnValue = await svc.registerAsync(entity);

        if (returnValue) {
            res.status(201).json(returnValue);
        } else {
            res.status(400).send('Error interno');
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error interno', error: err.message });
    }
});

// Profile
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No se proporcionó un token.' });
    }

    try {
        const userProfile = await svc.profileAsync(token);

        if (userProfile) {
            res.status(200).json({ success: true, user: userProfile });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al procesar la solicitud.', error: err.message });
    }
});

export default router;
