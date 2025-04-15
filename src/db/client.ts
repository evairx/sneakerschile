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
            data: (await client.execute(query)).rows,
        }
        return data
    } catch (error) {
        const data = {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
        return data
    }
}

export async function getProducts() {
    try {
        const products = (await client.execute("SELECT * FROM products")).rows;
        const sizes = (await client.execute("SELECT product_id, size, stock FROM product_sizes")).rows;
        
        const data = {
          status: 200,
          data: products.map(p => ({
            ...p,
            values: sizes.filter(s => s.product_id === p.id).map(s => ({
              size: s.size,
              stock: s.stock
            }))
          }))
        };
        return data
    } catch (error) {
        const data = {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
        return data
    }
}

export async function getRegions() {
    try {
        const regions = (await client.execute("SELECT * FROM regions")).rows;

        const shipments = (await client.execute("SELECT * FROM shipments")).rows;
        
        const data = {
            status: 200,
            data: regions.map(region => ({
                id: region.id,
                region: region.name,
                shipments: shipments
                    .filter(s => s.region_id === region.id)
                    .map(s => ({
                        name: s.name,
                        price: s.price,
                        content: s.content,
                        payOnDelivery: Boolean(s.pay_on_delivery),
                        adaptive: Boolean(s.adaptive)
                    }))
            }))
        };
        return data;

    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}
