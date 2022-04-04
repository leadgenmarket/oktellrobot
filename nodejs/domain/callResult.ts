class CallResult{
    protected success: boolean
    protected askedToCallLater: boolean
    protected answered: boolean
    constructor(answered: boolean, success: boolean, askedToCallLater: boolean){
        this.answered = answered
        this.askedToCallLater = askedToCallLater
        this.success = success
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
}

export default CallResult