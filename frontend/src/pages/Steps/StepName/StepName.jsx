import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../../store/activateSlice';
import styles from './StepName.module.css';
import { toast } from 'react-hot-toast';
const StepName = ({ onNext }) => {
    const { name } = useSelector((state) => state.activate);
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState(name);

    function nextStep() {
        if (!fullname) {
            return toast.error("Please enter your full name.");
        }
        dispatch(setName(fullname));
        onNext();
    }
    return (
        <>
            <Card title="What’s your full name?" icon="goggle-emoji">
                <TextInput
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    onKeyUp={(e) => { if (e.code === 'Enter') { nextStep() } }}
                />
                <p className={styles.paragraph}>
                    People use real names at Treffen :) !
                </p>
                <div>
                    <Button onClick={nextStep} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepName;
