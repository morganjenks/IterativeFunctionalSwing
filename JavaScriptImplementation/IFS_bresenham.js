var helpers = new Global("helpersShared");
var bresenhamGlobal = new Global("bresenhamShared");

bresenhamGlobal.method = function(
    bufferObject,
    sampleRate,
    params
) {

    // SET UP DEFAULTS if args are falsy
    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);

    var steps = helpers.defaultValue(params[2], 1);
    var hits = helpers.defaultValue(params[3], 2);
    var rotation = helpers.defaultValue(params[4], 0);
    var alpha = helpers.defaultValue(params[5], 1);

    var ranges = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = ranges.total;
    var startSamp = ranges.start;
    var endSamp = ranges.end;
    var mutationMagnitude = (endSamp - startSamp) / totalSampleCount;

    helpers.print("mutation magnitude: " + mutationMagnitude);

    var eucRamp = eucBresenham(steps, hits, rotation);

    var minmax = helpers.minMaxOfArray(eucRamp);
    helpers.print("minmax::: " + minmax);
    var min = minmax.min;
    var max = minmax.max;
    // var min = Math.min(eucRamp.map(function(v) {
    //     return eucRamp[v];
    // }));

    // var max = Math.max(eucRamp.map(function(v) { 
    //     return [v];
    // }));

    helpers.print(min + " " + max + " min/max");


    for (var i = startSamp; i < endSamp; i++) {
        const existingSample = bufferObject.peek(1, i);
        const phaseInEuclid = (i - startSamp) / (endSamp - startSamp);
        const step = Math.floor(phaseInEuclid * eucRamp.length);
        //helpers.print("raw step: " + eucRamp[step]);
        const value = helpers.remap(eucRamp[step], min, max, startPhase, endPhase);//startPhase+(mutationMagnitude / eucRamp[step]);
        helpers.print("scaleedStap: " + value);
        bufferObject.poke(1, i, helpers.blend(existingSample, value, alpha));
    }

};


function eucBresenham(steps, hits, rotation) {
        var slope = hits / steps;
        var result = helpers.createArray(steps, 0);
        var previous = 0;
        for(var i = 0; i < steps; i++) {
            var current = Math.floor(i * slope);
            // you might do the following for triggers, 
            // but we're making ramps here
            // result[i] = current != previous ? 1 : 0;
            // previous = current

            result[i] = current;
        }
        return result
}