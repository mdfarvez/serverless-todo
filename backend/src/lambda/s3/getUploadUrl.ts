import * as AWS from "aws-sdk"

const S3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(todoId: string) {
    return S3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: Number(urlExpiration)
    })
}