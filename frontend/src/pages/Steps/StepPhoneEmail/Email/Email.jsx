import React,{useEffect} from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { toast } from 'react-hot-toast';

const Email = ({ onNext }) => {
    // const [email, setEmail] = useState('');
    useEffect(() => {
        toast.error("We don't support email logins as of now.")
        return () => {
        };
    }, []);
    return (
        <Card title="Enter your email id" icon="email-emoji">
            <TextInput
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                disabled={true}
            />
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next"  disabled={true}/>
                </div>
                <p className={styles.bottomParagraph}>
                    We don't support email logins as of now.
                </p>
            </div>
        </Card>
    );
};

export default Email;
