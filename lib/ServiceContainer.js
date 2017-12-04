module.exports = (() => {
  'use strict';

  const path = require('path');

  let servicesContainer = null;
  let baseDir;
  let config;

  /**
   * @description Loads service module file
   * @param {String} serviceName - service name to include
   * @return {Object} - service object
   */
  function loadServiceModule (serviceName) {
    let service;
    let servicePath = config[serviceName].isPackage
      ? config[serviceName].location
      : path.join(baseDir, config[serviceName].location);

    try {
      service = require(
        servicePath
      );
    } catch (e) {
      throw new Error(
        'Unable to load service ' + serviceName +
        ' with location ' + path.join(baseDir, servicePath)
      );
    }

    return service;
  }

  class ServiceContainer {

    constructor (baseDirPath, serviceConfig) {
      if (!baseDirPath) {
        throw new Error(
          'Please specify base dir relative to which your service locations' +
          ' will be specified'
        );
      }
      if (!serviceConfig) {
        throw new Error(
          'Correct configuration object for service container should be specified'
        );
      }
      baseDir = baseDirPath;
      config = serviceConfig;
    }

    /**
     * @description Builds service, injects it's dependencies
     * @param {String} serviceName - service alias to load
     * @returns {Object} - service object
     */
    getService (serviceName) {
      let service;
      let ServiceConstructor;
      let serviceDependencies;
      let dependency;
      let dependencies = [];

      if (config.hasOwnProperty(serviceName)) {
        if (config[serviceName].construct === true) {
          // calculating dependencies
          ServiceConstructor = loadServiceModule(serviceName);

          serviceDependencies = config[serviceName].dependencies;
          if (typeof serviceDependencies === 'object') {
            for (dependency in serviceDependencies) {
              if (serviceDependencies.hasOwnProperty(dependency)) {
                dependencies.push(this.getService(
                  serviceDependencies[dependency]
                ));
              }
            }
          }

          // injecting dependencies
          if (!config[serviceName].constructFn) {
            if (config[serviceName].extends) {
              ServiceConstructor.prototype = this.getService(
                config[serviceName].extends
              );
            }

            service = new (
              Function.prototype.bind.apply(
                ServiceConstructor, [null].concat(dependencies)
              )
            )();
          } else {
            service = ServiceConstructor[config[serviceName].constructFn]
              .apply(ServiceConstructor, dependencies);
          }
        } else {
          // just returning service if constuct is not set
          service = loadServiceModule(serviceName);
        }
      } else {
        throw new Error(
          'No alias found for service ' + serviceName
        );
      }

      return service;
    }

  }

  return {
    'getInstance': function (baseDirPath, config) {
      if (servicesContainer === null) {
        servicesContainer = new ServiceContainer(baseDirPath, config);
      }

      return servicesContainer;
    }
  };
})();
