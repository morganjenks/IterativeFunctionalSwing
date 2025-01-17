let bufferHelpersGlobal = new Global("helpersShared")


bufferHelpersGlobal.calculateSampleRange = function(bufferObject, sampleRate, startPhase, endPhase) {
    var totalSampleCount = (bufferObject.length() * sampleRate) / 1000
    return {
        total:totalSampleCount,
        start: Math.round(startPhase * totalSampleCount),
        end: Math.round(endPhase * totalSampleCount),
    }
}
