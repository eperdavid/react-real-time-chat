import styles from './input.module.css';

const Input = (props) => {

    return (
            <input className={styles.input} placeholder={props.placeholder} />
    );
}

export default Input;