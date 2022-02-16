import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: "20px 5%",
    position: "relative",
  },
  content: {
    padding: "20px",
  },
  updateButton: {
    backgroundColor: "#05BC0D",
    borderRadius: "10px",
  },
  disableButton: {
  },
  deleteButton: {
    backgroundColor: "#dc024e",
    borderRadius: "10px",
  },
  footCard: {
    justifyContent: "spaceBetween",
  },
  release: {
    fontSize: "12px",
    fontStyle: "italics",
  },
  state: {
    fontWeight: "Bold",
  },
  description: {
    paddingBottom: "10px",
  }
}));

export { useStyles };
