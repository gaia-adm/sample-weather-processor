# sample weather data processor

This is a sample weather data processor for GAIA analytics. It is based on "gaiaadm/result-processing" Docker image and adds a sample weather data processor implemented in Node.js. It processes data format from <a href="http://api.openweathermap.org/data/2.5/history/city">http://api.openweathermap.org/data/2.5/history/city</a>

## Building

Execute:
- docker build -t gaiaadm/sample-weather-processor .

## Running

Execute:
- docker run -d -e AMQ_USER="admin" -e AMQ_PASSWORD="mypass" -v "/tmp:/upload" --link rabbitmq:amqserver --link mgs:metricsgw --name sample-weather-processor gaiaadm/sample-weather-processor

Note that for development it is recommended to mount a local directory containing result processor directory to /src/processors or mount the processor directory into /src/processors/{processorName}
