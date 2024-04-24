import styles from './input.module.css';

const Input = (props) => {

    return (
            <input className={styles.input} placeholder={props.placeholder} onFocus={props.onFocus} onBlur={props.onBlur} onChange={props.changed}/>
    );
}

export default Input;