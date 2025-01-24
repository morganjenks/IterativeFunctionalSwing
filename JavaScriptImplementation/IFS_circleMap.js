var helpers = new Global("helpersShared")
var standardCircleMapGlobal = new Global("standardCircleMapShared");

function printme(msg) {
    post(msg + "\n");
}

standardCircleMapGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {
    if(!bufferObject) {
        printme("buffer object is invalid")
        return;
    }

    // SET UP DEFAULTS if args are undefined
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);
    var k = helpers.defaultValue(params[2], 1);
    var omega = helpers.defaultValue(params[3], 0.1);
    var startValue = helpers.defaultValue(params[4], 0);
    var alpha = helpers.defaultValue(params[5], 0.5);

    var sampleRange = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase) 
    var totalSampleCount = sampleRange.total;
    var startSamp = sampleRange.start;
    var endSamp = sampleRange.end;


    var existingValues = helpers.createArray(
        totalSampleCount, 
        function (i) {
            return bufferObject.peek(1, i);
        }
    );

    // Initialize phase value
    var y = startValue;

    // Set the very first sample to the start phase
    bufferObject.poke(/*channel*/ 1, startSamp % totalSampleCount /*samp index*/, y);

    // Begin the loop from startSamp + 1
    for (var i = startSamp + 1; i < endSamp; i++) {

        // Apply the modified dynamical formula, feeding back into y
        y = (y + omega - (k / (2 * Math.PI)) * Math.sin(2 * Math.PI * y)) % 1;

        // Write the result to the buffer (modulus with totalSampleCount)
        bufferObject.poke(
            /*channel*/ 1, 
            i % totalSampleCount /*samp index*/, 
            helpers.blend(existingValues[i], y, alpha)
        );
    }
}
