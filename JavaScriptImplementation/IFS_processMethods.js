//print for max console
function print(msg) {
    post(msg + "\n")
}

// Access the global objects
var sawGlobal = new Global("sawShared")
var exponentGlobal = new Global("exponentShared")
// var bjorklundGlobal = new Global("bjorklundShared")
// var toussaintGlobal = new Global("toussaintShared")
// var superformulaGlobal = new Global("superformulaShared")
// var stepGlobal = new Global("stepShared")
// var circleMapGlobal = new Global("standardCircleMapShared")

const methods = {
    "saw":sawGlobal, 
    "exp":exponentGlobal,
    // "bjo":bjorklundGlobal,
    // "tou":toussaintGlobal,
    // "sup":superformulaGlobal,
    // "stp":stepGlobal,
    // "cir":circleMapGlobal,
}

var bufferName = ""
var samplerate

function setBuffer(name) {
    if (typeof name !== "string" || name.trim() === "") {
        print("Invalid buffer name.");
        return;
    }
    bufferName = name;
    print("Buffer set to: " + bufferName);
}

function setSampleRate(sr) {
    if (typeof sr !== "number" || sr <= 0) {
        print("Invalid sample rate: " + sr);
        return;
    }
    samplerate = sr;
    print("Sample rate set to: " + sr);
}

//runs for unmatched first list element from Max
function anything() {
    var method, startPhase, endPhase, params
    
    // Convert incoming arguments to a proper array
    var argsArray = arrayfromargs(arguments)
    if(argsArray.length < 3) {
        print("Not enough arguments passed in.. arguments should be (methodName startPhase endPhase [optional arguments list])")
        return
    } 
    
    method = argsArray.shift()
    startPhase = parseFloat(argsArray.shift())
    endPhase = parseFloat(argsArray.shift())
    params = argsArray
    

    //get reference to buffer~ object
	const buffer = new Buffer(bufferName)
    if (!buffer) {
        print("Buffer not found: " + bufferName)
        return
    } 

    if(!methods[method]) {
        print(`Unsupported method '${method}'. Available methods: ${Object.keys(methods).join(", ")}`)
        return
    }
    
    //Mutate the buffer
    methods[method].method(
        buffer,
        samplerate,
        startPhase,
        endPhase,
        params
    )
}


