import { useCallback, useEffect, useRef } from "react";
import { useStateCallback } from "./useStateCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../socket/actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateCallback([])  //clients is an array of users
    const localStream = useRef(null);  //localStream is the stream of the current user
    const audioElements = useRef({}); //audioElements is an object of audio elements of all the users in the room where key is the user._id of the user
    const socket = useRef(null); //socket is the socket object
    const connections = useRef({}); //connections is an object of all the connections where key is the socket id of the user


    //Add new client
    const addClient = useCallback((newclient, callback) => {  //should probably be moved inside of useEffect with getMedia fn
        const alreadyExists = clients.find((client) => client._id === newclient._id);
        if (alreadyExists === undefined) {
            setClients((existingClients) => [...existingClients, newclient], callback);// i guess multiple devices wont be suppprted coz of this 

        }
    }, [clients, setClients])


    //initiate websocket connection
    useEffect(() => {
        socket.current = socketInit();
    }, [])

    //websocket listners
    useEffect(() => {
        if (socket.current) {
            const handleNewPeer = async ({ peerId,createOffer, user }) => {
                const remoteUser=user;
                console.log(user)
                //if already exists
                if(peerId in connections.current){
                    console.warn("Already connected to peer", peerId);
                    return;
                }
                connections.current[peerId] = new RTCPeerConnection({
                    iceServers: freeice(),
                });

                //handle new ice candidate
                connections.current[peerId].onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.current.emit(ACTIONS.NEW_ICE_CANDIDATE, {
                            candidate: event.candidate,
                            peerId,
                        });
                    }
                }

                //handle ontrack
                console.log(user)
                connections.current[peerId].ontrack = (event) => {
                        addClient(remoteUser,()=>{
                            if(audioElements.current[remoteUser._id]){
                                audioElements.current[remoteUser._id].srcObject = event.streams[0];
                                console.log(remoteUser.name, "audio added")
                            }
                            else{
                                let flag=false;
                                const interval=setInterval(()=>{
                                    if(audioElements.current[remoteUser._id]){
                                        audioElements.current[remoteUser._id].srcObject = event.streams[0];
                                        clearInterval(interval);
                                    }
                                    if(flag){
                                        clearInterval(interval);
                                    }
                                },1000)
                            }
                        });
                }

                //add local stream
                if (localStream.current) { 
                    localStream.current.getTracks().forEach((track) => {
                        connections.current[peerId].addTrack(track, localStream.current); //adding all tracks to peer connection, video track is also added if present
                    });
                }

                //create offer
                if (createOffer) {
                    const offer = await connections.current[peerId].createOffer();
                    await connections.current[peerId].setLocalDescription(new RTCSessionDescription(offer));
                    socket.current.emit(ACTIONS.OFFER, {
                        offer,
                        peerId,
                    });
                }


            }  
            socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

            const handleRemovePeer = async({ peerId,user }) => {
                if(peerId in connections.current){
                    connections.current[peerId].close(); 
                }
                delete connections.current[peerId];
                setClients((existingClients) => existingClients.filter((client) => client._id !== user._id));
                delete audioElements.current[user._id];
            };
            socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

            socket.current.on(ACTIONS.NEW_ICE_CANDIDATE, async ({ candidate, peerId }) => {
                try {
                    await connections.current[peerId]?.addIceCandidate(candidate);
                } catch (error) {
                    console.log(error);
                }
            });
            socket.current.on(ACTIONS.OFFER, async ({ offer, peerId }) => {
                try {
                    await connections.current[peerId].setRemoteDescription(offer);
                    const answer = await connections.current[peerId].createAnswer();
                    await connections.current[peerId].setLocalDescription(new RTCSessionDescription(answer));
                    socket.current.emit(ACTIONS.ANSWER, {
                        answer,
                        peerId,
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            socket.current.on(ACTIONS.ANSWER, async ({ answer, peerId }) => {
                try {
                    await connections.current[peerId].setRemoteDescription(new RTCSessionDescription(answer));
                } catch (error) {
                    console.log(error);
                }
            });

            return () => {
                socket.current.off(ACTIONS.ADD_PEER);
                socket.current.off(ACTIONS.NEW_ICE_CANDIDATE);
                socket.current.off(ACTIONS.OFFER);
                socket.current.off(ACTIONS.ANSWER);
                socket.current.off(ACTIONS.REMOVE_PEER);
                localStream.current.getTracks().forEach((track) => {
                    track.stop();
                });
                Object.keys(connections.current).forEach((peerId) => {
                    connections.current[peerId].close();
                });
                socket.current.emit(ACTIONS.LEAVE_ROOM,); //leave room
                connections.current = {};

            }
        }
    
    } , [addClient,setClients])

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
                socket.current.emit(ACTIONS.JOIN_ROOM, { roomId, user });
                console.log(ACTIONS.JOIN_ROOM)
            }
            )
        })
    }, [addClient, user, roomId])

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }

    return { clients, provideRef }
}