module.exports = (() => {
  let formatter = null;

  class ErrorFormatter {

    formatError (errorText) {
      return (new Date()).toString() + '|' + errorText + '\n';
    }

  }

  return {
    getInstance: function () {
      if (formatter === null) {
        formatter = new ErrorFormatter();
      }

      return formatter;
    }
  };
})();
