var helpers = new Global("helpersShared");
var sawGlobal = new Global("sawShared");

sawGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {

    helpers.print("running saw methodddd");
    // SET UP DEFAULTS if args are falsy
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []); //(params !== undefined && params !== null) ? params : [];
    startPhase = helpers.defaultValue(params[0], 0);// (startPhase !== undefined && startPhase !== null) ? startPhase : 0;
    endPhase = helpers.defaultValue(params[1], 1); //(endPhase !== undefined && endPhase !== null) ? endPhase : 1;
    var frequency = helpers.defaultValue(params[2], 1)
    var alpha = helpers.defaultValue(params[3], 1)
    var range = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = range.total;
    var startSamp = range.start;
    var endSamp = range.end;

    helpers.print(startSamp);
    helpers.print(endSamp);
    helpers.print(totalSampleCount);

    for (var i = startSamp; i < endSamp; i++) {
        var curSample = bufferObject.peek(1, i);
        var curPhase =  (frequency * i / (endSamp - startSamp)) % 1.0;
        bufferObject.poke(/*channel*/1, i, helpers.blend(curSample, curPhase, alpha));
    }
};
