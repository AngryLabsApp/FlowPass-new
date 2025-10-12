import type { UserKeys } from "$lib/enums/user_keys";
import { updateSingleField } from "$lib/services/api/users";
import type { User } from "$lib/types/user";


interface UseFormUPdateOptions {
    setLoadingModal: (loading: boolean, title?: string) => void,
    setToast: (title: string, success: boolean) => void,
    onUpdated: () => void,
}


/**
 * ====================================
 * CUSTOM HOOK
 * ====================================
 */
export interface UpdateFormItem {
    key: UserKeys;
    value: string | number;
}
export function useFormUpdateHook(options: UseFormUPdateOptions = {
    setLoadingModal: function (loading: boolean, title?: string): void {
        throw new Error("Function not implemented.");
    },
    setToast: function (title: string, success: boolean): void {
        throw new Error("Function not implemented.");
    },
    onUpdated: function (): void {
        throw new Error("Function not implemented.");
    }
}) {

    const onUpdateSingleForm = async (values: UpdateFormItem[], id: string, e?: any) => {
        e?.preventDefault();
        const fields: any = {
        };
        values.forEach((item) => {

            fields[item.key] = { value: item.value };

        });

        options.setLoadingModal(true, "Actualizando valores");

        try {
            const response = await updateSingleField(id, fields);
            if (response.response == "Success") {
                options.setToast("¡Actualizamos con éxito!", true);
                options.onUpdated();

            }
        } catch (error) {
            options.setToast("Hubo un problema al actualizar. Reintenta en unos segundos.", false);
        } finally {
            options.setLoadingModal(false);
        }
    }

    return {
        onUpdateSingleForm
    };
}
