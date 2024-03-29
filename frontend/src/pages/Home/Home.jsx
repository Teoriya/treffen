import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
    const navigatorReact = useNavigate();
    function startRegister() {
        // console.log("Button Clicked")
        navigatorReact('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Treffen!" icon="logo">
                <p className={styles.text}>
                    We’re working hard to get Treffen ready for everyone!
                    While we wrap up the finishing touches, we’re adding people
                    gradually to make sure nothing breaks
                </p>
                <div>
                    <Button onClick={startRegister} text="Get Started" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have a phone number? Try it Out.
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Home;
