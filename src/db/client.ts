import { createClient } from "@libsql/client";
import { DB_URL, DB_TOKEN} from "astro:env/server";

const client = createClient({
    url: DB_URL ?? "", 
    authToken: DB_TOKEN ?? "",
});

export async function getUsers() {
    try {
        const query = "SELECT * FROM users"
        const data = {
            status: 200,
            client: (await client.execute(query)).rows,
        }
        return data
    } catch (error) {
        const data = {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}