import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import * as uuid from "uuid"
import 'source-map-support/register'
import * as AWS from "aws-sdk"

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from "../utils"
import { TodoItem } from "../../models/TodoItem"

const todosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing create TODO event', JSON.stringify(event))

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const itemId = uuid.v4()
  const userId = getUserId(event)

  const todo = {
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  } as TodoItem

  await docClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: todo
    })
  }
}
