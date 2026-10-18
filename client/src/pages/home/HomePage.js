import React, { useState, useEffect } from "react";

import styles from './Home.module.css';
import logo from '../../logo.png';

import Input from "../../components/input/input";
import Button from "../../components/button/button";


const HomePage = (props) => {

    const { socket, login: onLoginSuccess } = props;

    const [socketId, setSocketId] = useState(socket.id || '');

    const [username, setUsername] = useState('');

    const [error, setError] = useState({visible: false, message: ''});

    useEffect(() => {
        const onConnect = () => {
            setSocketId(socket.id);
        };

        const onLoginSuccessEvent = (name, id) => {
            onLoginSuccess(name, id);
        };

        const onLoginError = (message) => {
            setError({visible: true, message: message});
        };

        socket.on("connect", onConnect);
        socket.on("loginSuccess", onLoginSuccessEvent);
        socket.on("loginError", onLoginError);

        if (socket.connected) {
            setSocketId(socket.id);
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("loginSuccess", onLoginSuccessEvent);
            socket.off("loginError", onLoginError);
        };
    }, [socket, onLoginSuccess]);

    const handleLogin = (socketId, username) => {
        socket.emit("login", {socketId, username});
    }

    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.length <= 15) {
            setUsername(inputValue);
        }
        setError(prev => ({...prev, visible: false}));
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
                    <div style={{position: 'relative'}}>
                    <Input placeholder="Username" changed={(event) => {handleInputChange(event)}} max={15} value={username} />
                    <span className={`${styles.error} ${error.visible ? styles.visible : ''}`}>{error.message || "\u00A0"}</span>
                    <span className={styles.counter}>{username.length}/15</span>
                    </div>
                    <Button clicked={() => handleLogin(socketId,username)} disabled={error.visible || username.trim() === ''}>Join chat</Button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;