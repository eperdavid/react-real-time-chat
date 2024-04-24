import styles from './button.module.css';

const Button = (props) => (
    <button className={styles.button} onClick={props.clicked}>{props.children}</button>
)

export default Button;