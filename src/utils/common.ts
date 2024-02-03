import moment from 'moment';
import { NumberLimit } from '../constant/number';

export const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i = i + 1) {
    hash += Math.pow(
      str.charCodeAt(i) * NumberLimit.THIRTY_ONE,
      str.length - i
    );
    // tslint:disable-next-line: no-bitwise
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

export const capitalizeFirstLetter = (str: string) => {
  // converting first letter to uppercase
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const changeDateFormat = (
  dataValue: string,
  dateFormate = 'DD MMM YYYY | hh:mm A'
) => {
  if (dataValue) {
    return moment(dataValue).format(dateFormate);
  } else {
    return '-';
  }
};
export const displayNumberValue = (num: number | null) => {
  return num ? num.toFixed(NumberLimit.TWO) : NumberLimit.ZERO;
};

export const downloadJson = (exportObj: any, exportName: string) => {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
export const displayIntensity = (num = NumberLimit.ZERO) => {
  return num ? Math.round(num * NumberLimit.ONE_HUNDRED) : NumberLimit.ZERO;
};

export const displayRoundNumber = (num: number | null) => {
  return num ? Math.ceil(num) : NumberLimit.ZERO;
};
