import * as uuid from "uuid"
import { APIGatewayProxyEvent } from "aws-lambda"

import { TodoAccess } from "../dataLayer/todoAccess"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { TodoItem } from "../models/TodoItem"
import { getUserId } from "../lambda/utils"
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest"
import { TodoKeySchema } from "../models/todoKeySchema"

const todoAccess = new TodoAccess()

export async function getTodos(event: APIGatewayProxyEvent) {
    const userId = getUserId(event)

    return todoAccess.getAllTodos(userId)
}

export async function createTodo(event: APIGatewayProxyEvent, todoItem: CreateTodoRequest) {
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
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const schemaKey = {
        userId: userId,
        todoId: todoId
    } as TodoKeySchema

    return todoAccess.deleteTodo(todoId, schemaKey)
}

export async function updateTodosUrl(event: APIGatewayProxyEvent) {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const schemaKey = {
        userId: userId,
        todoId: todoId
    } as TodoKeySchema

    return await todoAccess.updateTodoURL(schemaKey)
}