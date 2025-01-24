//set up global reference
var helpersGlobal = new Global("helpersShared");

helpersGlobal.print = function(msg) {
    post(msg + "\n");
};

//return something if defined, else return defaultValue
helpersGlobal.defaultValue = function(something, defaultValue) {
    var value = something !== undefined && something !== null ? something : defaultValue;
    return value;
};

helpersGlobal.calculateSampleRange = function(bufferObject, sampleRate, startPhase, endPhase) {
    var totalSampleCount = (bufferObject.length() * sampleRate) / 1000;
    return {
        total: totalSampleCount,
        start: Math.round(startPhase * totalSampleCount),
        end: Math.round(endPhase * totalSampleCount)
    };
};

//lerp
helpersGlobal.blend = function(a, b, t) {
    return t*b + (1-t)*a;
}

helpersGlobal.createArray = function(length, defaultValue) {
    var arr = new Array(length);
    for (var i = 0; i < length; i++) {
        arr[i] = typeof defaultValue === 'function' ? defaultValue(i) : defaultValue;
    }
    return arr;
};

helpersGlobal.remap = function(value, fromMin, fromMax, toMin, toMax) {
    return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
};


//used for euclidean functions. converts pulses array of 1s or 0s into normalized step ramp.
helpersGlobal.pulsesToSteps = function(array, hits) {
    var count = 0
    for(var i = 0; i < array.length; i++)
    {
        if(array[i] == 1)
        {
            count+=1/hits;
            array[i] = count;
        } else {
            array[i] = count
        }
    }

    return array
}

helpersGlobal.minMaxOfArray = function(arr) {
        var yMin = Math.min.apply(
            null, 
            arr.map(
                function(p){
                    return p;
                }
            )
        );
    
        var yMax = Math.max.apply(
            null, 
            arr.map(
                function(p) { 
                    return p;
                }
            )
        );

        return {min:yMin, max:yMax};
};