const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;
// eslint-disable-next-line prefer-regex-literals
const LinkRegExp = new RegExp(/^http(s)?:\/\/(www.)?([0-9A-Za-z.:%_/+\-#=]+)+(.[a-zA-Z]{2,3})(\/[0-9A-Za-z.@:%_/+\-#=]+)*$/);

module.exports = {
  INPUT_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  LinkRegExp,
};
