import { getProductById, getShippingById } from '@/db/client';
import { paymentMethods } from '@/const/payments';
import { nanoid } from 'nanoid';
import Flow from '@evairx/flow'

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const data = await request.json();
        const { idOrder, name, address, email, items, shipping, payment } = data;
        
        if (!items || !Array.isArray(items) || !shipping || !payment || !name || !address) {
            return Response.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        let totalPrice = 0;
        const processedItems = [];
        
        for (const item of items) {
            const productResponse = await getProductById(item.id);
            
            if (!productResponse || productResponse.status !== 200 || !productResponse.data) {
                return Response.json({ error: `Product with ID ${item.id} not found` }, { status: 404 });
            }
            
            const product = productResponse.data;
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;
            
            processedItems.push({
                id: product.id,
                idOrder: idOrder,
                name: product.name,
                quantity: item.quantity,
                size: item.size,
                price: product.price,
                image: product.image
            });
        }

        const shippingResponse = await getShippingById(shipping);
        
        if (!shippingResponse || shippingResponse.status !== 200 || !shippingResponse.data) {
            return Response.json({ error: `Shipping method with ID ${shipping} not found` }, { status: 404 });
        }
        
        const shippingData = shippingResponse.data;
        
        let shippingPrice = 0;
        if (shippingData.adaptive) {
            shippingPrice = 1000;
        } else {
            shippingPrice = shippingData.price || 0;
        }
        
        let finalTotal = totalPrice + shippingPrice;

        const paymentIndex = parseInt(payment) - 1;
        
        if (paymentIndex < 0 || paymentIndex >= paymentMethods.length) {
            return Response.json({ error: `Invalid payment method ID: ${payment}` }, { status: 400 });
        }
        
        const selectedPayment = paymentMethods[paymentIndex];
        
        let fee = 0;
        if (selectedPayment && selectedPayment.fee) {
            fee = finalTotal * selectedPayment.fee.comision;
            const ivaOnFee = fee * selectedPayment.fee.iva;
            fee += ivaOnFee;

            finalTotal += fee;
        }

        const orderData = {
            id: idOrder,
            name: name,
            address: address,
            status: "sin pagar",
            items: processedItems,
            total: Math.round(finalTotal),
            payment: {
                id: payment,
                label: selectedPayment.name
            },
            shipping: {
                name: shippingData.name,
                price: shippingPrice
            },
            tax: Math.round(fee)
        };

        let response;

        if (payment === "1") {
            const flow = new Flow({
                apiKey: "70656D1F-D8CB-4CCE-B0B9-93E514394LB3",
                secretKey: "3617bbbee7b94bf7471b6ffa2ede18ea8a7500bb",
                production: false
            });
        
            const create = await flow.create({
                commerceOrder: idOrder,
                subject: "SneakersChile - Pago de prueba",
                currency: "CLP",
                amount: orderData.total,
                email: email,
                urlConfirmation: `https://redirect.evairx.me`,
                urlReturn: `https://sneakerschile.pages.dev/confirmation?ord=${idOrder}`,
                paymentMethod: payment
            });
            
            response = create;
        } else {
            response = {
                success: true,
                data: {
                    order: orderData
                }
            };
        }
        
        return Response.json(response, { status: 200 });
        
    } catch (error) {
        console.error('Error in POST request:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}