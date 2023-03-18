import React, { useState } from "react";
import Avatar from "react-avatar";
import styles from "./ClientsList.module.css";
import { useSelector } from 'react-redux';

const ClientsList = ({ clients, provideRef, handleMute }) => {
    const [mute, setMute] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const handleMuteClick = (clientId) => {
        if(clientId !== user._id)return; 
        handleMute(user._id,!mute);
        setMute(!mute);
    }
    return (
        <div className={styles.clientsList}>
            {clients.map((client) => {
                return (
                    <div className={styles.client} key={client._id}>
                        <div className={styles.userHead}>
                            {client.avatar ? <img
                                className={styles.userAvatar}
                                src={client.avatar}
                                alt="av-alt"
                            /> : <Avatar name={client.name} size="55px" round="27.5px" className={styles.userAvatar} />}
                            <audio
                                autoPlay
                                ref={(instance) => {
                                    provideRef(instance, client._id);
                                }}
                            />
                            <button
                                onClick={() => {
                                    handleMuteClick(client._id)
                                }
                                }
                                className={styles.micBtn}
                            >
                                {client.muted ? (
                                    <img
                                        className={styles.mic}
                                        src="/images/mic-mute.png"
                                        alt="mic"
                                    />
                                ) : (
                                    <img
                                        className={styles.micImg}
                                        src="/images/mic.png"
                                        alt="mic"
                                    />
                                )}
                            </button>
                        </div>
                        <h4>{client.name}</h4>
                    </div>
                );
            })}
        </div>
    )
}

export default ClientsList;