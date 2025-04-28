import { getProductById, getShippingById } from '@/db/client';
import { paymentMethods } from '@/const/payments';

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const data = await request.json();
        const { items, shipping, payment } = data;
        
        if (!items || !Array.isArray(items) || !shipping || !payment) {
            return Response.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        let totalPrice = 0;
        
        for (const item of items) {
            const productResponse = await getProductById(item.id);
            
            if (!productResponse || productResponse.status !== 200 || !productResponse.data) {
                return Response.json({ error: `Product with ID ${item.id} not found` }, { status: 404 });
            }
            
            const product = productResponse.data;
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;
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
   
        const selectedPayment = paymentMethods.find(pm => pm.name === payment);
        
        let fee = 0;
        if (selectedPayment && selectedPayment.fee) {
            fee = finalTotal * selectedPayment.fee.comision;
            const ivaOnFee = fee * selectedPayment.fee.iva;
            fee += ivaOnFee;

            finalTotal += fee;
        }

        const paymentId = paymentMethods.findIndex(pm => pm.name === payment) + 1;

        const paydata = {
            total: Math.round(finalTotal),
            payment: paymentId
        }
        
        return Response.json(paydata, { status: 200 });
        
    } catch (error) {
        console.error('Error in POST request:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}