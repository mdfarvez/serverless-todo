import * as AWS from "aws-sdk"
import { createLogger } from "../../utils/logger"

const logger = createLogger('auth')

const S3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(todoId: string) {
    logger.info('Creating Signed URL for uploading attachment to S3 bucket')
    
    return S3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: Number(urlExpiration)
    })
}