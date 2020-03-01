import * as express from "express";
import {Socket} from 'socket.io';
import {Nature} from './evolution/nature';

const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', PORT);

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on("connection", (socket: Socket) => {
    console.log(`A new client connected. ID: ${socket.id}`);
    let evolution: number;
    socket.on('calculate', (chromosomeSize: number) => {
        console.log(`Client requesting evolution of chromosome size ${chromosomeSize}\nStarting evolution...`);
        const populationSize: number = Math.floor(Math.pow(1.6, chromosomeSize));
        const nature = new Nature(populationSize, chromosomeSize);
        evolution = setInterval(() => {
            nature.run();
            socket.emit('epoch', {
                data: nature.getEpochData(),
                success: true
            });
        });
    });

    socket.on('disconnect', () => {
        console.log(`A client disconnected. ID: ${socket.id}`);
        if (evolution) { clearInterval(evolution); }
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
