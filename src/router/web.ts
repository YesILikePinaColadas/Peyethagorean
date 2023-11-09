import express from "express";
import PeyethagoreanController from "../controller/peyethagorean-controller.js";

// Separate by comments each one of the groups of APi

export const webRouter = express.Router();

// Desired actiond
webRouter.get("/partial", PeyethagoreanController.partialHandler);

webRouter.get("/integral", PeyethagoreanController.integralHandler);

