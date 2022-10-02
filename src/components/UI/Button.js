import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      className={classes.button}
      type="submit"
      onClick={props.onClick}
    >
      {props.status}
    </button>
  );
};

export default Button;
