const TokenModel = require('../models/refresh.model');

class TokenService{
    async findToken({data}){
        try {
            const refreshToken = await TokenModel.findOne(data);
            return refreshToken;
        } catch (error) {
            console.log(error);//better error handling can be implemented later
            return null;
        }
    }

    async storeToken(token, userId){
        try {
            const refreshToken = await TokenModel.create({token, userId});
            return refreshToken;
        } catch (error) {
            console.log(error);//better error handling can be implemented later
            return null;
        }
    }

    async updateToken(token, userId){
        try {
            const refreshToken = await TokenModel.findOneAndUpdate({userId}, {
                token
            });
            return refreshToken;
        } catch (error) {
            console.log(error);//better error handling can be implemented later
            return null;
        }
    }
}

module.exports = new TokenService();