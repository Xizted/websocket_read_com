import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import socketController from './sockets/socketController';
import morgan from 'morgan';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: '*',
  },
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(
  cors({
    origin: '*',
  })
);

app.use(express.static('public'));
io.on('connection', socketController);

export default server;
