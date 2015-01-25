module.exports = {
  friendlyName: 'Each',
  description: 'Run a given machine on each item of an array.',
  extendedDescription: '',
  inputs: {
    array: {
      typeclass: 'array'
    },
    series: {
      example: false
    },
    worker: {
      typeclass: 'machine'
    }
  },
  defaultExit: 'then',
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', example: 'TODO' } },
  fn: function (inputs,exits) {
    var async = require('async');
    // Get the name of the first input to the worker
    // TODO: replace this with "typeclass: machine" type checking
    if (!inputs.worker.inputs || typeof inputs.worker.inputs != 'object') {
      return exits.error("Worker misconfigured: no inputs object found");
    }
    var workerInputs = Object.keys(inputs.worker.inputs);
    if (workerInputs.length === 0) {
      return exits.error("Worker misconfigured: inputs object empty");
    }
    var loop = inputs.series ? async.eachSeries : async.each;
    loop(inputs.array, function(item, cb) {
      var config = {};
      config[workerInputs[0]] = item;
      inputs.worker(config).exec(cb);
    }, exits);
  },

};
