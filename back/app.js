const Evolution = require('./objects/evolution.js');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

const socketServer = socket => {
    let connected;
    socket.on('calculate', size => {
        console.log("Starting Genetic Algorithm.");
        let evolution = new Evolution(100, size);
        connected = setInterval(() => {
            // evolution.calculateFitness();
            evolution.newEpoch();
            let data = {
                epochId: evolution.getEpoch(),
                population: evolution.getGeneCodes(),
                solutions: evolution.getEpochSolutions()
            };
            socket.emit('epoch', {
                data: data,
                success: true
            });
            evolution.epoch += 1;
            // evolution.newEpoch();
        }, 0.00001);
    });

    socket.on('disconnect', () => {
        if (connected) {
            clearInterval(connected);
        }
    });

    io.emit('connected', { data: { message: 'You are connected!' }, success: true });
};

io.on('connection', socketServer);
http.listen(port);
console.log(`Listening on port: ${port}`);
