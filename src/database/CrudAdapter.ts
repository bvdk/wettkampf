import {Event} from "../graphql/models/event";
import db from "./index";

export class CrudAdapter {

    public static getAll(collectionName): any {
        return db
            .get(collectionName)
            .write();
    }

    public static getItem(collectionName, id): any {
        return db
            .get(collectionName)
            .findById(id)
            .write();
    }

    public static insertItem(collectionName, insertData): any {
        return db
            .get(collectionName)
            .insert(insertData)
            .write();
    }

    public static updateItem(collectionName, id, updateData): any {
        return db
            .get(collectionName)
            .updateById(id, updateData)
            .write();
    }

    public static removeItem(collectionName, id): any {
        return db
            .get(Event.collectionKey)
            .removeById(id)
            .write();
    }

}
