var helpers = new Global("helpersShared");
var sawGlobal = new Global("sawShared");

sawGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []); 
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1); 
    var frequency = helpers.defaultValue(params[2], 1)
    var alpha = helpers.defaultValue(params[3], 1)
    
    var range = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = range.total;
    var startSamp = range.start;
    var endSamp = range.end;

    for (var i = startSamp; i < endSamp; i++) {
        const indexInBuffer = helpers.modulo(i, totalSampleCount);
        const curSample = bufferObject.peek(1, indexInBuffer);
        const frequencyPhase = helpers.remap(i, startSamp, endSamp, 0, frequency);
        const modPhase =  helpers.modulo(frequencyPhase, 1.0);
        bufferObject.poke(1, indexInBuffer, helpers.blend(curSample, modPhase, alpha));
    }
};
