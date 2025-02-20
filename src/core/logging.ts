import winston from 'winston'; 

const rootLogger: winston.Logger = winston.createLogger({
  level: 'silly',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export const getLogger = () => {
  return rootLogger;
};