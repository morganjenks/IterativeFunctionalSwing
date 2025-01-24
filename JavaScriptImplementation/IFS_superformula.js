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
    var mutationMagnitude = (endSamp - startSamp) / totalSampleCount;


    var startingSampleValue = bufferObject.peek(1, startSamp);
    for (var i = startSamp; i < endSamp; i++) {
        var currentSampleValue = bufferObject.peek(1/*channel 1*/, i); //unused in basic saw method here
        const rawPhase = i / (endSamp - startSamp)
        const theta =  i / (endSamp - startSamp) * 4 * Math.PI;

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
        const roomToGoUp = 1-currentSampleValue;
        const roomToGoDown = currentSampleValue;

        bufferObject.poke(
            /*channel*/1, 
            i/*samp index*/,  
            alpha*(0.5*currentSampleValue + 
                (
                    mutationMagnitude*(rawPhase*0.25 + r)+
                    startingSampleValue
                )
            )+(1-alpha)*currentSampleValue
        );
    }
};
