import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import { webRouter } from './router/web';
import { SystemParameter } from "./system-parameter";

const app: Express = express();
const port = Number(SystemParameter.getString("PORT"));
const ip = SystemParameter.getString("PRIVATE_IP");

app.use(webRouter);

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, ip, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
