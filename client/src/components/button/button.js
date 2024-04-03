import styles from './button.module.css';

const Button = (props) => (
    <button className={styles.button}>{props.children}</button>
)

export default Button;