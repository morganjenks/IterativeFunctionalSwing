var bufferManagerGlobal = new Global("bufferManagerShared");

bufferManagerGlobal.state = {
    bufferName: "",
    samplerate: 0,
    currentBuffer: null
};

bufferManagerGlobal.setSampleRate = function(sr) {
    if (typeof sr !== "number" || sr <= 0) {
        return false;
    }
    this.state.samplerate = sr;
    return true;
};

bufferManagerGlobal.getSampleRate = function() {
    return this.state.samplerate;
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Buffer instantiation method
bufferManagerGlobal.initBuffer = function() {
    if (!this.state.bufferName) {
        return null;
    }
    this.state.currentBuffer = new Buffer(this.state.bufferName);
    return this.state.currentBuffer;
};

// Setter that also initializes the buffer
bufferManagerGlobal.setBuffer = function(name) {
    if (typeof name !== "string" || name.trim() === "") {
        return false;
    }
    this.state.bufferName = name;
    return this.initBuffer() !== null;
};

// Getter for the buffer instance
bufferManagerGlobal.getBuffer = function() {
    if (!this.state.currentBuffer) {
        return this.initBuffer();
    }
    return this.state.currentBuffer;
};
