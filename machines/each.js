module.exports = {
  friendlyName: 'Each',
  description: 'Run a given machine on each item of an array.',
  extendedDescription: '',
  inputs: {
    array: {
      description: 'The array to loop over',
      typeclass: 'array',
      required: true
    },
    worker: {
      description: 'The machine to run on each item in the array.',
      extendedDescription: 'Expects machine to have a single (typeclass: "*") input called "value", and two exits: "success" and "error".',
      typeclass: 'machine',
      required: true
    },
    series: {
      description: 'Whether to run worker on one item at a time (in series)',
      extendedDescription: 'By default, all items are run at the same time (in parallel)',
      example: false,
      defaultsTo: false
    },
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      friendlyName: 'then',
      description: 'Done.'
    }
  },
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
