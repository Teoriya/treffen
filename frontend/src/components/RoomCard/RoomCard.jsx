import React from 'react';
import styles from './RoomCard.module.css';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();
    function goToRoom() {
        navigate(`/room/${room.id}`);
    }
    return (
        <div className={styles.card} key={room.id} onClick={goToRoom}>
            <h3 className={styles.topic}>{room.topic}</h3>
            <div
                className={`${styles.speakers} ${
                    room.speakers.length === 1 ? styles.singleSpeaker : ''
                }`}
            >
                <div className={styles.avatars}>
                    {room.speakers.map((speaker) => (
                         speaker.avatar?<img
                         className={styles.avatarImg}
                         key={speaker._id}
                         src={speaker.avatar}
                         alt="speaker-avatar"
                     />:<Avatar name={speaker.name } className={styles.avatarImg} size="40px" round="20px" key={speaker._id}/>
                     //The react avatar would break on multiple speakers keep that in mind :P
                    ))}
                </div>
                <div className={styles.names}>
                    {room.speakers.map((speaker) => (
                        <div key={speaker._id} className={styles.nameWrapper}>
                            <span>{speaker.name}</span>
                            <img
                                src="/images/chat-bubble.png"
                                alt="chat-bubble"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.peopleCount}>
                <span>{room.totalPeople}</span>
                <img src="/images/user-icon.png" alt="user-icon" />
            </div>
        </div>
    );
};

export default RoomCard;