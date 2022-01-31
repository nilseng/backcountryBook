import aws from "aws-sdk";
import { Body } from "aws-sdk/clients/s3";
import sharp from "sharp";

// Configuration for aws s3
aws.config.update({ region: "eu-west-1" });
const s3 = new aws.S3();
const defaultBucket = "randohub";

const params = {
  Bucket: defaultBucket,
};

const imageQuality = 100;
const maxImageWidth = 1200;

export const getImage = async (Key: string, Bucket = defaultBucket) => {
  const params: aws.S3.GetObjectRequest = {
    Bucket,
    Key,
  };
  const data = await s3
    .getObject(params)
    .promise()
    .catch((e) => console.error(e));
  return data ? data.Body : data;
};

export const deleteImage = (_id: string) => {
  const params = {
    Bucket: defaultBucket,
    Key: _id,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) return { error: err };
    else return data;
  });
};

export const compressImage = async (buffer: Buffer): Promise<Buffer> => {
  const compressedImg = await sharp(buffer)
    .withMetadata()
    .webp({ quality: imageQuality })
    .rotate()
    .resize(maxImageWidth)
    .toBuffer();
  return compressedImg;
};

export const updateImage = async (key: string, body: Body) => {
  const compressedImage = await compressImage(body as Buffer);
  const data = await s3
    .upload({ ...params, Key: key, Body: compressedImage })
    .promise()
    .catch((e) => console.log("image update failed.", e));
  if (data) console.log(`Image with key=${key} updated.`);
};

export const uploadImage = async (Key: string, file: Express.Multer.File, Bucket = defaultBucket) => {
  const Body = await compressImage(file.buffer);
  if (!Body) throw new Error("Something went wrong compressing images.");
  const uploadParams = {
    Bucket,
    Body,
    Key,
  };
  await s3.upload(uploadParams).promise();
};

export const uploadImages = async (
  imageIds: string[] | string,
  files: Express.Multer.File[],
  Bucket = defaultBucket
) => {
  const res: { msg?: string; error?: string } = await Promise.all(
    Array.from(files.entries()).map(async ([_, file], i) => {
      await uploadImage(Array.isArray(imageIds) ? imageIds[i] : imageIds, file, Bucket);
    })
  )
    .then((_) => ({ msg: "Upload(s) successful!" }))
    .catch((_) => ({ error: "Something went wrong during upload(s)." }));
  return res;
};

export const compressAllImages = (): void => {
  s3.listObjectsV2(params, (err, data) => {
    if (!data.Contents) return console.log("No Contents in bucket");
    console.log(`Compressing ${data.Contents?.length} images...`);
    for (const imgRef of data.Contents) {
      if (!imgRef.Key) {
        console.log(imgRef, " missing Key");
        continue;
      }
      s3.getObject({ ...params, Key: imgRef.Key }, (err, data) => {
        if (err || !imgRef.Key || !data.Body) {
          console.log("Something went wrong when retrieving object with key ", imgRef.Key);
        } else {
          updateImage(imgRef.Key, data.Body);
        }
      });
    }
  });
};
