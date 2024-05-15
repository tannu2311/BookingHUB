import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import imageModel from "@/models/roomImages";
import { getToken } from "next-auth/jwt";
import AWS from 'aws-sdk';
import { Storage } from "@google-cloud/storage";
import path from "path";

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const uploadToS3 = async (buffer, key) => {
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ACL: 'public-read', // uploaded file public
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location;
};

const keyFilename = path.join(process.cwd(), process.env.GOOGLE_CLOUD_JSON_FILE);

const gcs = new Storage({
    keyFilename: keyFilename,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const uploadToGCS = async (buffer, key, imageType) => {
    const bucket = gcs.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    const file = bucket.file(key);
    await file.save(buffer, {
        gzip: true,
        metadata: {
            contentType: imageType,
            cacheControl: 'public, max-age=31536000'
        },
    });

    return `https://storage.googleapis.com/${file.name}`;
};

const handleFileUpload = async (image, campaignId, userId) => {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + '-' + image.name;
    const key = `bookinghub/${userId}/${campaignId}/${filename}`;

    // Upload the file
    let imageUrl;
    if (process.env.CLOUD_SERVICE_NAME == 'aws') {
        imageUrl = await uploadToS3(buffer, key);
    }
    else {
        imageUrl = await uploadToGCS(buffer, key, image.type);
    }

    let newdata = {
        campaignId: campaignId,
        userId: userId,
        image: imageUrl,
    };
    let imageObj = await imageModel.create(newdata);

    return imageObj._id;
};


export async function POST(request) {
    try {
        const data = await request.formData();
        const files = data.getAll("files[]")

        const token = await getToken({ req: request });
        let userId = token.sub;

        let campaignid = request.nextUrl.searchParams.get("id");

        const imagePromises = files.map((image) => handleFileUpload(image, campaignid, userId));

        const imageIds = await Promise.all(imagePromises);

        return NextResponse.json({ message: 'Added image.', imageIds, status: 1 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
};


export async function DELETE(request) {
    try {

        let imageid = request.nextUrl.searchParams.get("id");

        if (imageid) {
            let imageObj = await imageModel.findById(imageid);
            if (imageObj) {
                let url = new URL(imageObj.image);

                const key = url.pathname.substring(1);

                if ((imageObj.image).includes('storage.googleapis.com')) {
                    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
                    let deleteobj = await gcs.bucket(bucketName).file(key).delete();
                    
                } else {
                    const params = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: key,
                    };
                    let deleteResult = await s3.deleteObject(params).promise();
                }

                let deletimg = await imageModel.findByIdAndDelete(imageid);
                return NextResponse.json({ message: "Deleted Successfully.", status: 1 })
            }
            else {
                return NextResponse.json({ message: "Image Not Found.", status: 0 })
            }
        }
        else {
            let imgArray = await request.json();

            const deletePromises = imgArray.map(async (imageId) => {
                let imageObj = await imageModel.findById(imageId);

                if (imageObj) {
                    let url = new URL(imageObj.image);

                    const key = url.pathname.substring(1);

                    if ((imageObj.image).includes('storage.googleapis.com')) {
                        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
                        let deleteobj = await gcs.bucket(bucketName).file(key).delete();
  
                    } else {
                        const params = {
                            Bucket: process.env.BUCKET_NAME,
                            Key: key,
                        };
                        let deleteResult = await s3.deleteObject(params).promise();
                    }

                    let deletimg = await imageModel.findByIdAndDelete(imageid);
                }
                else {
                    return NextResponse.json({ message: "Image Not Found.", status: 0 })
                }
            });

            await Promise.all(deletePromises);
            return NextResponse.json({ message: "Deleted Successfully.", status: 1 });
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function GET(request) {
    try {
        const token = await getToken({ req: request })

        let id = request.nextUrl.searchParams.get("id");

        if (id) {
            const camp_images = await imageModel.find({ 'campaignId': id });
            return NextResponse.json({ camp_images, status: 1 })

        }
        return NextResponse.json({ message: " Invalid campaign id.", status: 0 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}