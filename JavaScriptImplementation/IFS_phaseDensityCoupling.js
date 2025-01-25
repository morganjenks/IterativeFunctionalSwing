
var helpers = new Global("helpersShared");
var phaseDensityGlobal = new Global("phaseDensityShared");

phaseDensityGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {

    // Set defaults
    sampleRate  =helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);

    var alpha = helpers.defaultValue(params[2], 0.5); // Base blending factor
    var minFreq = helpers.defaultValue(params[3], 0.2); // Minimum frequency
    var maxFreq = helpers.defaultValue(params[4], 3); // Maximum frequency
    var minWake = helpers.defaultValue(params[5], 0.1); // Minimum offset
    var maxWake = helpers.defaultValue(params[6], 0.4); // Maximum offset

    var range = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSamples = range.total;
    var startSamp = range.start;
    var endSamp = range.end;

    // Read initial buffer values
    var prevValues = helpers.createArray(totalSamples, function (i) {
        return bufferObject.peek(1, i);
    });

    // Track phase shift across iterations
    var globalPhaseShift = 0;

    // Process buffer samples
    for (var i = startSamp; i < endSamp; i++) {
        var indexInBuffer = Math.round(helpers.modulo(i, totalSamples));
        var basis = indexInBuffer / totalSamples;

        //Calculate deviation from basis
        var initialDeviation = Math.abs(prevValues[indexInBuffer] - basis);

        // Non-linear scaling for deviation
        var scaledDeviation = Math.pow(initialDeviation, 1.5); // Exponential scaling

        //Calculate offset index
        var offsetIndex = helpers.modulo(
            Math.round(
                helpers.remap(scaledDeviation, 0, 1, minWake, maxWake) 
                * totalSamples
            ), 
            totalSamples
        );

        // Sample the offset index
        var offsetSample = bufferObject.peek(1, offsetIndex);
        var offsetBasis = offsetIndex / totalSamples;
        var offsetDeviation = Math.abs(offsetSample - offsetBasis);

        //Determine perturbation frequency
        var combinedDeviation = Math.sqrt(initialDeviation * offsetDeviation); // Blend deviations
        var perturbationFreq = helpers.remap(combinedDeviation, 1, 0, minFreq, maxFreq);

        // Introduce a global phase drift
        globalPhaseShift += (0.01 * combinedDeviation); // Slowly shift phase based on deviation
        var driftedBasis = helpers.modulo((basis + globalPhaseShift), 1);

        // Phase modulation for dynamic behavior
        var phaseMod = Math.sin(2 * Math.PI * driftedBasis) * 0.5 + 0.5; // [0, 1] range
        perturbationFreq *= phaseMod; // Modulate frequency dynamically

        //Calculate perturbation value
        var perturbationValue =
            Math.sin(2 * Math.PI * perturbationFreq * driftedBasis) * (1 - scaledDeviation);

        // Dynamically adjust alpha blending
        var dynamicAlpha = alpha * (1 - combinedDeviation); // Higher deviation = less influence from previous state

        // Add divergence: Use neighbor deviations to vary blending
        var neighborDeviation = Math.abs(prevValues[helpers.modulo((indexInBuffer + 1), totalSamples)] - basis);
        dynamicAlpha += neighborDeviation * 0.2; // Boost alpha based on neighbor

        //Blend new value
        var mixedSample = helpers.blend(prevValues[indexInBuffer], basis + perturbationValue, dynamicAlpha);

        // Write back to buffer
        bufferObject.poke(1, indexInBuffer, mixedSample);
    }
};



