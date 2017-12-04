module.exports = (() => {
  let fs;
  let path;
  let formatter;

  class FileLogger {

    constructor (fsService, pathService, errorFormatter) {
      fs = fsService;
      path = pathService;
      formatter = errorFormatter;
    }

    logError (errorText) {
      fs.appendFile(
        path.join(__dirname, '../logs/error.log'),
        formatter.formatError(errorText),
        (err, res) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

  }

  return FileLogger;
})();
