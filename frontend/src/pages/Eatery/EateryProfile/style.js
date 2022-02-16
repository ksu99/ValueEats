import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: 40,
  },
  heading: {
    fontSize: "50px",
    fontWeight: "700",
    margin: "0",
  },

  button: {
    padding: 10,
    fontSize: 15,
    margin: 2,
    backgroundColor: "lightgrey",
    "&:hover": {
      backgroundColor: "#05BC0D",
      color: "white",
    },
  },
  icon: {
    paddingRight: 5,
    fontSize: 20,
  },
  followButton: {
    marginTop: 30,
    marginRight: 20,
  },
  modal: {
    display: "flex",
    paddingTop: 100,
    height: 200,
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 8,
    padding: theme.spacing(2, 4, 3),
  },
  banner: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
}));

export default useStyles;
