import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import Loader from '../../../components/shared/Loader/Loader';
import styles from './StepOtp.module.css';
import { verifyOtp } from '../../../http';
import { setAuth } from '../../../store/authSlice'
import { useDispatch, useSelector } from 'react-redux';

const Email = ({ onNext }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { phone, hash, expires } = useSelector(state => state.auth.otp);
    const dispatch = useDispatch();
    async function submit(input) {
        setLoading(true);
        try {
            const finalOtp = input.finalOtp ? input.finalOtp : otp;
            if (!finalOtp || finalOtp.length !== 6) return;
            const { data } = await verifyOtp({ otp:finalOtp, phone, hash, expires });
            dispatch(setAuth(data));
            // console.log(data);
            // onNext();
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }

    }
    const handleOTPFieldChange = async(e) => {
        if (e.target.value.length <= 6 && !isNaN(e.target.value) && e.target.value%1===0) {
            setOtp(() => e.target.value);        
            if (e.target.value.length === 6) {
                submit({finalOtp:e.target.value});
            }
        }
    }
    return (
        loading ? <Loader message={"Verifying OTP..."} /> :
            <div className={styles.cardWrapper}>
                <Card title="Enter The OTP we just sent to you" icon="lock-emoji">
                    <TextInput
                        value={otp}
                        onChange={handleOTPFieldChange}
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
