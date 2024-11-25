import { useAuthStore } from "@/stores/authStore";
import { getUSerCookie } from "@/helpers/getCookieUser";

export const useDataAuthUser = async () => {
    const datosUser = await getUSerCookie();
    const datoUserStore = useAuthStore();
    datoUserStore.datos = datosUser;
};
