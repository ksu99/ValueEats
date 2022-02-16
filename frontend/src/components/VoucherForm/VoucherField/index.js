import { React } from "react";
import {
  TextField,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from "@material-ui/core";
import "./styles.css";

function VoucherField(props) {
  const { fieldProps, handleChange, fields } = props;

  const {
    voucherTitle,
    voucherQuantity,
    voucherValue,
    startTime,
    endTime,
    startDate,
    endDate,
    routineType,
    occurrences,
    releaseDate,
    releaseTime,
    description,
  } = fieldProps;

  console.log("fieldProps from voucherField", fieldProps);

  const { label, type, required, value } = fields;

  const radioTypes = [
    { label: "Weekly", value: "weekly" },
    { label: "Fortnightly", value: "fortnightly" },
    { label: "Monthly", value: "monthly" },
    { label: "None", value: "none" },
  ];

  function assignValue(value) {
    switch (value) {
      case "routineType":
        return routineType;
      case "voucherTitle":
        return voucherTitle;
      case "voucherQuantity":
        return voucherQuantity;
      case "voucherValue":
        return voucherValue;
      case "startTime":
        return startTime;
      case "endTime":
        return endTime;
      case "occurrences":
        return occurrences;
      case "startDate":
        return startDate;
      case "endDate":
        return endDate;
      case "releaseDate":
        return releaseDate;
      case "releaseTime":
        return releaseTime;
      case "description":
        return description;
    }
  }

  let inputProps = { className: "field-input" };
  let InputProps = {};
  let inputLabelProps = { className: "field-label", shrink: true };
  let multiline = false;
  let defaultValue = "";
  let container = "voucher-field-container";

  if (type === "date") {
    if (value === "startDate") {
      defaultValue = startDate;
    } else if (value === "endDate") {
      defaultValue = endDate;
    } else {
      defaultValue = releaseDate;
    }
  } else if (type === "number") {
    inputProps["min"] = 0;
    defaultValue = 0;
    if (label === "Voucher value") {
      inputProps["max"] = 100;
      inputProps["step"] = 0.05;
      InputProps = {
        endAdornment: (
          <InputAdornment className="input-adornment" position="end">
            %
          </InputAdornment>
        ),
      };
    } else {
      inputProps["max"] = 200;
    }
  } else if (type === "input") {
    if (label === "Voucher title") {
      inputProps["className"] = "voucher-title-input";
    } else {
      inputProps["className"] = "description-input";
      multiline = true;
    }
    container = "voucher-description-container";
    inputProps["maxLength"] = 150;
  }

  if (label === "Routine type") {
    return (
      <FormControl className={container}>
        <FormLabel className="routine-label">{label}</FormLabel>
        <RadioGroup
          className="routine-radio"
          value={assignValue(value)}
          name={value}
        >
          {radioTypes.map((radio) => {
            return (
              <FormControlLabel
                label={radio.label}
                value={radio.value}
                control={<Radio className="radio-for-routine" />}
                onChange={handleChange}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  } else {
    return (
      <div className={container}>
        <TextField
          label={label}
          type={type}
          name={value}
          value={assignValue(value)}
          required={required}
          fullWidth
          multiline={multiline}
          defaultValue={defaultValue}
          rows={2}
          maxRows={2}
          InputProps={InputProps}
          inputProps={inputProps}
          InputLabelProps={inputLabelProps}
          onChange={handleChange}
        />
      </div>
    );
  }
}

export default VoucherField;
