var helpers = new Global("helpersShared");
var superformulaGlobal = new Global("superformulaShared");

superformulaGlobal.method = function(
    bufferObject, 
    sampleRate,
    params
){

    sampleRate = helpers.defaultValue(sampleRate, 44100);
    params = helpers.defaultValue(params, []);
    startPhase = helpers.defaultValue(params[0], 0);
    endPhase = helpers.defaultValue(params[1], 1);
    var m1 = helpers.defaultValue(params[2], 4);
    var m2 = helpers.defaultValue(params[3], 3);
    var n1 = helpers.defaultValue(params[4], 1);
    var n2 = helpers.defaultValue(params[5], 1);
    var n3 = helpers.defaultValue(params[6], 1);
    a = helpers.defaultValue(params[7], 1);
    b = helpers.defaultValue(params[8], 1);
    alpha = helpers.defaultValue(params[9], 0.5);

    var range = helpers.calculateSampleRange(bufferObject, sampleRate, startPhase, endPhase);
    var totalSampleCount = range.total;
    var startSamp = range.start;
    var endSamp = range.end;
    
    for (var i = startSamp; i < endSamp; i++) {
        const indexInBuffer = helpers.modulo(i, totalSampleCount);
        const currentSampleValue = bufferObject.peek(1, indexInBuffer);
        const rawPhase = helpers.remap(i, startSamp, endSamp, 0, 1);//i / (endSamp - startSamp);
        const theta =  rawPhase * 4 * Math.PI;

        // Apply the superformula expression
        const r = Math.pow(
            (
                Math.pow(Math.abs(Math.cos(m1 * theta / 4)), n2) * a
                + 
                Math.pow(Math.abs(Math.sin(m2 * theta / 4)),n3) * b
            ) / (a+b)
            ,
            n1
        );

        const mappedRadius = helpers.remap(r, 0, 1, startPhase, endPhase);
        const modRadius = helpers.modulo(mappedRadius, 1.0);

        bufferObject.poke(
            1, 
            indexInBuffer, 
            helpers.blend(currentSampleValue, modRadius, alpha)  
        );
    }
};
