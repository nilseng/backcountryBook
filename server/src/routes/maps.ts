import express from "express"
import mbxUploads from "@mapbox/mapbox-sdk/services/uploads";

const router = express.Router()

const uploadsClient = mbxUploads({ accessToken: process.env.MAPBOX_ACCESS_TOKEN || "" });

const getCredentials = async () => {
    const response = await uploadsClient
        .createUploadCredentials()
        .send().catch(e => e);
    return response.body;
}

router.post("/maps/upload", async (req, res) => {
    const credentials = await getCredentials()
    res.status(200).json("credentials requested")
})

export default router