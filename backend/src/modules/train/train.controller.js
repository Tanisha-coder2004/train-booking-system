const TrainService = require("./train.service")

 class TrainController{
    constructor(TrainService){
        this.trainService = TrainService
    }

    searchTrain = async (req, res) => {
        try {
            const { src, dest, date } = req.query;
            const trains = await this.trainService.searchTrains(src, dest, date);
            return res.status(200).json(trains);
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = TrainController;