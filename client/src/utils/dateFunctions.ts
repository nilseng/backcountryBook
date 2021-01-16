export const convertToDateInputFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const month =
        date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const day =
        date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const hours =
        date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
};
