export const dateFormat = (date?: Date) => {
  if (date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    return `${year}年${month + 1}月`;
  }
};
