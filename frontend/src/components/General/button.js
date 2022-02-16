import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export const FilledButton = withStyles({
  root: {
    borderRadius: "10px",
    backgroundColor: "#05BC0D",
    padding: "10px 15px",
    "&:hover": {
      opacity: 0.9,
      backgroundColor: "green",
    },
  },
  label: {
    color: "white",
    fontWeight: 600,
  },
})(Button);

export const OutlinedButton = withStyles({
  root: {
    borderRadius: "10px",
    borderColor: "#05BC0D",
    padding: "10px 15px",
    "&:hover": {
      backgroundColor: "#05BC0D",
      color: "white",
    },
  },
  label: {
    fontWeight: 600,
  },
})(Button);

export const DarkButton = withStyles({
  root: {
    borderRadius: "10px",
    color: "#fff",
    backgroundColor: "#035e07",
  },
})(Button);
