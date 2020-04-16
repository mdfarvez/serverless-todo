import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from "aws-sdk"

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const todosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await docClient
    .update({
      TableName: todosTable,
      Key: {
        "todoId": todoId
      },
      UpdateExpression: "set #name=:n, dueDate=:dD, done=:d",
      ExpressionAttributeValues: {
        ":n": updatedTodo.name,
        ":dD": updatedTodo.dueDate,
        ":d": updatedTodo.done
      },
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ReturnValues: "UPDATED_NEW"
    })
    .promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Updated Successfully'
  }
}
