const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

const socketServer = socket => {
    let connected;
    socket.on('calculate', size => {
        console.log("CALCULATING");
        let positions = Array.from({length: size}, () => 0);
        let population = [positions];
        let epoch = 0;
        connected = setInterval(() => {
            population.push(positions);
            let data = {
                epochId: epoch,
                population: population,
                solutions: []
            };
            epoch += 1;
            socket.emit('epoch', {
                data: data,
                success: true
            });
        }, 0.000001);
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
