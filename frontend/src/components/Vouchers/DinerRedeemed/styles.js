import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: "20px 5%",
    position: "relative",
    backgroundColor: "#48743E",
    color: "white",
  },
  content: {
    padding: "20px",
  },
  discount: {
    paddingBottom: "30px",
    fontSize: "25px",
  },
  discountSize: {
    fontSize: "15px",
  },
  code: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  button: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    backgroundColor: "#05BC0D",
  },
}));

export { useStyles };