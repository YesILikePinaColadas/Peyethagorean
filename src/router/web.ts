import express from "express";
import PeyethagoreanController from "../controller/peyethagorean-controller";

// Separate by comments each one of the groups of APi

export const webRouter = express.Router();

// Desired actiond
webRouter.get("/partial", PeyethagoreanController.partialController);

webRouter.get("/integral", PeyethagoreanController.integralController);

