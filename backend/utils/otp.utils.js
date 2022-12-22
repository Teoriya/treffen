const crypto = require("crypto");
const fastSMS = process.env.SMS_API_KEY;
const axios = require("axios");

class OtpUtils {
  async generateOtp() {
    return crypto.randomInt(100000, 999999);
  }
  async hashOtp(data) {
    return crypto
      .createHmac("sha256", process.env.OTP_SECRET)
      .update(data)
      .digest("hex");
  }
  async sendOtp(phone, otp) {
    
    const data = JSON.stringify({
      numbers: phone,
      route: "v3",
      message: `${otp}\n\nThis is your OTP for verification. Don't share this OTP with anyone.\n\nTeam Treffen\n`,
    });
    const config = {
      method: "post",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        authorization: fastSMS,
       "Accept-Encoding": "gzip,deflate,compress" ,//idk why some endcoding issue i guess
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };
    try {
      const response = await axios(config);
        if (response.data)//can be a point of failure
          {  
            // console.log(response.data); //idk what format the response is in
            return true;
          }

    } catch (error) {
        console.log ("Fast2SMS API error.",error);
    }
    return false
  }
}

module.exports = new OtpUtils();
