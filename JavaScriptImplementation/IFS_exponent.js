var exponentGlobal = new Global("exponentShared");

exponentGlobal.method = function(
    bufferObject,
    sampleRate = 44100,
    startPhase = 0,
    endPhase = 1,
    params = []
) {
    //SET UP DEFAULTS if args are falsy
    var freq = params[0] ?? 1;
    var exp = params[1] ?? 2;


    var totalSampleCount = bufferObject.length() * sampleRate / 1000;
    var startSamp = (startPhase * totalSampleCount).toFixed();
    var endSamp = (endPhase * totalSampleCount).toFixed();
    var mutationMagnitude = (endSamp - startSamp) / totalSampleCount;

    for (var i = startSamp; i < endSamp; i++) {
        var preMutationSampleValue = bufferObject.peek(1/*channel 1*/, i); //unused in basic saw method here
        const expandedPhase = freq * i / (endSamp - startSamp);
        const step = Math.floor(expandedPhase) / freq;
        const steppedExponent =  (Math.pow(expandedPhase % 1.0, exp) / freq) + step;
        const rescaledScallop = steppedExponent*mutationMagnitude;
        const deviation = rescaledScallop - (i / (totalSampleCount)); 
        bufferObject.poke(/*channel*/1, i, preMutationSampleValue + deviation);
    }
}