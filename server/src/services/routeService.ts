import aws from "aws-sdk";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
const mbxClient = require('@mapbox/mapbox-sdk');
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mbxUploads from '@mapbox/mapbox-sdk/services/uploads';
const baseClient = mbxClient({ accessToken: process.env.MAPBOX_UPLOAD_TOKEN });
const uploadsClient = mbxUploads(baseClient)

const getCredentials = async () => {
    const response = await uploadsClient
        .createUploadCredentials()
        .send();
    return response.body;
}

export const createMapboxUpload = async (routeId: string, file: any) => {
    const credentials = await getCredentials()
    await putFileOnS3(credentials, file)
    const res = await uploadsClient.createUpload({
        tileset: `nilseng.${routeId}`,
        url: credentials.url,
        name: routeId, //TODO: Change to trip name?
    } as any).send()
}

export const putFileOnS3 = (credentials: any, file: any) => {
    const s3 = new aws.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: 'us-east-1'
    });
    return s3.putObject({
        Bucket: credentials.bucket,
        Key: credentials.key,
        Body: Buffer.from(file)
    }).promise();
};

export const listUploads = async () => {
    const res = await uploadsClient.listUploads({})
        .send()
    return res
}