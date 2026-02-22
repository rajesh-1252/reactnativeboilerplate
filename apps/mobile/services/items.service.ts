import { Item } from "@/db/schema";

// This would eventually call apps/api or Supabase
export const remoteItemsService = {
  findAll: async (): Promise<Item[]> => {
    console.log("[RemoteService] Fetching all items");
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return []; // Return empty for now or mock data
  },

  findById: async (id: string): Promise<Item | null> => {
    console.log("[RemoteService] Fetching item:", id);
    return null;
  },

  create: async (data: any): Promise<Item> => {
    console.log("[RemoteService] Creating item:", data);
    return {
      id: Math.random().toString(), // Should be UUID
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      syncStatus: "synced",
    } as Item;
  },

  update: async (id: string, data: any): Promise<Item | null> => {
    console.log("[RemoteService] Updating item:", id, data);
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    console.log("[RemoteService] Deleting item:", id);
    return true;
  },
};
