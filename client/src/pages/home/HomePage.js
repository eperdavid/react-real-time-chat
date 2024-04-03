import React from "react";
import styles from './Home.module.css';
import logo from '../../logo.png';

import Input from "../../components/input/input";
import Button from "../../components/button/button";

const HomePage = () => {
    return(
        <div className={styles.home}>
            <div className={styles.left}>
                <h1>Real time chat<br></br>made with React</h1>
                <p>Set a username and get started</p>
                <img src={logo} alt="logo" />
            </div>
            <div className={styles.right}>
                <div className={styles.gap}>
                    <Input placeholder="Your name"/>
                    <Button>Join chat</Button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;