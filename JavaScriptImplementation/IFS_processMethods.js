var bufferManager               =   new Global("bufferManagerShared");
var helpers                     =   new Global("helpersShared");
var sawGlobal                   =   new Global("sawShared");
var exponentGlobal              =   new Global("exponentShared");
var bjorklundGlobal             =   new Global("bjorklundShared");
var toussaintGlobal             =   new Global("toussaintShared");
var bresenhamGlobal             =   new Global("bresenhamShared");
var superformulaGlobal          =   new Global("superformulaShared");
var standardCircleMapGlobal     =   new Global("standardCircleMapShared");
var phaseDensityGlobal          =   new Global("phaseDensityShared");
var adaptiveMonotonicityGlobal  =   new Global("adaptiveMonotonicityShared");
var bruteMonotonicityGlobal     =   new Global("bruteMonotonicityShared");

var methods = {
    "saw"                   : sawGlobal, 
    "exp"                   : exponentGlobal,
    "pdc"                   : phaseDensityGlobal,
    "cir"                   : standardCircleMapGlobal,
    "bjo"                   : bjorklundGlobal,
    "tou"                   : toussaintGlobal,
    "bre"                   : bresenhamGlobal,
    "sup"                   : superformulaGlobal,
    "adaptiveMonotonicity"  : adaptiveMonotonicityGlobal,
    "bruteMonotonicity"     : bruteMonotonicityGlobal,
};

function setBuffer(name) {
	bufferManager.setBuffer(name);
}

function setSampleRate(sr) {
	bufferManager.setSampleRate(sr);
}

function anything() {
    helpers.print("running anything method")
	var method, startPhase, endPhase, params;
    
    // Convert incoming arguments to a proper array
    var argsArray = arrayfromargs(arguments);
    if (argsArray.length < 1) {
        helpers.print("Not enough arguments passed in.. arguments should be (methodName [optional arguments list])");
        return;
    } 
    
    method = argsArray.shift();
    params = argsArray;
    
    if (!methods[method]) {
        helpers.print("Unsupported method");
        return;
    }

    helpers.print(params);
    
    helpers.print("method is: " + method);
    // Mutate the buffer
    methods[method].method(
        bufferManager.getBuffer(),
        bufferManager.getSampleRate(),
        params
    );

    helpers.print("method complete");
}
