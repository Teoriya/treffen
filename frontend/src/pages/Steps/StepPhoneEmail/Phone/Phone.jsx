
import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';
import { toast } from 'react-hot-toast';

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();
    async function submit() {
        try {
            if(phoneNumber.length !==10 && !isNaN(phoneNumber) && phoneNumber%1===0)return toast.error('Invalid Phone Number') ;
            const {data} = await sendOtp({ phone: phoneNumber });
            toast.success("OTP sent successfully.")
            // console.log(data)
            dispatch(setOtp({ phone: data.phone, hash: data.hash ,expires: data.expires}));
            onNext();
            
        } catch (error) {
            toast.error(`Invalid Phone Number`) 
        } 
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            submit();
        }
    };

    return (
        <Card title="Enter you phone number" icon="phone">
            <TextInput
                value={phoneNumber}
                onChange={(e) => {if(e.target.value.length <= 10 && !isNaN(e.target.value) && e.target.value%1===0)setPhoneNumber(e.target.value)}}
                onKeyUp={handleInputEnter}
                
            />
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={submit} />
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your number, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Phone;
