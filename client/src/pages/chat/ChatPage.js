import React, { useState, useEffect } from 'react';
import styles from './ChatPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faEllipsisVertical, faArrowUp, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Message from '../../components/message/message';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import Card from '../../components/card/card';

const ChatPage = () => {

    const [users, setUsers] = useState([
        {username: "Zoli"},
        {username: "Pista"},
        {username: "Jani"}
    ]);

    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]); 

    const [chats, setChats] = useState([
        {username: "Adam", messages: [], roomID: 5},
        {username: "Valami", messages: [{message: "Szia", time: "22:15"}, {message:"valami", time: "11:08"}], roomID: 1}
    ]);

    const [selectedUser, setSelectedUser] = useState({username: "Adam", messages: [], roomID: 5});
    const [searchActive, setSearchActive] = useState(false);
    
    let cards = "";

    if(searchActive)
    {
        cards = filteredUsers.map((user, index) => (
            <Card key={index} name={user.username} selected={false} clicked={() => selectUser(user.username)}></Card>
        ))
    }
    else{
        cards = chats.map((chat, index) => {

            let select = false;
            let text = "";
            if(chat.messages.length > 0)
            {
                text = chat.messages[chat.messages.length-1].message;
            }

            if(selectedUser && selectedUser.username === chat.username)
            {
                select = true;
            }
            
            return <Card key={index} name={chat.username} selected={select} clicked={() => selectUser(chat.username)} >{text}</Card>
        })
    }

    const userFilter = (event) => {
        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase())));
    }

    const selectUser = (username) => {
        const userChk = chats.some(user => user.username === username);
        
        if(userChk)
        {
            const selectedUser = chats.find((chat) => chat.username === username);
            setSelectedUser(selectedUser); 
        }
        else{
            const user = { username: username, messages: [], roomID: null };
            const addToChat = [user, ...chats];
            setChats(addToChat);
            setSelectedUser(user);
        }   
    }

    useEffect(() => {
        console.log(selectedUser);
    }, [selectedUser])

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
                    <Message time="12:45" type="sent">1asdrf asd</Message>
                    <Message time="12:45" type="received">2asdwq üasdipasdouiahsid aisjdiasas asdasd asd asdasdasdasdasd asdasdzenet asdasd asddasdasdasdasdas sad</Message>
                    <Message time="12:45" type="received">3dsad üzenet</Message>
                    <Message time="12:45" type="sent">4asdd üzeneasdojaopsjdpoiajsdioj asiasdkjaiosddjat</Message>
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