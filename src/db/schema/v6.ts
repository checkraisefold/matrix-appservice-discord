/*
Copyright 2017, 2018 matrix-appservice-discord

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { IDbSchema } from "./dbschema";
import { DiscordStore } from "../../store";

export class Schema implements IDbSchema {
    public description = "create event_store and discord_msg_store tables";
    public async run(store: DiscordStore): Promise<void> {
        await store.db.Run(
            `DROP TABLE IF EXISTS event_store;`,
        );
        await store.createTable(`
            CREATE TABLE event_store (
                matrix_id TEXT NOT NULL,
                discord_id TEXT NOT NULL,
                PRIMARY KEY(matrix_id, discord_id)
        );`, "event_store");
        await store.createTable(`
            CREATE TABLE discord_msg_store (
                msg_id TEXT NOT NULL,
                channel_id TEXT NOT NULL,
                PRIMARY KEY(msg_id)
        );`, "discord_msg_store");
    }

    public async rollBack(store: DiscordStore): Promise<void> {
        await store.db.Exec(
            `DROP TABLE IF EXISTS event_store;` +
            `DROP TABLE IF EXISTS discord_msg_store;`,
        );
    }
}
