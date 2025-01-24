helpers = new Global("helpersShared");
bruteMonotonicityGlobal = new Global("bruteMonotonicityShared");



//runs for unmatched first list element from Max
bruteMonotonicityGlobal.method = function (bufferObject, samplerate) {

    var range = helpers.calculateSampleRange(bufferObject, samplerate, 0, 1);
    var totalSampleCount = range.total;
    
    var prevSampleValue = 0;

    for(var i = 0; i < totalSampleCount; i++) {
        var currentSampleValue = bufferObject.peek(1, i);
        var delta = currentSampleValue - prevSampleValue;
        var increasing = delta >= 0;
        var rectifiedDelta = (increasing) ? delta : 0;
		var updatedCurrentSample = prevSampleValue + rectifiedDelta;
		bufferObject.poke(1, i, updatedCurrentSample);
		prevSampleValue = updatedCurrentSample;
    }
}


