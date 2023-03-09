import React,{useState} from "react";
import styles from "./ClientsArea.module.css";
import ClientsList from "../ClientsList/ClientsList";
import Editor from "../Editor/Editor"

const Display = {
    list:ClientsList,
    editor:Editor
}

const ClientArea = ({ clients, room, provideRef, handManualLeave }) => {
    const [type,setType] = useState("list");
    const Component = Display[type];

    return (
        <div className={styles.clientsWrap}>
            <div className={styles.header}>
                {<h2 className={styles.topic}>{room?.topic}</h2>}
                <div className={styles.actions}>
                    <div className={styles.buttonWrap}>
                        <button
                            className={`${styles.tabButton} ${type === 'list' ? styles.active : ''
                                }`}
                            onClick={() => setType('list')}
                        >
                            <span>Room</span>
                        </button>
                        <button
                            className={`${styles.tabButton} ${type === 'editor' ? styles.active : ''
                                }`}
                            onClick={() => setType('editor')}
                        >
                            <span>Code Editor</span>
                        </button>
                    </div>
                    <button
                        onClick={handManualLeave}
                        className={styles.actionBtn}
                    >
                        <img src="/images/win.png" alt="win-icon" />
                        <span>Leave quietly</span>
                    </button>
                </div>
            </div>
            
            <Component clients={clients} provideRef={provideRef}/>
            

            
            
        </div>
    )
}

export default ClientArea;