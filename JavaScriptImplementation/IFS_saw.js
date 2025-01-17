var sawGlobal = new Global("sawShared")
var helpers = new Global("helpersShared")

sawGlobal.method = function(
    bufferObject,
    sampleRate = 44100,
    startPhase = 0,
    endPhase = 1,
    params = []
) {
    //SET UP DEFAULTS if args are falsy
    var blend = params[0] ?? 1
    var freq = params[1] ?? 1


    var totalSampleCount = bufferObject.length() * sampleRate / 1000
    var startSamp = (startPhase * totalSampleCount).toFixed()
    var endSamp = (endPhase * totalSampleCount).toFixed()

    for (var i = startSamp; i < endSamp; i++) {
        //var sampleValue = bufferObject.peek(1/*channel 1*/, i) //unused in basic saw method here
        const curPhase =  (freq * i / (endSamp - startSamp)) % 1.0
        bufferObject.poke(/*channel*/1, i, curPhase)
    }
}