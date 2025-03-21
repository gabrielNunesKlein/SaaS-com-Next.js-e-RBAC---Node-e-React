import { cookies } from "next/headers";

export async function isAutenticated() {
    const cookiesStore = await cookies()
    return cookiesStore.get('token')?.value
}