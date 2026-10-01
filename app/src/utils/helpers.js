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

/**
 * Attempts to convert a time string to UTC
 * format with simple method.
 *
 * For example "2019-07-09 15:22:03" converts to "2019-07-09T15:22:03Z"
 * If the string is already in UTC format, it will be returned in the original UTC form.
 * If it's in a format that cannot be properly converted, it will also be returned in original form.
 *
 * Context:
 * This is primarily a helper for TimeAgo functions
 * in the application, as the Openml API currently returns
 * timestamp strings that are not always in UTC format.
 *
 * This caused time skews on display in the application.
 * **/
export const toUTC = (originalDateString) => {
  let utcAttempt = originalDateString?.replace(" ", "T") + "Z";

  const date = new Date(utcAttempt);
  return isNaN(date) ? originalDateString : date.toISOString();
};
