import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleInfo, faArrowUp, faChevronLeft, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons';

import Message from '../../components/message/message';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import Card from '../../components/card/card';


const ChatPage = (props) => {

    const myData = {socketId: props.socketId, username: props.username};

    const [users, setUsers] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState(users);

    const [chats, setChats] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [searchActive, setSearchActive] = useState(false);

    const [currentMessage, setCurrentMessage] = useState('');

    const [isSent, setIsSent] = useState(false);
    const [isTypeing, setIsTypeing] = useState(false);

    const chatsRef = useRef(chats);
    const selectedUserRef = useRef(selectedUser);

    const socket = props.socket;

    useEffect(() => {
        socket.on("updateUsers", (data) => {
            setUsers(data);
        });

        socket.on("privateMessage", (data) => {
            let newChats = [...chatsRef.current];
            const now = new Date();
            const msg = {time: now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }), message: data.message, author: data.username}
            const chatIndex = chatsRef.current.findIndex(chat => chat.socketID === data.from);
            if(chatIndex !== -1)
            {
                newChats[chatIndex] = {
                    ...newChats[chatIndex],
                    messages: [msg, ...newChats[chatIndex].messages]
                }
                //newChats[chatIndex].messages.push(msg);

                if(selectedUserRef.current && chatIndex !== selectedUserRef.current.index)
                {
                    newChats[chatIndex] = {
                        ...newChats[chatIndex],
                        newMsg: true
                    }
                }

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
            setIsTypeing(false);
        })

        socket.on('userDisconnect', (data) => {
            let Chats = [...chatsRef.current];
            const chatIndex = Chats.findIndex(chat => chat.socketID === data.socketID);
            if(chatIndex !== -1)
            {
                Chats[chatIndex] = {
                    ...Chats[chatIndex],
                    offline: true
                }
            }
            setChats(Chats);
        })

        socket.on("typeing", (data) => {
            if(selectedUserRef.current)
            {
                if(selectedUserRef.current.socketID === data.from)
                { 
                    setIsTypeing(true);
                }
            }     
        })

        socket.on("stopTypeing", (data) => {
            if(selectedUserRef.current)
            {
                if(selectedUserRef.current.socketID === data.from)
                { 
                    setIsTypeing(false);   
                }
            }     
            
        })


    }, [socket]);

    useEffect(() => {
        console.log('isSent state changed:', isSent);
    }, [isSent]);
    

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    
    
    let cards = "";
    let messages = <div className={styles.info}>
                    <FontAwesomeIcon className={styles.icon} icon={faCircleInfo} />
                    <p>If you want to try out the application but there are no users online, you can do so by opening a <a href='https://letschatnow.vercel.app' target='_blank' rel="noopener noreferrer">new tab</a> in your browser.</p>
                </div>;
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

    if(users.length > 1 || chats.length > 0)
    {
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
            if(chats.length > 0)
            {
                
                cards = chats.map((chat, index) => {
                    
                    let select = false;
                    let text = "";
                    if(chat.messages.length > 0)
                    {
                        text = chat.messages[0].message;
                    }

                    if(selectedUser && selectedUser.socketID === chat.socketID)
                    {
                        select = true;
                    }
                        
                    return <Card key={index} name={chat.username} selected={select} clicked={() => selectUser(chat.socketID, chat.username)} new={chat.newMsg} offline={chat.offline}>{text}</Card>
                })
            }
            else{
                cards = <div className={styles.noChats}>
                    <p>You don't have any chats yet. Click the search bar to find a chat partner!</p>
                </div>;
            }
        }
    }
    else{
        cards = <div className={styles.usersOffline}>
            <FontAwesomeIcon className={styles.icon} icon={faUserLargeSlash} />
            <p>Currently, no users are online</p>
        </div>;
    }



    const userFilter = (event) => {
        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase())));
    }



    const selectUser = (socketID, username) => {
        const userChk = chats.some(user => user.socketID === socketID);  
        if(selectedUser)
        {
            socket.emit("stopTypeing", {to: selectedUser.socketID});
        }
        setCurrentMessage('');

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
            const user = { username: username, messages: [], socketID: socketID, newMsg: false, offline: false };
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

    useEffect(() => {
        if(selectedUser)
        {
            if(!isSent)
            {
                setIsSent(true);
                socket.emit("typeing", {to: selectedUser.socketID});
            } 

            if(currentMessage === '')
            {
                socket.emit("stopTypeing", {to: selectedUser.socketID});
                setIsSent(false);
            }  
        }       
    }, [currentMessage])

    



    const handleInputChange = (event) => {
        setCurrentMessage(event.target.value); 
    }

    const sendMessage = (to, message, username) => {
        const now = new Date();
        const msg = {time: now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }), message: message, author: username}
        let updatedChats = [...chats];
        updatedChats[selectedUser.index] = {
            ...updatedChats[selectedUser.index],
            messages: [msg, ...updatedChats[selectedUser.index].messages]
        }
        //updatedChats[selectedUser.index].messages.push(msg);
        if(selectedUser.index !== 0)
        {
            const [moved] = updatedChats.splice(selectedUser.index, 1);
            updatedChats = [moved, ...updatedChats];
        }

        setChats(updatedChats);
        setCurrentMessage('');

        socket.emit('sendMessage', {to, message, username});
    }

    const handlePressKey = (event) => {
        if(event.key === 'Enter')
        {
            if(selectedUser && currentMessage.trim() !== '')
            {
                sendMessage(selectedUser.socketID, currentMessage, myData.username);
            }
        }
    }

    let header = '';
    if(selectedUser)
    {
        header = <div className={styles.chatHeader}>
                    <div className={styles.flex}>
                    <FontAwesomeIcon className={styles.backIcon} icon={faChevronLeft} size='xl' onClick={() => setSelectedUser(null)}/>
                    <div className={styles.name}>{chats[selectedUser.index].username}</div>
                    </div>
                    {chats[selectedUser.index].offline ? <div style={{fontSize: 'Larger'}}>Offline</div> : ''}
                </div>;
    }

    
    return (
        <div className={styles.wrapper} id={selectedUser ? styles.Chat : styles.Chats}>
            <div className={styles.chats} style={{backgroundColor: searchActive ? '#2A2A2A' : '#161616'}}>
                <div className={styles.chatsHeader}>
                    <h1>Chats</h1>
                    <FontAwesomeIcon style={{display: 'none'}} className={styles.icon} icon={faGear}/>
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
                    <span className={styles.typeing} style={{bottom: isTypeing ? '0rem' : '-1rem'}}>{selectedUser ? chats[selectedUser.index].username : ''} is typing...</span>
                </div>


                <div className={styles.chatFooter}>
                    <Input placeholder="Message" value={currentMessage} changed={(event) => {handleInputChange(event)}} keyDown={(event) => handlePressKey(event)} />
                    <Button clicked={() => sendMessage(selectedUser.socketID, currentMessage, myData.username)}  disabled={!selectedUser || currentMessage.trim() === ''}><FontAwesomeIcon icon={faArrowUp}/></Button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;