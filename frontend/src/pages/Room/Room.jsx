import React from 'react';
import styles from './Room.module.css';
import { useParams } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import { useSelector } from 'react-redux';
import { useWebRTC } from '../../hooks/useWebRTC';

const Room = () => {
    const { id: roomId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const{ clients,provideRef } = useWebRTC(roomId, user);
            
    return (
        <div className={styles.cardWrapper}>
            <Card title="All Connected clients" icon="logo">
                {
                    clients.map((client) => {
                        return <div key={client._id}><audio controls autoPlay ref={ (i) => provideRef(i,client._id)} />{client.name}</div>
                    }
                    )
                }
            </Card>
        </div>
    );
};

export default Room;
