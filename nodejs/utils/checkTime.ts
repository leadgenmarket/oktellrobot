const checkTime = (timeUnix: number): number => {
    let time = new Date(timeUnix * 1000)
    if (time.getHours() >= 21) {
        time.setDate(time.getDate()+1)
        time.setHours(10)
        time.setMinutes(0)
    } else if (time.getHours()>0 && time.getHours()<10) {
        time.setHours(10)
        time.setMinutes(0)
    }
    return Math.floor(time.getTime() / 1000)
}

export default checkTime