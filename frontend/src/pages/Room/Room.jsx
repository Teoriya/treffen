import React from 'react';
import styles from './Room.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
    const navigator = useNavigate();
    function startRegister() {
        // console.log("Button Clicked")
        navigator('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Treffen!" icon="logo">
                <p className={styles.text}>
                    ROOOOOOOOOOOOMMMMMMMMMMMMMMMMMMMMMMM
                </p>
                <div>
                    <Button onClick={startRegister} text="Get Started" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have an invite text?
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Home;
