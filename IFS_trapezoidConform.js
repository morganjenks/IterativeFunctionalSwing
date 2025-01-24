var trapezoidGlobal = new Global("trapezoidShared");
var helpers = new Global("helpersShared")


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


trapezoidGlobal.mapToUnitRamp = function (bufferObject) {
    //step 1: sample the function values

    helpers.print("buffer length: " + bufferObject.length());

    var ranges = helpers.calculateSampleRange(bufferObject, samplerate, 0, 1) ;

    helpers.print("total samps in buffer" + ranges.total);

    var normalizedXYCoords = [];//helpers.createArray(ranges.total, 0);
    

    var step = 1 / bufferObject.length();

    helpers.print(step);

    //set up normalized X range for coords, y is in bufferObject's incomming range
    for(var x = 0; x < ranges.total; x ++) {
        normalizedXYCoords.push({x: x/ranges.total, y: bufferObject.peek(1, x)});
        // helpers.print("x: " + x/ranges.total);
        // helpers.print("y: " + bufferObject.peek(1, x));
    }

    //step 2: find min and max of the function
    var yMin = Math.min.apply(
        null, 
        normalizedXYCoords.map(
            function(p){
                return p.y;
            }
        )
    );

    var yMax = Math.max.apply(
        null, 
        normalizedXYCoords.map(
            function(p) { 
                return p.y;
            }
        )
    );

    //step 3:  Normalize the Y values [0,1]
    normalizedXYCoords = normalizedXYCoords.map(
        function(p) {
            return {x: p.x, y: (p.y - yMin) / (yMax - yMin) };
        }
    );

    //step 4 : compute the cdf
    var totalArea = 0;
    var cumulative = [];
    for(var i = 0; i < normalizedXYCoords.length - 1; i++) {
        var x1 = normalizedXYCoords[i].x;
        var x2 = normalizedXYCoords[i+1].x;
        var y1 = normalizedXYCoords[i].y;
        var y2 = normalizedXYCoords[i+1].y;
        var area = (y1 + y2) / 2 * (x2 - x1);

        //Trapezoidal rule
        totalArea += area;
        // helpers.print("pushing total area for index : " + i);
        // helpers.print("cumulative area: " + totalArea);
        cumulative.push(totalArea);
    }
    // helpers.print("---------------normalizing area--------------");
    cumulative = cumulative.map(function(c) {
        // helpers.print(c/totalArea);
        return c / totalArea;
    });

    //step 6 : create the final mapping
    var mapped = [];
    for(var i = 0; i < normalizedXYCoords.length; i++) {
        mapped.push({x:normalizedXYCoords[i].x, y: cumulative[i] || 1});
    }

    helpers.print("~~~~~~~~~~~~~~poking into buffer~~~~~~~~~~~~~~~~~~~~~~~~");
    //write into the buffer
    for(var i = 0; i < ranges.total; i++)
    {
        helpers.print("index: " + i);
        helpers.print(mapped[i].y);
        bufferObject.poke(1, i, mapped[i].y);
    }

};


function anything() {

    // Get reference to buffer~ object
    var buffer = new Buffer(bufferName);
    if (!buffer) {
        helpers.print("Buffer not found: " + bufferName);
        return;
    } else {
        helpers.print("found buffer: " + bufferName);
    }

    helpers.print("processing the buffer for trapezoidal monotonicity")

    trapezoidGlobal.mapToUnitRamp(buffer);

};