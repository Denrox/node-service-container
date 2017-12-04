## Installation

```bash
$ npm i node-sc
```

## Features

  * Service container for node, builds service with their dependencies
  * Allows to wrap native and installed node modules into container
  * Allows to use config file with declaratively specified dependencies
  * Allows to specify custom constructor functions for services

## Examples

  Here is a simple usage example:

```bash
$ npm i node-sc
```

  Configuration file structure for services container can look like this:

```javascript
{
  "fs": {
    //for modules located in node_modules path should be just a module name
    "location": "fs",
    //states that service will be a wrapped native module
    "isPackage": true
  },
  "path": {
    "location": "path",
    "isPackage": true
  },
  "errorFormatter": {
    //for custom services path shuld be relative
    "location": "./services/ErrorFormatter",
    //this states that our service should be instantiated via "new", or via custom constructor
    "construct": true,
    //our service will be a singleton, so we specify a custom constructor function for it
    "constructFn": "getInstance"
  },
  "fileLogger": {
    "location": "./services/FileLogger",
    "construct": true,
    //these are dependencies for our service, they are specified as aliases for other services
    "dependencies": [
      "fs",
      "path",
      "errorFormatter"
    ]
  }
}
```

  Usage of the service container is following:

```javascript
const ServiceContainer = require('node-sc');

let baseDir = __dirname;
let sc = ServiceContainer.getInstance(baseDir, {
  "fs": {
    //for modules located in node_modules path should be just a module name
    "location": "fs",
    //states that service will be a wrapped native module
    "isPackage": true
  },
  "path": {
    "location": "path",
    "isPackage": true
  },
  "errorFormatter": {
    //for custom services path shuld be relative
    "location": "./services/ErrorFormatter",
    //this states that our service should be instantiated via "new", or via custom constructor
    "construct": true,
    //our service will be a singleton, so we specify a custom constructor function for it
    "constructFn": "getInstance"
  },
  "fileLogger": {
    "location": "./services/FileLogger",
    "construct": true,
    //these are dependencies for our service, they are specified as aliases for other services
    "dependencies": [
      "fs",
      "path",
      "errorFormatter"
    ]
  }
});

sc.getService('fileLogger').logError('This is an example error text');
```

## License

  [MIT](LICENSE)
