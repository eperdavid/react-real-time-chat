import React, { useState, useEffect } from "react";

import styles from './Home.module.css';
import logo from '../../logo.png';

import Input from "../../components/input/input";
import Button from "../../components/button/button";


const HomePage = (props) => {

    const socket = props.socket;

    const [socketId, setSocketId] = useState('');

    console.log(socketId);

    const [username, setUsername] = useState('');

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
        });

        socket.on("loginSuccess", (username) => {
            props.login(username);
        })
    }, [socket]);

    const login = (socketId, username) => {
        socket.emit("login", {socketId, username});
    }

    

    return(
        <div className={styles.home}>
            <div className={styles.left}>
                <h1>Real time chat<br></br>made with React</h1>
                <p>Set a username and get started</p>
                <img src={logo} alt="logo" />
            </div>
            <div className={styles.right}>
                <div className={styles.gap}>
                    <Input placeholder="Username" changed={(event) => {setUsername(event.target.value)}} />
                    <Button clicked={() => login(socketId,username)}>Join chat</Button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;