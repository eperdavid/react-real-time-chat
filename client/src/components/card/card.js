import styles from './card.module.css';

const Card = (props) => {

    let classes = [styles.card];

    if(props.selected)
    {
        classes = classes.concat(styles.active).join(' ');
    }

    return(
        <div className={classes}>
            <span className={styles.name}>{props.name}</span>
            <span className={styles.message}>{props.children}</span>
        </div>
    );
}

export default Card;