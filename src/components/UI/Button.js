import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      style={props.status === "Sign up" ? { marginBottom: "1.5rem" } : {}}
      className={classes.button}
      type="submit"
      onClick={props.onClick}
    >
      {props.status}
    </button>
  );
};

export default Button;
