import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { updateTodosUrl } from '../../businessLogic/todos'
import { getUploadUrl } from '../s3/getUploadUrl'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', JSON.stringify(event))

  const todoId = event.pathParameters.todoId

  await updateTodosUrl(event)

  logger.info('AttachmentURL inserted to DB successfully')

  const url = getUploadUrl(todoId)

  logger.info('Got Signed url for uploading attachment', url)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}