import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../Service/Peer";
import { useSocket } from "../Context/SocketProvider";
import Header from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import './Room.css'
// import Swal from 'sweetalert2';
// import EventList from '../../../Admin/AdminComponents/Event/EventList';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const RoomPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    if (socket) {  // Add null check
      socket.emit("user:call", { to: remoteSocketId, offer });
    }
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      if (socket) {  // Add null check
        socket.emit("call:accepted", { to: from, ans });
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    if (socket && remoteSocketId) {  // Add null checks
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      if (socket) {  // Add null check
        socket.emit("peer:nego:done", { to: from, ans });
      }
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    if (socket) {  // Add null check here
      socket.on("user:joined", handleUserJoined);
      socket.on("incomming:call", handleIncommingCall);
      socket.on("call:accepted", handleCallAccepted);
      socket.on("peer:nego:needed", handleNegoNeedIncomming);
      socket.on("peer:nego:final", handleNegoNeedFinal);

      return () => {
        socket.off("user:joined", handleUserJoined);
        socket.off("incomming:call", handleIncommingCall);
        socket.off("call:accepted", handleCallAccepted);
        socket.off("peer:nego:needed", handleNegoNeedIncomming);
        socket.off("peer:nego:final", handleNegoNeedFinal);
      };
    }
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

   const [name, setName] = useState('');
  
    useEffect(() => {
      const storedName = localStorage.getItem('email');
      if (storedName) {
        setName(storedName);
      }
    }, []);

  return (
    <div className="room">
      <div className="navcontent">
        <Header />
        
        <div className="room-page">
          <h1>📞 Room Page</h1>
          <h4>{remoteSocketId ? "🤝 Connected" : "❌ No one in room"}</h4>
          <div className="controls">
            {myStream && <button onClick={sendStreams}>📤 Share Stream</button>}
            {remoteSocketId && <button onClick={handleCallUser}>📞 Call User</button>}
          </div>
          <div className="streams">
            {myStream && (
              <div>
                <h2>🎥 My Stream</h2>
                <ReactPlayer
                  playing
                  muted
                  height="700px"
                  width="700px"
                  url={myStream}
                />
              </div>
            )}
            {remoteStream && (
              <div>
                <h2>👁️ Remote Stream</h2>
                <ReactPlayer
                  playing
                  muted
                  height="700px"
                  width="700px"
                  url={remoteStream}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;