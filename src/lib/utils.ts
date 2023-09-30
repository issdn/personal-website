export const getNextIndex = (i: number, listLength: number) => {
    return i = (i + 1) % listLength
}

export const getPreviousIndex = (i: number, listLength: number) => {
    return i = (i + listLength - 1) % listLength
}