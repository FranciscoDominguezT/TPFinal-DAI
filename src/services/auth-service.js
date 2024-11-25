import AuthRepository from "../repositories/auth-repository.js";
import jwt from "jsonwebtoken";

export default class AuthService {
    loginAsync = async (entity) => {
        const repo = new AuthRepository();
        return await repo.loginAsync(entity);
    }

    registerAsync = async (entity) => {
        const repo = new AuthRepository();

        // Verificar si el usuario ya existe
        const userExists = await repo.checkIfUserExists(entity.username);
        if (userExists) {
            throw new Error('El usuario ya existe.');
        }

        return await repo.registerAsync(entity);
    }

    profileAsync = async (token) => {
        try {
            const secretKey = 'mysecretkey';
            const decoded = jwt.verify(token, secretKey);

            const repo = new AuthRepository();
            return await repo.getUserProfileById(decoded.id);
        } catch (err) {
            throw new Error('Token inválido o error al obtener el perfil.');
        }
    }
}
