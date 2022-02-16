import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: "20px 5%",
  },
  content: {
    padding: "20px",
  },
  button: {
    borderRadius: "10px",
    backgroundColor: "#05BC0D",
  },
  description: {
    paddingBottom: "10px",
  },
  discount: {
    width: "100%",
    textAlign: "center",
  },
  discountSize: {
    fontSize: "40px",
  },
  offSize: {
    fontSize: "15px",
  },
  iconSize: {
    fontSize: "45px",
  },
  dateSize: {
    fontSize: "15px",
  },
  row: {
    display: "flex",
    marginBottom: "10px",
  },
  center: {
    display: "flex",
    alignItems: "center",
  },

  columnIcon: {
    width: "60px",
  },
}));

export { useStyles };
