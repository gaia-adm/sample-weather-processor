'use strict';

var makeSource = require("stream-json");
var Assembler = require("stream-json/utils/Assembler");

exitOnSignal('SIGTERM');

var params = getProcessParameters();

if (Object.keys(params).length > 0) {
    // custom metadata keys are prefixed with C_
    console.error('City: ' + params.C_CITY);
    console.error('Country: ' + params.C_COUNTRY);
} else {
    console.log('[]');
    process.exit(0);
}

var source = makeSource();
var assembler = new Assembler();

console.log('[');

source.output.on("data", function(chunk) {
    if (assembler[chunk.name]) {
      assembler[chunk.name](chunk.value);
    }
});

source.output.on("end", function() {
    processWeather(assembler.current);
    console.log(']');
    process.exit(0);
});

process.stdin.setEncoding('utf8');
process.stdin.pipe(source.input);

/**
 * Processes weather object from <a href="http://api.openweathermap.org/data/2.5/history/city">http://api.openweathermap.org/data/2.5/history/city</a>
 */
function processWeather(weather) {
    // TODO this should ideally be done in stream way - receive individual items instead of the weather object
    if (weather.cnt > 0) {
        var list = weather.list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (i > 0) {
                console.log(',');
            }
            processWeatherItem(item);
        }
    }
}

function processWeatherItem(item) {
    console.log(JSON.stringify({
        "event": "general", "time": new Date(item.dt).toISOString(), "source": {
            "origin": "http://api.openweathermap.org/data/2.5/history/city"
        }, "tags": {
            "type": "weather", "city": params.C_CITY, "country": params.C_COUNTRY
        }, "data": {
            "temp": item.main.temp,
            "pressure": item.main.pressure,
            "humidity": item.main.humidity,
            "windspeed": item.wind.speed
        }
    }));
}

function exitOnSignal(signal) {
    process.on(signal, function() {
        console.error('Caught ' + signal + ', exiting');
        process.exit(1);
    });
}

function getProcessParameters() {
    var params = {};
    var keys = Object.keys(process.env);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.lastIndexOf('P_', 0) === 0) {
            var value = process.env[key];
            params[key.substr(2)] = value;
        }
    }
    return params;
}

