import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    width: '100%',
  },

  formLabel: {
    marginBottom: theme.spacing(2),
  },

  cardRoot: {
    maxWidth: '100%',
  },

  cardMedia: {
    maxWidth: '70%',
    margin: 'auto',
  },

  cardProfileMedia: {
    paddingTop: '81.25%',
    borderRadius: '50%',
    margin: '28px'
  },

  buttonColor: {
    background: '#4AC415',
    color: 'white',
    marginBottom: '20px',
  },
}))

function UploadPicture(props) {
  const classes = useStyles();
  const { imageType, imagePreview, handleImageChange } = props;

  return (
    <>
      <Grid item xs={12}>
        <FormLabel>
          <input
            style={{ display: 'none' }}
            accept="image/*"
            id="contained-button-file"
            multiple
            onChange={handleImageChange}
            type="file"
          />
          <Button
            className={classes.buttonColor}
            variant="contained"
            component="span"
          >
            Please upload your {imageType}
          </Button>
        </FormLabel>
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.cardRoot}>
          <CardMedia
            className={classes.cardMedia}
            component="img"
            image={imagePreview}
          />
        </Card>
      </Grid>
    </>
  )
}

export default UploadPicture;
