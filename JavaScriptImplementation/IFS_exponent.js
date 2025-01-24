var helpers = new Global("helpersShared");
var exponentGlobal = new Global("exponentShared");

exponentGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {

    // SET UP DEFAULTS if args are falsy
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);

    var freq = helpers.defaultValue(params[2], 1);
    var exp = helpers.defaultValue(params[3], 2);
    var alpha = helpers.defaultValue(params[4], 1);

    var range = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = range.total;
    var startSamp = range.start;
    var endSamp = range.end;
    var mutationMagnitude = (endSamp - startSamp) / totalSampleCount;

    for (var i = startSamp; i < endSamp; i++) {
        var preMutationSampleValue = bufferObject.peek(1/*channel 1*/, i);
        var expandedPhase = freq * i / (endSamp - startSamp);
        var step = Math.floor(expandedPhase) / freq;
        var steppedExponent = (Math.pow(expandedPhase % 1.0, exp) / freq) + step;
        var rescaledScallop = steppedExponent * mutationMagnitude;
        var deviation = rescaledScallop - (i / totalSampleCount);
        bufferObject.poke(1, i, helpers.blend(preMutationSampleValue, preMutationSampleValue + deviation, alpha));
    }
};
