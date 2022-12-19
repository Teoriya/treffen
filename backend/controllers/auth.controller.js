const otpUtils = require('../utils/otp.utils');
const jwtUtils = require('../utils/jwt.utils');
const UserService = require('../services/user.service');
const UserDto = require('../dtos/user.dto');

class AuthController{
    async sendOtp(req, res){
        const {phone} = req.body;
        if(!phone || phone.length !== 10 || isNaN(phone)){
            return res.status(400).json({message: '10 Digit Phone number is required'});
        }
        const otp = await otpUtils.generateOtp();
        const otpSent = await otpUtils.sendOtp(phone, otp);  
        const ttl = 5 * 60 * 1000; //5min
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hashedOtp = await otpUtils.hashOtp(data);
        if(otpSent){
            // console.log('OTP sent successfully');
            return res.status(200).json({message: 'OTP sent successfully', hash: hashedOtp, expires: expires, phone: phone});
        }
        else
            return res.status(500).json({message: 'OTP could not be sent'});
    }
    async verifyOtp(req, res){
    
        const {phone, hash ,otp , expires} = req.body;
        if(!phone || phone.length !== 10 || isNaN(phone) || !hash || !otp || !expires){
            return res.status(400).json({message: 'Unexpected phone, hash, otp or expires'});
        }
        if(Date.now() > +expires){
            return res.status(400).json({message: 'OTP expired'});
        }
        const data = `${phone}.${otp}.${expires}`;
        const hashedOtp = await otpUtils.hashOtp(data);
        if(hashedOtp !== hash){
            return res.status(400).json({message: 'OTP is invalid'}); // if expires was tampered this would trigger
        }


        let user = await UserService.getUserByPhoneNumber(phone);
        if(!user){
            user = await UserService.createUser({phone});
            if(!user){
                return res.status(500).json({message: 'Could not create user'});
            }
        }
        const userDto = new UserDto(user);
        //generate jwt token 
        const {accessToken,refreshToken} = jwtUtils.generateTokens({_id: user._id,activated: user.activated});
        res.cookie('refreshToken', refreshToken, {
            maxAge:1000*60*60*24*30 ,
            httpOnly: true, 
        }); //sameSite: 'none', secure: true explore later

        
        res.json({accessToken,userDto});

    
    }


}

module.exports = new AuthController();