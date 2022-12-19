import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import styles from './StepOtp.module.css';
import { verifyOtp } from '../../../http';
import {setAuth} from '../../../store/authSlice'
import { useDispatch, useSelector } from 'react-redux';

const Email = ({ onNext }) => {
    const [otp, setOtp] = useState('');
    const {phone,hash,expires} = useSelector(state => state.auth.otp);
    const dispatch = useDispatch();
    async function submit() {
        try {
            const {data} = await verifyOtp({ otp,phone,hash,expires });
            dispatch(setAuth(data));
            console.log(data);
            // onNext();
        } catch (error) {
            console.log(error);
        }
        
    }
    return (
        <div className={styles.cardWrapper}>
        <Card title="Enter The OTP we just sent to you" icon="lock-emoji">
            <TextInput
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
        </div>
    );
};

export default Email;
