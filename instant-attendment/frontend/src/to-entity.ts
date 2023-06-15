import { IClient } from "./client";

export const toEntity = (d: any): IClient => ({
    id: d.id,
    name: d.name,
    socketId: d.socketId
})
