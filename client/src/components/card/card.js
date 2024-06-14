import styles from './card.module.css';

const Card = (props) => {

    let classes = [styles.card];

    if(props.selected)
    {
        classes.push(styles.active);
    }

    if(props.new)
    {
        classes.push(styles.new);
    }

    return(
        <div className={classes.join(' ')} style={{gap: props.children ? "1.5rem" : "0rem"}} onClick={props.clicked}>
            <div className={styles.flex}><span className={styles.name}>{props.name}</span>{props.new ? <div className={styles.dot}></div> : ''}</div>
            <span className={styles.message}>{props.children}</span>
        </div>
    );
}

export default Card;