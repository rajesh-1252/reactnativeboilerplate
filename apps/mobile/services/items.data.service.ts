import { itemsRepository } from "@/db/repository";
import { Item, CreateItemInput, UpdateItemInput } from "@/db/schema";
import { DataService } from "./DataService";
import { remoteItemsService } from "./items.service";

/**
 * Items Data Service
 * Combined local and remote data source for items
 */
export const itemsDataService = new DataService<
  Item,
  CreateItemInput,
  UpdateItemInput
>(itemsRepository, remoteItemsService);
