import db from "./index";

export class CrudAdapter {

    public static getDb(): any {
        return db;
    }

    public static getAll(collectionName): any {
        return db
            .get(collectionName)
            .value();
    }

    public static filter(collectionName, filter): any {
        return db
            .get(collectionName)
            .filter(filter)
            .value();
    }

    public static find(collectionName, filter): any {
        return db
            .get(collectionName)
            .find(filter)
            .value();
    }

    public static getItem(collectionName, id): any {
        return db
            .get(collectionName)
            .getById(id)
            .value();
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
            .get(collectionName)
            .removeById(id)
            .write();
    }

}
