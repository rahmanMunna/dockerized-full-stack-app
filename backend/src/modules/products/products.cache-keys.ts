export const PRODUCT_CACHE_KEYS = {
    list: 'products:list',
    one: (id: string) => `products:${id}`,
} as const;