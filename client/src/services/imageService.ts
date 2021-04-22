export const getImageBlobs = async (imageIds: string[]) => {
    const imageBlobs: any[] = [];
    for (const id of imageIds) {
        const res = await fetch(`/api/image/${id}`).catch(e =>
            console.error(e)
        )
        if (res) {
            const imageBlob = await res.blob();
            imageBlobs.push(imageBlob);
        }
    }
    return imageBlobs
}