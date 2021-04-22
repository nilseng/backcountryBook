import { v4 as uuid } from "uuid";

import { IdToken } from "@auth0/auth0-spa-js";

export const getImageBlobs = async (imageIds: string[]): Promise<{ id: string, blob: Blob }[]> => {
    const imageBlobs: { id: string, blob: Blob }[] = [];
    for (const id of imageIds) {
        const res = await fetch(`/api/image/${id}`).catch(e =>
            console.error(e)
        )
        if (res) {
            const imageBlob = await res.blob();
            imageBlobs.push({ id, blob: imageBlob });
        }
    }
    return imageBlobs
}

export const saveImages = async (token: IdToken, files: { id?: string, blob: Blob }[]) => {
    const formData = new FormData();
    const imageIds = [];
    for (const file of files) {
        // Assuming the image is already saved if it has an id
        if (file.id) continue;
        formData.append("images", file.blob);
        const imageId = uuid();
        imageIds.push(imageId);
        formData.append("imageIds", imageId);
    }
    if (imageIds.length > 0) {
        await fetch("/api/image", {
            headers: {
                authorization: `Bearer ${token.__raw}`,
            },
            method: "POST",
            body: formData,
        });
    }
    return imageIds;
}

export const deleteImages = async (token: IdToken, imageIds: string[]) => {
    await fetch(`/api/images`, {
        headers: {
            authorization: `Bearer ${token.__raw}`,
            'Content-Type': 'application/json',
        },
        method: "DELETE",
        body: JSON.stringify({ imageIds })
    }).catch(_ => console.error('Could not delete route.'))
}