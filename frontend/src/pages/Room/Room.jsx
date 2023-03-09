import React,{useEffect,useState} from 'react';
import styles from './Room.module.css';
import { useParams,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebRTC } from '../../hooks/useWebRTC';
import { getRoom } from '../../http';
import Loader from '../../components/shared/Loader/Loader';
import ClientsArea from '../../components/ClientsArea/ClientsArea';


const Room = () => {
    const { id: roomId } = useParams();
    const [loading,setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const{ clients,provideRef } = useWebRTC(roomId, user);
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();
    const handManualLeave = ()=>{
        navigate("/rooms")
    }
    useEffect(()=>{
        const fetchRoom = async () =>{
            const {data} = await getRoom(roomId);
            setRoom(data);
            setLoading(false);
        }
        fetchRoom();
    },[roomId])
            
    return (
        loading?<Loader message="Loading Room"/>:
        <div>
            <div className="container">
                <button className={styles.goBack} onClick={handManualLeave}>
                    <img src="/images/arrow-left.png" alt="arrow-left" />
                    <span>All voice rooms</span>
                </button>
            </div>
            <ClientsArea clients={clients} room={room} provideRef={provideRef} handManualLeave={handManualLeave}/>
            
        </div>
    );
};

export default Room;
