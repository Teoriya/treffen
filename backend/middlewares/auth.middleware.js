const jwtUtils = require('../utils/jwt.utils');

module.exports = async function (req,res,next){
    try {
        
        const {accessToken} = req.cookies;
        // console.log(accessToken)
        if(!accessToken){
            throw new Error('Access token not found');
        }
        const userData = await jwtUtils.verifyAccessToken(accessToken);
        if(!userData){
            throw new Error('Invalid access token');
        }
        req.user = userData;
        next();
    } catch (error) {
        res.status(401).json({message: error.message});
    }
} 