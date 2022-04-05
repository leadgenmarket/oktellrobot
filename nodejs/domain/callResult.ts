class CallResult{
    protected success: boolean
    protected askedToCallLater: boolean
    protected answered: boolean
    protected recordingURL?: string
    constructor(answered: boolean, success: boolean, askedToCallLater: boolean, recordingURL?: string){
        this.answered = answered
        this.askedToCallLater = askedToCallLater
        this.success = success
        this.recordingURL = recordingURL
    }

    isAnswered = () => {
        return this.answered
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
}

export default CallResult