import express from "express"
import { TrainController } from "./train.controller";
import { TrainRepository } from "./train.repository";
import { TrainService } from "./train.service";
const router = express.Router();

const trainRepository = new TrainRepository();
const trainService = new TrainService();
const trainController = new TrainController()

router.get("/trains",trainController.searchTrain)