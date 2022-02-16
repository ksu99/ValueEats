const fieldLabels = [
  {
    label: "Voucher title",
    value: "voucherTitle",
    type: "input",
    required: true,
  },
  {
    label: "Voucher value",
    value: "voucherValue",
    type: "number",
    required: true,
  },
  {
    label: "Voucher quantity",
    value: "voucherQuantity",
    type: "number",
    required: true,
  },
  {
    label: "Start time",
    value: "startTime",
    type: "time",
    required: true,
  },
  {
    label: "End time",
    value: "endTime",
    type: "time",
    required: true,
  },
  {
    label: "Start date",
    value: "startDate",
    type: "date",
    required: true,
  },
  {
    label: "End date",
    value: "endDate",
    type: "date",
    required: true,
  },
  {
    label: "Routine type",
    value: "routineType",
    type: "radio",
    required: false,
  },
  {
    label: "Occurrences",
    value: "occurrences",
    type: "number",
    required: false,
  },
  {
    label: "Release date",
    value: "releaseDate",
    type: "date",
    required: true,
  },
  {
    label: "Release time",
    value: "releaseTime",
    type: "time",
    required: true,
  },
  {
    label: "Description",
    value: "description",
    type: "input",
    required: false,
  },
];

export default fieldLabels;
