import { useCallback, useEffect,useRef } from "react";
import { useStateCallback } from "./useStateCallback";
import {socketInit} from "../socket";
import { ACTIONS } from "../socket/actions";

export const useWebRTC = (roomId,user) => {
    const [clients, setClients] = useStateCallback([])
    const localStream = useRef(null);
    const audioElements = useRef({});
    const socket = useRef(null);
    // const connections = useRef({});

   
    //Add new client
    const addClient = useCallback((newclient,callback) => {  //should probably be moved inside of useEffect with getMedia fn
        const alreadyExists = clients.find((client) => client._id === newclient._id);
                if (alreadyExists === undefined) {
                    setClients((existingClients)=>[...existingClients,newclient],callback);// i guess multiple devices wont be suppprted coz of this 
                   
                }
            }, [clients, setClients])


        useEffect(() => {
            socket.current = socketInit();
        }, [])

            
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
                socket.current.emit(ACTIONS.JOIN_ROOM, { roomId,user });
                console.log(ACTIONS.JOIN_ROOM)
            }
        )})
    }, [addClient,user,roomId])
        
    const provideRef = (instance, userId) =>{
        audioElements.current[userId] = instance;
    }

    return {clients,provideRef}
}