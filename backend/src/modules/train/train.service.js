import { TrainRepository } from "./train.repository";

export class TrainService {
  constructor(TrainRepository) {
    this.trainRepository = TrainRepository;
  }

  async searchTrains(from, to, date) {
    if(!from || !to || !date){
        throw new Error("kindly fill all fields")
    }
   
    if (from === to) {
      throw new Error("Source and Destination cannot be the same");
    }
    const query = { 
      src: from, 
      dest: to 
    };

    if (date) {
      query.date = date; 
    }
    const trains = await this.trainRepository.findByQuery(query);
    return trains;
  }
}

