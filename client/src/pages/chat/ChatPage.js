import React, { useState, useEffect, useRef } from 'react';
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
        });

        socket.on("privateMessage", (data) => {
            // console.log(data); {from: 'qZ5iCPJ9szowstEAAAAF', message: 'Hello'}
            let newChats = [...chatsRef.current];
            const now = new Date();
            const msg = {time: now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }), message: data.message, author: data.username}
            const chatIndex = chatsRef.current.findIndex(chat => chat.socketID === data.from);
            if(chatIndex !== -1)
            {
                /* newChats[chatIndex] = {
                    ...newChats[chatIndex],
                    messages: [msg, ...newChats[chatIndex].messages]
                }*/
                newChats[chatIndex].messages.push(msg);

                if(chatIndex !== selectedUserRef.current.index)
                {
                    newChats[chatIndex] = {
                        ...newChats[chatIndex],
                        newMsg: true
                    }
                }

                console.log("UJ log: "+selectedUserRef.current.index);

                if(chatIndex !== 0)
                {
                    const [chat] = newChats.splice(chatIndex, 1);
                    newChats = [chat, ...newChats];
                }
                
            }
            else{
                const newChat = {username: data.username, messages: [msg], socketID: data.from, newMsg: true};
                newChats = [newChat, ...newChats];
            }
            
            setChats(newChats);
        })
    }, [socket]);
    
    const myData = {socketId: props.socketId, username: props.username};

    const [users, setUsers] = useState();
    

    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const [chats, setChats] = useState([]);

    const [selectedUser, setSelectedUser] = useState();

    const [searchActive, setSearchActive] = useState(false);

    const [currentMessage, setCurrentMessage] = useState('');

    const chatsRef = useRef(chats);
    const selectedUserRef = useRef(selectedUser);
    
    let cards = "";
    let messages = "No messages";
    if(selectedUser)
    {
        messages = chats[selectedUser.index].messages.map((message,index) => {
            let type = "sent";
            if(message.author !== myData.username)
            {
                type = "received";
            }
            return <Message key={index} time={message.time} type={type}>{message.message}</Message>
        });
    }

    if(searchActive)
    {
        cards = filteredUsers.map((user, index) => {
            if(filteredUsers !== null && user.username !== myData.username)
            {
                return <Card key={index} socketID={user.socketID} name={user.username} selected={false} clicked={() => selectUser(user.socketID, user.username)} new={false} ></Card>
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
            
            return <Card key={index} name={chat.username} selected={select} clicked={() => selectUser(chat.socketID, chat.username)} new={chat.newMsg}>{text}</Card>
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

                const chatsUpdate = [...chats];
                chatsUpdate[index] = {...chatsUpdate[index], newMsg: false};
                setChats(chatsUpdate);
            }
        }
        else{
            setSelectedUser({socketID: socketID, index: 0});
            const user = { username: username, messages: [], socketID: socketID, newMsg: false };
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

        chatsRef.current = chats;
    }, [chats])

    useEffect(() => {
       selectedUserRef.current = selectedUser;
    }, [selectedUser])



    const handleInputChange = (event) => {
        setCurrentMessage(event.target.value);
        
    }

    const sendMessage = (to, message, username) => {
        const now = new Date();
        const msg = {time: now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }), message: message, author: username}
        let updatedChats = [...chats];
        /* updatedChats[selectedUser.index] = {
            ...updatedChats[selectedUser.index],
            messages: [msg, ...updatedChats[selectedUser.index].messages]
        } */
        updatedChats[selectedUser.index].messages.push(msg);
        if(selectedUser.index !== 0)
        {
            const [moved] = updatedChats.splice(selectedUser.index, 1);
            updatedChats = [moved, ...updatedChats];
        }

        setChats(updatedChats);
        setCurrentMessage('');

        socket.emit('sendMessage', {to, message, username});
    }

    let header = '';
    if(selectedUser)
    {
        header = <div className={styles.chatHeader}>
                    <div className={styles.flex}>
                    <FontAwesomeIcon className={styles.backIcon} icon={faChevronLeft} size='xl'/>
                    <div className={styles.name}>{chats[selectedUser.index].username}</div>
                    </div>
                    <FontAwesomeIcon className={styles.icon} icon={faEllipsisVertical}/>
                </div>;
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
                {header}
                <div className={styles.chatBody}>
                    {messages}
                    {/* <Message time="12:45" type="sent">1asdrf asd</Message>
                    <Message time="12:45" type="received">2asdwq üasdipasdouiahsid aisjdiasas asdasd asd asdasdasdasdasd asdasdzenet asdasd asddasdasdasdasdas sad</Message>
                    <Message time="12:45" type="received">3dsad üzenet</Message>
                    <Message time="12:45" type="sent">4asdd üzeneasdojaopsjdpoiajsdioj asiasdkjaiosddjat</Message> */}
                </div>


                <div className={styles.chatFooter}>
                    <Input placeholder="Message" value={currentMessage} changed={(event) => {handleInputChange(event)}} />
                    <Button clicked={() => sendMessage(selectedUser.socketID, currentMessage, myData.username)} disabled={currentMessage.trim() === ''}><FontAwesomeIcon icon={faArrowUp}/></Button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;