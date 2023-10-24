import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import { webRouter } from './router/web';
import { SystemParameter } from "./system-parameter";

const app: Express = express();
const port = Number(SystemParameter.getString("PORT"));

app.use(webRouter);

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
