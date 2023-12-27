import express from "express";
import PeyethagoreanController from "../controller/peyethagorean-controller.js";
import { wrap } from "./error-handler.js";

// Separate by comments each one of the groups of APi

export const webRouter = express.Router();

// Desired actiond
webRouter.get("/partial", wrap(PeyethagoreanController.partialHandler));

webRouter.get("/integral", wrap(PeyethagoreanController.integralHandler));

export const endpointArray: string[] = ["/partial", "/integral"];