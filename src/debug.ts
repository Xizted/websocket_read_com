import { SerialPort } from 'serialport';

const path = 'COM1';

const serialPort = new SerialPort({
  path: path,
  baudRate: 9600,
  autoOpen: false,
  lock: true,
});

serialPort.open((err) => {
  if (err) {
    console.log(new Error('The balance is not connected'));
    return;
  }
});

serialPort.on('open', () => {
  console.log('Serial Port Opend');
});

serialPort.on('data', (data: Buffer, err: Error) => {
  if (err) {
    console.log(err);
  }
  console.log({ Buffer: data, data: data.toString() });

  serialPort.close();
});
