import Train from "./train.model"

export class TrainRepository{
    async findByQuery(filter){
       return await Train.find(filter)
    }
}