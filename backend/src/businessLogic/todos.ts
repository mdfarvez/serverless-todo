import { TodoAccess } from "../dataLayer/todoAccess";

const todoAccess = new TodoAccess()

export async function getTodos(userId: string) {
    return todoAccess.getAllTodos(userId)
}