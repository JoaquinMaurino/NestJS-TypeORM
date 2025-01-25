export const generateId = <T extends { id: number }>(list: T[]): number => {
    if (list.length === 0) {
        return 1
    }
    let maxId = 0;
    for (const element of list) {
        if (element.id > maxId) {
            maxId = element.id
        }
    }
    return maxId + 1;
}