var helpers = new Global("helpersShared");
var toussaintGlobal = new Global("toussaintShared");

toussaintGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {

    // SET UP DEFAULTS if args are falsy
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);

    var steps = helpers.defaultValue(params[2], 1);
    var hits = helpers.defaultValue(params[3], 2);
    var rotation = helpers.defaultValue(params[4], 0);
    var alpha = helpers.defaultValue(params[5], 1);

    var ranges = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = ranges.total;
    var startSamp = ranges.start;
    var endSamp = ranges.end;
    var mutationMagnitude = (endSamp - startSamp) /totalSampleCount;

    var eucRamp = steppedToussaint(steps, hits, rotation);

    for (var i = startSamp; i < endSamp; i++) {
        const phaseInEuclid = helpers.remap(i, startSamp, endSamp, 0, 1);
        const step = Math.floor(phaseInEuclid * eucRamp.length);
        const value = helpers.remap(eucRamp[step], 0, 1, startPhase, endPhase);
        const existingSample = bufferObject.peek(1, i);
        bufferObject.poke(1, i, helpers.blend(existingSample, value, alpha));
    }
};


function steppedToussaint(steps, hits, rotation) {
    var seq = helpers.pulsesToSteps(
        eucToussaint(steps, hits, rotation), 
        hits
    );

    return seq;
}

// Toussaint's Method
function eucToussaint(totalSteps, hits, rotation) {
    // Initialize rhythm array with zeros
    var rhythm = helpers.createArray(totalSteps, 0);

    // Calculate the step intervals
    var step = totalSteps / hits;

    // Place hits into the rhythm array
    for (var i = 0; i < hits; i++) {
        var position = Math.round((i * step + rotation) % totalSteps);
        rhythm[position] = 1;
    }

    return rhythm;
}

