import styles from './message.module.css';

const Message = (props) => {

    const styleClass = styles[props.type];

    return(
        <div className={styles.message} id={styleClass}>
            <div>
                <p className={styles.content}>{props.children}</p>
                <p className={styles.time}>{props.time}</p>
            </div>
        </div>
    );
}

export default Message;