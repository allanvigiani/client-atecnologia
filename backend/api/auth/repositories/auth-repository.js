import conn from '../../../connection/connection.js';

class AuthRepository {

    constructor() {
        this.conn = conn;
    }

    async getUserByEmail(userEmail) {

    }

    async getUserSession(userId) {

    }

    async deleteUserSession(sessionId) {

    }

    async deleteUserSessionByUserId(userId) {

    }

    async createUserSession(userId, token) {

    }
    
    async verifyRevogedToken(token) {

    }

}

export default AuthRepository;