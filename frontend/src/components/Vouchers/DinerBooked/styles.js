import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: "20px 5%",
  },
  card: {
    padding: "20px",
  },
  discount: {
    padding: "10px 0px",
  },
  discountSize: {
    fontSize: "15px",
  },
  code: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#05BC0D",
  },
  font: {
    fontWeight: 600,
  },
}));

export { useStyles };