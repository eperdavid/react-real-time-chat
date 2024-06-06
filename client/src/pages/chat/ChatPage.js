import React, { useState, useEffect } from 'react';
import styles from './ChatPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faEllipsisVertical, faArrowUp, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Message from '../../components/message/message';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import Card from '../../components/card/card';


const ChatPage = (props) => {

    const socket = props.socket;

    useEffect(() => {
        socket.on("updateUsers", (data) => {
            setUsers(data);
        })
    }, [socket]);
    
    const myData = {socketId: props.socketId, username: props.username};

    const [users, setUsers] = useState();
    

    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const [chats, setChats] = useState([
        /* {username: "Adam", messages: [], roomID: 5},
        {username: "Valami", messages: [{time: "22:15", message: "Szia", author: "Jani" }, {time: "11:08", message: "valami", author: "Zoli"}], roomID: 1} */
    ]);

    const [selectedUser, setSelectedUser] = useState();
    console.log("rendered");
    const [chat, setChat] = useState([{time: "22:15", message: "Szia", author: "Jani" }, {time: "11:08", message: "valami", author: "Zoli"}, {time: "11:18", message: "valam2i", author: "Zoli"}]);

    const [searchActive, setSearchActive] = useState(false);
    
    let cards = "";
    let messages = chat.map((message,index) => {
        let type = "sent";
        if(message.author !== myData.username)
        {
            type = "received";
        }
        return <Message key={index} time={message.time} type={type}>{message.message}</Message>
    });

    if(searchActive)
    {
        cards = filteredUsers.map((user, index) => {
            if(filteredUsers !== null && user.username !== myData.username)
            {
                return <Card key={index} socketID={user.socketID} name={user.username} selected={false} clicked={() => selectUser(user.socketID, user.username)}></Card>
            } 
            else{
                return null;
            }
        })
    }
    else{
        cards = chats.map((chat, index) => {

            let select = false;
            let text = "";
            if(chat.messages.length > 0)
            {
                text = chat.messages[chat.messages.length-1].message;
            }

            if(selectedUser && selectedUser.socketID === chat.socketID)
            {
                select = true;
            }
            
            return <Card key={index} name={chat.username} selected={select} clicked={() => selectUser(chat.socketID, chat.username)} >{text}</Card>
        })
    }

    const userFilter = (event) => {
        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase())));
    }

    const selectUser = (socketID, username) => {
        const userChk = chats.some(user => user.username === username);   

        if(userChk)
        {
            const index = chats.findIndex(chat => chat.socketID === socketID);
            if(index !== -1)
            {
                setSelectedUser({
                    socketID: socketID,
                    index: index
                });
            }
        }
        else{
            setSelectedUser({socketID: socketID, index: 0});
            const user = { username: username, messages: [], socketID: socketID };
            const addToChat = [user, ...chats];
            setChats(addToChat);
        }
    }

    useEffect(() => {
        if(selectedUser)
        {
            const index = chats.findIndex(chat => chat.socketID === selectedUser.socketID);
            if(index !== -1 && selectedUser.index !== index)
            {
                setSelectedUser(prevSelectedUser => ({
                    ...prevSelectedUser,
                    index: index
                }));
            }
            
        }
    }, [chats])



    const sendMessage = () => {
        console.log(selectedUser);
    }

    
    return (
        <div className={styles.wrapper} id={selectedUser ? styles.Chat : styles.Chats}>
            <div className={styles.chats} style={{backgroundColor: searchActive ? '#2A2A2A' : '#161616'}}>
                <div className={styles.chatsHeader}>
                    <h1>Chats</h1>
                    <FontAwesomeIcon className={styles.icon} icon={faGear}/>
                </div>
                
                <div>
                    <Input placeholder="Search" onFocus={() => {setSearchActive(true)}} onBlur={() => {setTimeout(() => {setSearchActive(false)},100)}} changed={userFilter} />
                </div>

                <div className={styles.cards}>
                    {cards}
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
                    {messages}
                    {/* <Message time="12:45" type="sent">1asdrf asd</Message>
                    <Message time="12:45" type="received">2asdwq üasdipasdouiahsid aisjdiasas asdasd asd asdasdasdasdasd asdasdzenet asdasd asddasdasdasdasdas sad</Message>
                    <Message time="12:45" type="received">3dsad üzenet</Message>
                    <Message time="12:45" type="sent">4asdd üzeneasdojaopsjdpoiajsdioj asiasdkjaiosddjat</Message> */}
                </div>


                <div className={styles.chatFooter}>
                    <Input placeholder="Message"/>
                    <Button clicked={sendMessage}><FontAwesomeIcon icon={faArrowUp}/></Button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;