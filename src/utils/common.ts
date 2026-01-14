export const formatTime = (time: number) => {
    return new Date(time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}


export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}