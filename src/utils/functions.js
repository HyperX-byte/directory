export function convertUTCtoLocal(UTCDateString, onlyDate = false) {
    let convertedLocalDateTime = new Date(UTCDateString);
  
    let options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: "true",
      hour: "2-digit",
      minute: "2-digit",
      // timeZone: "Asia/Kolkata",
    };
    if (onlyDate) {
      return convertedLocalDateTime
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
    }
    return convertedLocalDateTime.toLocaleString(undefined, options);
}