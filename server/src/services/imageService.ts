import aws from "aws-sdk"

// Configuration for aws s3
aws.config.update({ region: "eu-west-1" });
const s3 = new aws.S3();
const defaultBucket = "randohub";

export const deleteImage = (_id: string) => {
    const params = {
        Bucket: defaultBucket,
        Key: _id,
    };
    s3.deleteObject(params, (err, data) => {
        if (err) return { error: err }
        else return data
    })
}