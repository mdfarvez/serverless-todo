import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoKeySchema } from "../models/todoKeySchema";

const logger = createLogger('auth')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODO_INDEX,
        private readonly todosImageBucket = process.env.TODO_S3_BUCKET
    ) { }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos item')

        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :id',
                ExpressionAttributeValues: {
                    ':id': userId
                },
                ScanIndexForward: false
            })
            .promise()

        const todos = result.Items

        logger.info('Got all todos', todos)

        return todos as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Creating a new Todo Item', todo)

        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: todo
            })
            .promise()

        logger.info(`${todo} created successfully`)

        return todo
    }

    async updateTodo(todo: UpdateTodoRequest, keys: TodoKeySchema): Promise<string> {

        logger.info('Updating todo', todo)

        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: keys,
                UpdateExpression: "set #name=:n, dueDate=:dD, done=:d",
                ExpressionAttributeValues: {
                    ":n": todo.name,
                    ":dD": todo.dueDate,
                    ":d": todo.done
                },
                ExpressionAttributeNames: {
                    "#name": "name"
                },
                ReturnValues: "UPDATED_NEW"
            })
            .promise()

        logger.info(`${todo} Update successfully`)

        return 'Updated Successfully'
    }

    async deleteTodo(todoId: string, keys: TodoKeySchema): Promise<string> {
        logger.info('Deleting todo with todoId', todoId)

        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: keys
            })
            .promise()

        logger.info(`${todoId} deleted successfully`)

        return 'Deleted successfully'
    }

    async updateTodoURL(keys: TodoKeySchema) {
        logger.info('Updating todos url', keys.todoId)

        const url = `https://${this.todosImageBucket}.s3.amazonaws.com/${keys.todoId}`

        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: keys,
                UpdateExpression: "set attachmentUrl=:url",
                ExpressionAttributeValues: {
                    ":url": url
                }
            })
            .promise()

        logger.info('Updated todos url successfully')
    }
}