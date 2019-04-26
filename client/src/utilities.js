// function that returns true if value is email, false otherwise
export function verifyEmail(value) {
  var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRex.test(value)) {
    return true;
  }
  return false;
}
// function that verifies if a string has a given length or not
export function verifyLength(value, length) {
  if (value.length >= length) {
    return true;
  }
  return false;
}

// function that verifies if two strings are equal
export function compare(string1, string2) {
  if (string1 === string2) {
    return true;
  }
  return false;
}