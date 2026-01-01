const net = require('net');

const client = new net.Socket();
console.log('Attempting to connect to localhost:5432...');

client.connect(5432, '127.0.0.1', function () {
    console.log('Connected to port 5432 successfully!');
    client.destroy();
});

client.on('error', function (err) {
    console.error('Connection failed:', err.message);
    console.error('Ensure Docker container is running and port is mapped.');
});
