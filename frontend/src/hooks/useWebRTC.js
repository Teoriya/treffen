import { useCallback, useEffect,useRef } from "react";
import { useStateCallback } from "./useStateCallback"

// let userss= [{
//     _id:1,
//     name:"client1",
// },
// {
//     _id:2,       
//     name:"client2",
// },]

export const useWebRTC = (roomId,user) => {
    const [clients, setClients] = useStateCallback([])
    const localStream = useRef(null);
    const audioElements = useRef({});
    // const connections = useRef({});

   
    //Add new client
    const addClient = useCallback((newclient,callback) => {
        const alreadyExists = clients.find((client) => client._id === newclient._id);
                if (alreadyExists === undefined) {
                    setClients((existingClients)=>[...existingClients,newclient],callback);// i guess multiple devices wont be suppprted coz of this 
                   
                }
            }, [clients, setClients])


            
    //capture audio media
    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                
                localStream.current = stream;
                
            } catch (error) {
                console.log(error);
            }
        }
        getMedia().then(() => {
            addClient(user, () => {
                const localElement = audioElements.current[user._id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localStream.current;
                }

                //
            }
        )})
    }, [addClient,user])
        
    const provideRef = (instance, userId) =>{
        audioElements.current[userId] = instance;
    }

    return {clients,provideRef}
}