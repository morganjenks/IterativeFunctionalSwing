var adaptiveMonotonicityGlobal = new Global("adaptiveMonotonicityShared");
var helpers = new Global("helpersShared");


adaptiveMonotonicityGlobal.method = function (bufferObject, samplerate) {
    var samples = [];
    var slopes = [];

    var ranges = helpers.calculateSampleRange(bufferObject, samplerate, 0, 1) ;
    
    // Calculate slopes between adjacent points
    for(var i = 0; i < ranges.total - 1; i++) {
        var y1 = bufferObject.peek(1, i);
        var y2 = bufferObject.peek(1, i + 1);
        var slope = y2 - y1;
        slopes.push(slope);
        samples.push(y1);
    }
    samples.push(bufferObject.peek(1, ranges.total - 1));
    
    // Find minimum slope (most negative)
    var minMaxSlope = helpers.minMaxOfArray(slopes);
    var minSlope = minMaxSlope.min;
    
    // Transform slopes to ensure minimum becomes zero
    var transformed = [];
    var currentY = samples[0];
    transformed.push(currentY);
    
    for(var i = 0; i < slopes.length; i++) {
        // Adjust slope relative to minimum
        var adjustedSlope = slopes[i] - minSlope;
        currentY += adjustedSlope;
        transformed.push(currentY);
    }
    
    // Normalize to [0,1] range
    var minMaxY = helpers.minMaxOfArray(transformed);
    var minY = minMaxY.min;
    var maxY = minMaxY.max;
    
    for(var i = 0; i < transformed.length; i++) {
        var normalizedY = (transformed[i] - minY) / (maxY - minY);
        bufferObject.poke(1, i, normalizedY);
    }
};
