var helpers = new Global("helpersShared");
var sawGlobal = new Global("sawShared");
var exponentGlobal = new Global("exponentShared");
var bjorklundGlobal = new Global("bjorklundShared");
var toussaintGlobal = new Global("toussaintShared");
var bresenhamGlobal = new Global("bresenhamShared");
var phaseDensityGlobal = new Global("phaseDensityShared");
var standardCircleMapGlobal = new Global("standardCircleMapShared");
var superformulaGlobal = new Global("superformulaShared");

var methods = {
    "saw": sawGlobal, 
    "exp": exponentGlobal,
    "pdc": phaseDensityGlobal,
    "cir": standardCircleMapGlobal,
    "bjo": bjorklundGlobal,
    "tou": toussaintGlobal,
    "bre": bresenhamGlobal,
    "sup": superformulaGlobal
};

var bufferName = "";
var samplerate;

function setBuffer(name) {
    if (typeof name !== "string" || name.trim() === "") {
        helpers.print("Invalid buffer name.");
        return;
    }
    bufferName = name;
    helpers.print("Buffer set to: " + bufferName);
}

function setSampleRate(sr) {
    if (typeof sr !== "number" || sr <= 0) {
        helpers.print("Invalid sample rate: " + sr);
        return;
    }
    samplerate = sr;
    helpers.print("Sample rate set to: " + sr);
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
    
    // Get reference to buffer~ object
    var buffer = new Buffer(bufferName);
    if (!buffer) {
        helpers.print("Buffer not found: " + bufferName);
        return;
    } else {
        helpers.print("found buffer: " + bufferName);
    }
    
    helpers.print(methods);

    if (!methods[method]) {
        helpers.print("Unsupported method");
        return;
    }
    
    helpers.print("method is: " + method);
    // Mutate the buffer
    methods[method].method(
        buffer,
        samplerate,
        params
    );

    helpers.print("method complete");
}
