import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Loader from '../../../components/shared/Loader/Loader';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Avatar from 'react-avatar';

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false);
    function captureImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }
    async function submit() {
        if(!name )return;
        setLoading(true);
        try {
            
            const { data } = await activate({ name, avatar });
            if (data.auth) {
                dispatch(setAuth(data));
            }
            // console.log(data);
        } catch (err) {
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }
    return (
        loading?<Loader message={"Activating your account..."} />:
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    {image==="/images/monkey-avatar.png"?<Avatar
                        className={styles.avatarImage}
                        name={name}
                    />:
                    <img  className={styles.avatarImage}
                    name={name} src={image} alt="speakar-av"/>}
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
