export const abbreviateNumber = (value) => {
  let newValue = value;
  if (value > 1000) {
    const suffixes = ["", "k", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }
    newValue = newValue.toPrecision(3);
    newValue += suffixes[suffixNum];
  }
  return newValue;
};
