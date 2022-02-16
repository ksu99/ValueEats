import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    padding: 20,
    margin:20,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  name: {
    display: "flex",
    alignItems: "center",
    fontSize: 25,
  },
}));

export default useStyles;
