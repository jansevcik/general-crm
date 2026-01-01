const { exec } = require('child_process');

console.log('Starting localtunnel on port 3000...');
const tunnel = exec('npx localtunnel --port 3000');

tunnel.stdout.on('data', (data) => {
    console.log(data.toString());
});

tunnel.stderr.on('data', (data) => {
    console.error(data.toString());
});

tunnel.on('close', (code) => {
    console.log(`Tunnel process exited with code ${code}`);
});
