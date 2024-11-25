import jwt from 'jsonwebtoken';

const secretKey = 'mysecretkey';

const validateToken = async(req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const payload = await jwt.verify(token, secretKey);
      // Asegurémonos de que el payload tenga el id del usuario
      if (!payload.id) {
        return res.status(401).json({ error: 'Token inválido: falta id de usuario' });
      }
      req.user = {
        id: payload.id
      };
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } else {
    return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
  }
}

export default {
  validateToken,
};