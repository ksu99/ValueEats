import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme) => ({
  fabGreen: {
    right: 10,
    color: theme.palette.common.white,
    alignSelf: "center",
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[600],
    },
  },
}));

export const compareDates = (date1, date2) => {
  const day1 = date1.getDate();
  const month1 = date1.getMonth();
  const year1 = date1.getYear();

  const day2 = date2.getDate();
  const month2 = date2.getMonth();
  const year2 = date2.getYear();

  return year2 >= year1 && month2 >= month1 && day2 >= day1;
};

export const rRuleConfigure = (voucher, currDate) => {
  const recurringVoucher = [];

  if (voucher.rRule !== undefined) {
    const rRule = voucher.rRule.substring(6).split(";");
    const freq = rRule[0].substring(5);
    const count = parseInt(rRule[1].substring(6));

    for (let i = 0; i < count; ++i) {
      let copyStart = new Date(voucher.startDate);
      let copyEnd = new Date(voucher.endDate);

      if (freq === "DAILY") {
        copyStart.setDate(copyStart.getDate() + i);
        copyEnd.setDate(copyEnd.getDate() + i);
      } else if (freq === "WEEKLY") {
        copyStart.setDate(copyStart.getDate() + 7 * i);
        copyEnd.setDate(copyEnd.getDate() + 7 * i);
      } else {
        copyStart.setMonth(copyStart.getMonth() + i);
        copyEnd.setMonth(copyEnd.getMonth() + i);
      }

      if (
        compareDates(copyStart, currDate) &&
        compareDates(currDate, copyEnd)
      ) {
        recurringVoucher.push({
          ...voucher,
          startDate: copyStart,
          endDate: copyEnd,
        });
      }
    }
  } else {
    recurringVoucher.push(voucher);
  }

  return recurringVoucher;
};
