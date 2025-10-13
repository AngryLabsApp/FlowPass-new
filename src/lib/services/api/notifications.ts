


import { fetchWithAuth } from "./base";

import { PUBLIC_SEND_CODE_URL } from '$env/static/public';

export async function send_code(
    id: string
): Promise<any> {
    try {
        const res: any = await fetchWithAuth(PUBLIC_SEND_CODE_URL, {
            method: "POST", body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.reason);
        return data;
    }catch(e){
        throw new Error("Hubo un problema al enviar el codigo. Reintenta en unos segundos.");
    }
}
