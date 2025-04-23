export async function generate(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataToSign = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        dataToSign
    );

    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function generateSignature(params: Record<string, string>, secretKey: string): Promise<string> {
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map(key => `${key}=${params[key]}`).join("&");
    return generate(secretKey, toSign);
}