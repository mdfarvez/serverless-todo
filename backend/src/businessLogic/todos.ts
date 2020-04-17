import * as uuid from "uuid"
import { APIGatewayProxyEvent } from "aws-lambda"

import { TodoAccess } from "../dataLayer/todoAccess"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { TodoItem } from "../models/TodoItem"
import { getUserId } from "../lambda/utils"
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest"
import { TodoKeySchema } from "../models/todoKeySchema"
import { createLogger } from "../utils/logger"

const logger = createLogger('auth')

const todoAccess = new TodoAccess()

export async function getTodos(event: APIGatewayProxyEvent) {
    logger.info('Preparing for get all todo for a specific user')
    const userId = getUserId(event)
    return todoAccess.getAllTodos(userId)
}

export async function createTodo(event: APIGatewayProxyEvent, todoItem: CreateTodoRequest) {
    logger.info('Preparing for create a todo')

    const todoId = uuid.v4()
    const userId = getUserId(event)

    const newTodo = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: todoItem.name,
        dueDate: todoItem.dueDate,
        done: false
    } as TodoItem
    
    return await todoAccess.createTodo(newTodo)
}

export async function updateTodo(event: APIGatewayProxyEvent) {
    logger.info('Preparing for update a todo')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const schemaKey = {
        userId: userId,
        todoId: todoId
    } as TodoKeySchema

    return await todoAccess.updateTodo(updatedTodo, schemaKey)
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    logger.info('Preparing for delete a todo')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const schemaKey = {
        userId: userId,
        todoId: todoId
    } as TodoKeySchema

    return todoAccess.deleteTodo(todoId, schemaKey)
}

export async function updateTodosUrl(event: APIGatewayProxyEvent) {
    logger.info('Preparing for inserting image url for a todo')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const schemaKey = {
        userId: userId,
        todoId: todoId
    } as TodoKeySchema

    return await todoAccess.updateTodoURL(schemaKey)
}