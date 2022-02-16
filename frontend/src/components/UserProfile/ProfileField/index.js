import React from 'react';
import styles from './styles.module.css';
import { FormControl, TextField } from '@material-ui/core';

const ProfileField = (props) => {
  const { label, name, value, handleChange } = props;

  return (
    <form className={styles.field}>
      <FormControl fullWidth={true}>
        <TextField
          InputLabelProps={{ className: styles.label }}
          InputProps={{ className: styles.fieldText, spellCheck: false }}
          label={label}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={name === 'email' ? true : false}
        />
      </FormControl>
    </form>
  );
};

export default ProfileField;
