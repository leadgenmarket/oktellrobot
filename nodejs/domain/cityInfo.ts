class CityInfo{
    protected name: string
    protected inputs: string[]
    constructor(input: any){
        this.name = input.name
        this.inputs = input.inputs
    }

    getCityName = () =>{
        return this.name
    }

    getInputs = () => {
        return this.inputs
    }


}

export default CityInfo