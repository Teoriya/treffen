import React from "react";
import styles from "./ClientsList.module.css";

const ClientsList = ({ clients,provideRef}) => {
    return (
            <div className={styles.clientsList}>
                {clients.map((client) => {
                    return (
                        <div className={styles.client} key={client._id}>
                            <div className={styles.userHead}>
                                <img
                                    className={styles.userAvatar}
                                    src={client.avatar}
                                    alt=""
                                />
                                <audio
                                    autoPlay
                                    ref={(instance) => {
                                        provideRef(instance, client._id);
                                    }}
                                />
                                <button
                                    onClick={() => { }
                                        //handleMuteClick(client.id)
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