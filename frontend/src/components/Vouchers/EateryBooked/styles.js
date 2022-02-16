import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: "20px 5%",
    backgroundColor: "#48743E",
    color: "white",
    lineHeight: "1.8",
    position: "relative",
  },
  content: {
    padding: "20px",
  },
  diner: {
    fontWeight: "bold",
    fontSize: "50px",
  },
  button: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
  },
  bottom: {
    paddingBottom: "15px",
  },
}));

export { useStyles };