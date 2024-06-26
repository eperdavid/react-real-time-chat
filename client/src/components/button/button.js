import styles from './button.module.css';

const Button = (props) => (
    <button className={styles.button} onClick={props.clicked} disabled={props.disabled}>{props.children}</button>
)

export default Button;