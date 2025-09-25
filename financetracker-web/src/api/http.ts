export async function api<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if(!res.ok) {
        throw new Error(await res.text());
    }

    if (res.status === 204 || res.status === 205) {
        return undefined as unknown as T; // allow void for api<void>(...)
    }
    
    return res.json() as Promise<T>;
}