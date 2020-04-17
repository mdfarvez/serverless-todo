import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";

const logger = createLogger('auth')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODO_INDEX
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
}