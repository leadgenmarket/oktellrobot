class CallResult{
    protected success: boolean
    protected askedToCallLater: boolean
    protected answered: boolean
    protected recordingURL?: string
    protected phoneNumber?: string
    protected cityInfo?:string
    constructor(answered: boolean, success: boolean, askedToCallLater: boolean, recordingURL?: string, phoneNumber?:string, cityInfo?: string){
        this.answered = answered
        this.askedToCallLater = askedToCallLater
        this.success = success
        this.recordingURL = recordingURL
        this.phoneNumber = phoneNumber
        this.cityInfo = cityInfo
    }

    isAnswered = () => {
        return this.answered
    }

    setAnswered = (flag: boolean) => {
        this.answered = flag
    }

    isSuccess = ()=>{
        return this.success
    }

    isAskedToCallLater(){
        return this.askedToCallLater
    }
    
    getRecordingURL(){
        return this.recordingURL
    }
    getPhoneNumber(){
        return this.phoneNumber
    }

    getCityInfo(){
        return this.cityInfo
    }
}

export default CallResult