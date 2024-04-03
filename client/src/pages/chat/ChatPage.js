import React, { useState } from 'react';
import styles from './ChatPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faEllipsisVertical, faArrowUp, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Message from '../../components/message/message';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import Card from '../../components/card/card';

const ChatPage = () => {

    const [selectedUser, setSelectedUser] = useState();


    return (
        <div className={styles.wrapper} id={selectedUser ? styles.Chat : styles.Chats}>
            <div className={styles.chats}>
                <div className={styles.chatsHeader}>
                    <h1>Chats</h1>
                    <FontAwesomeIcon className={styles.icon} icon={faGear}/>
                </div>
                
                <div>
                    <Input placeholder="Search"/>
                </div>

                <div className={styles.cards}>
                    <Card name="John" selected={true} >asdiasjdija sidjasasd asdasdasd jdoa</Card>
                    <Card name="Test" selected={false} >asd iasjdija sidjasjdoa</Card>
                </div>
            </div>


            <div className={styles.chat}>
                <div className={styles.chatHeader}>
                    <div className={styles.flex}>
                    <FontAwesomeIcon className={styles.backIcon} icon={faChevronLeft} size='xl'/>
                    <div className={styles.name}>Name</div>
                    </div>
                    <FontAwesomeIcon className={styles.icon} icon={faEllipsisVertical}/>
                </div>

                <div className={styles.chatBody}>
                    <Message time="12:45" type="sent">1asdrf asd</Message>
                    <Message time="12:45" type="received">2asdwq üasdipasdouiahsid aisjdiasas asdasd asd asdasdasdasdasd asdasdzenet asdasd asddasdasdasdasdas sad</Message>
                    <Message time="12:45" type="received">3dsad üzenet</Message>
                    <Message time="12:45" type="sent">4asdd üzeneasdojaopsjdpoiajsdioj asiasdkjaiosddjat</Message>
                </div>


                <div className={styles.chatFooter}>
                    <Input placeholder="Message"/>
                    <Button><FontAwesomeIcon icon={faArrowUp}/></Button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;