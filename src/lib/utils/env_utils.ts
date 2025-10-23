import { PUBLIC_CUSTOM_VARS } from "$env/static/public";
import { PUBLIC_CLIENT} from "$env/static/public";

export function getCustomEnv(field: string){

      const data = JSON.parse(PUBLIC_CUSTOM_VARS  || "{}");
      return data[field] || undefined;
}

export function getClientEnv(field: string){

      const data = JSON.parse(PUBLIC_CLIENT  || "{}");
      return data[field] || "";
}