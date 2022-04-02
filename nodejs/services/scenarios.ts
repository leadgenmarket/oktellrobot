import Scenario from "../domain/scenarios";
import ScenariosRepository from "../repository/scenarios";

export default class ScenariosService {
    repository: ScenariosRepository
    constructor(repo: ScenariosRepository) {
        this.repository = repo
    }

    add = async (scenario: Scenario) => {
        var result = await this.repository.add(scenario)
        return result
    }

    update = async (scenario: Scenario) => {
        var result = await this.repository.update(scenario)
        return result
    }

    delete = async (id: string) => {
        var result = await this.repository.delete(id)
        return result
    }
}