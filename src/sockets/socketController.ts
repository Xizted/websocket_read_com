import { SerialPort } from 'serialport';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ReadlineParser } from '@serialport/parser-readline';

const socketController = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  console.log('Usuario conectado \n');

  const path = 'COM1';

  const serialPort = new SerialPort({
    path: path,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    autoOpen: false,
    lock: true,
  });

  const parser = serialPort.pipe(new ReadlineParser({ delimiter: 'ST,GS,+ ' }));

  serialPort.on('open', () => {
    socket.emit('open port', 'Puerto Serial abierto');
  });

  serialPort.open(async (err) => {
    if (err) {
      socket.emit('error', 'La balanza no está conectada');
    }
  });

  parser.on('data', async (data: string, err: Error) => {
    if (err) {
      socket.emit('error', err.message);
    }
    await sleep(1000);
    socket.emit('data', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado \n');
    if (serialPort.isOpen) {
      serialPort.close((err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default socketController;
