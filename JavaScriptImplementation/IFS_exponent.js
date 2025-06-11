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

    for (var i = startSamp; i < endSamp; i++) {
        var indexInBuffer = helpers.modulo(i, totalSampleCount);
        var existingSampleValue = bufferObject.peek(1, indexInBuffer);
        var expandedPhase = helpers.remap(i, startSamp, endSamp, 0, 1) * freq;
        var step = Math.floor(expandedPhase);
        var exponentValue = Math.pow(helpers.modulo(expandedPhase, 1.0), exp);
        var rescaledScallop = helpers.remap(exponentValue + step, 0, freq, 0, 1);
        var remaped = ((endSamp-startSamp)/totalSampleCount*rescaledScallop) +  (startSamp / totalSampleCount)
        var pokeValue =  helpers.blend(existingSampleValue, remaped, alpha);
        bufferObject.poke(1, indexInBuffer, pokeValue);
    }
};
