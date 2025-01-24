var helpers = new Global("helpersShared");
var bjorklundGlobal = new Global("bjorklundShared");


bjorklundGlobal.method = function(
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


    var eucRamp = steppedBjorklund(steps, hits, rotation);
    
    for (var i = startSamp; i < endSamp; i++) {
        const phaseInEuclid = helpers.remap(i, startSamp, endSamp, 0, 1);//(i - startSamp) / (endSamp - startSamp);
        const step = Math.floor(phaseInEuclid * eucRamp.length);
        const value = helpers.remap(eucRamp[step], 0, 1, startPhase, endPhase);//startPhase+(mutationMagnitude*eucRamp[step]);
        const existingSample = bufferObject.peek(1, i);
        bufferObject.poke(1, i, helpers.blend(existingSample, value, alpha));
        
    }

};


// Bjorklund's Algorithm
function eucBjorklund(totalSteps, hits) {
    // Special case: if no hits, return all zeros
    if (hits === 0) return new Array(totalSteps).fill(0);

    // Special case: if hits equal totalSteps, return all ones
    if (hits === totalSteps) return new Array(totalSteps).fill(1);

    // Initialize the pattern and remainders
    var counts = [];
    var remainders = [hits];
    var divisor = totalSteps - hits;
    var level = 0;

    // Build counts and remainders using Bjorklund's procedure
    while (remainders[level] > 1) {
        counts.push(Math.floor(divisor / remainders[level]));
        remainders.push(divisor % remainders[level]);
        divisor = remainders[level];
        level++;
    }
    counts.push(divisor);

    // Build the pattern using the counts and remainders
    var pattern = [];
    var build = function(level) {
        if (level === -1) {
            pattern.push(0);
        } else if (level === -2) {
            pattern.push(1);
        } else {
            for (var i = 0; i < counts[level]; i++) {
                build(level - 1);
            }
            if (remainders[level] !== 0) {
                build(level - 2);
            }
        }
    };
    build(level);

    return pattern;
}

function rotate(nums, k) {

    for (var i = 0; i < k; i++) {
        nums.unshift(nums.pop());
    }
  
    return nums;
}

function steppedBjorklund(steps, hits, rotation)
{
    var stepSeq = helpers.pulsesToSteps(
        rotate(
            eucBjorklund(steps, hits), 
            rotation
        ),
        hits
    );
    return stepSeq;
}
