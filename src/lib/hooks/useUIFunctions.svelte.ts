// src/lib/context/useUi.ts
export const LOADING_CTX = Symbol("loading");
export const TOAST_CTX = Symbol("toas");

import { getContext } from "svelte";


export function useUi() {

  const { setLoadingModal } = getContext<{ setLoadingModal: (o:boolean, t?:string)=>void }>(LOADING_CTX);
  const { setToast } = getContext<{ setToast:(title: string, success: boolean) => void }>(TOAST_CTX);



  return { setLoadingModal, setToast };
}
