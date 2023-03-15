import React,{useState,useEffect} from 'react'
import styles from './Rooms.module.css'
import RoomCard from '../../components/RoomCard/RoomCard';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import { fetchRooms } from '../../http';

const Rooms = () => {
  const [modal,setModal] = useState(false);
  const [rooms,setRooms] = useState(null);
  useEffect(()=>{
    (async()=>{
      try{
      const {data} = await fetchRooms();
      // console.log(data);
      setRooms(data);}
      catch(err){
        console.log(err);
      }
    })()
  },[])
  return (
    <>
      <div className='container'>
        <div className={styles.roomsHeader}>
          <div className={styles.leftHead}>
            <span className={styles.heading}>All voice Rooms</span>
            <div className={styles.searchBar}>
              <img src='/images/search-icon.png' alt='search-icon' />
              <input className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.rightHead}>
            <button className={styles.startRoomButton} onClick={()=>{setModal(true)}}>
              <img src='/images/add-room-icon.png' alt='icon' /> <span className={styles.btntxt}>Start Room</span>
            </button>

          </div>

        </div>
        <div className={styles.roomList}>
          {
            rooms?(rooms.length>0?rooms.map((room)=>(<RoomCard key={room.id} room={room}/>)):<>No Rooms found. Click Start Room to Create one.</>):<>Loading Rooms</>
          }

        </div>

      </div>
      {modal&&<AddRoomModal onClose={()=>setModal(false)}/>}


    </>
  )
}

export default Rooms
