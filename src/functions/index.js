import { date } from 'quasar';

export const getToday = () => {
  return {
    y: date.formatDate(Date.now(), 'YYYY'),
    m: date.formatDate(Date.now(), 'MM'),
    d: date.formatDate(Date.now(), 'DD'),
  }
}

export const birthToAge = (birthDay) => {
  const today = getToday();
  let age = today.y - birthDay.slice(0, 4);
  if (today.m - birthDay.slice(5, 7) < 0 || today.d - birthDay.slice(8, 10) < 0) {
    age--;
  }
  return age;
}
