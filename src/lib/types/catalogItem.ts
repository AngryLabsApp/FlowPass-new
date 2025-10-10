import type { UserKeys } from "$lib/enums/user_keys";

export interface CatalogItem {
  label: string;
  key: UserKeys;
  icon: any; 
  editable: boolean; 
  edit_only_with_plan?: boolean;
}
