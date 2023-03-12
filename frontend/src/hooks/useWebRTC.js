import { useCallback, useEffect, useRef } from "react";
import { useStateCallback } from "./useStateCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../socket/actionsWebRTC";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateCallback([]); // array of all user
    const audioElements = useRef({}); // audio elements as map where userId is the key and maps to audio elements
    const socket = useRef(null); // the socket connection
    const localMediaStream = useRef(null);  // local media capture is storeed in this reference
    const rtcConnections = useRef({});// socket ids mapped to rtc conn's

    const addNewClient = useCallback(
        (newClient, cb) => {
            const alreadyExists = clients.find((client) => client._id === newClient._id)
            if (!alreadyExists) {
                setClients((existingClients) => [...existingClients, newClient], cb)
            }
        }, [clients, setClients]
    )

    //initialize Socket
    useEffect(() => {
        socket.current = socketInit();
        return () => {
            localMediaStream.current.getTracks().forEach(track => track.stop())
            socket.current.emit(ACTIONS.LEAVE_ROOM, {})
        }
    }, []);


    //handleNewPeer
    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
            if (peerId in rtcConnections.current) {
                return console.warn("RTC connection already Exists", peerId,)
            };
            const currentRTC = new RTCPeerConnection({
                iceServers: freeice()
            });
            rtcConnections.current[peerId] = currentRTC;
            currentRTC.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.current.emit(ACTIONS.RELAY_ICE, { peerId, icecandidate: event.candidate });
                }
            }

            currentRTC.ontrack = ({ streams: [remoteStream] }) => {
                addNewClient(remoteUser, () => {
                    if (audioElements.current[remoteUser._id]) {
                        audioElements.current[remoteUser._id].srcObject = remoteStream;

                    }
                    else {
                        const inteval = setInterval(() => {
                            if (audioElements.current[remoteUser._id]) {
                    
                                audioElements.current[remoteUser._id].srcObject = remoteStream;
                                clearInterval(inteval);
                            }

                        }, 1000)
                    }
                })
            }

            //add local track to remote connections
            localMediaStream.current.getTracks().forEach(track => {
                currentRTC.addTrack(track, localMediaStream.current)
            });


            //createOffer
            if (createOffer) {
                const offer = await currentRTC.createOffer();
                currentRTC.setLocalDescription(offer);
                socket.current.emit(ACTIONS.RELAY_SDP, { peerId, SDP: offer })
            }


        }

        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket.current.off(ACTIONS.ADD_PEER)
        }


    })


    //capture media
    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        startCapture().then(() => {
            addNewClient(user, () => {
                const localElement = audioElements.current[user._id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }

                socket.current.emit(ACTIONS.JOIN_ROOM, { roomId, user })


            });
        });



    }, [addNewClient, user, roomId])


    //handling new ice candidate
    useEffect(() => {
        socket.current.on(ACTIONS.NEW_ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                rtcConnections.current[peerId].addIceCandidate(icecandidate);

            }
        })
        return () => { socket.current.off(ACTIONS.NEW_ICE_CANDIDATE) }

    }, []
    )


    //handling new sdp info
    useEffect(() => {
        socket.current.on(ACTIONS.SDP, async ({ peerId, SDP }) => {
            const currentRTC = rtcConnections.current[peerId];//can create a reference too ,  maybe refactor later
            currentRTC.setRemoteDescription(new RTCSessionDescription(SDP));
            if (SDP.type === "offer") {
                const answer = await currentRTC.createAnswer();
                currentRTC.setLocalDescription(answer);
                socket.current.emit(ACTIONS.RELAY_SDP, { peerId, SDP: answer })
            }
        })

        return () => {
            socket.current.off(ACTIONS.SDP)
        }
    }, []
    )

    //handling remove peer

    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }) => {
            if (rtcConnections.current[peerId]) {
                rtcConnections.current[peerId].close();
            }
            delete rtcConnections.current[peerId];
            delete audioElements.current[userId];
            setClients((existingClients) => existingClients.filter((client) => client._id !== userId))
        }
        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER)
        }
    }, [setClients])


    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };

    return { clients, provideRef , socketRef:socket}
}