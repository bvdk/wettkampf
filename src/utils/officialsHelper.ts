import {CollectionKeys} from "../database";
import {CrudAdapter} from "../database/CrudAdapter";
import IdArgs from "../graphql/resolvers/args/IdArgs";


interface ICreateOfficialArgs {

    eventId: string;
    data?: any;
}

interface IFindOfficialArgs {

    eventId?: string;
    importId?: string;

}

export default class OfficialsHelper {


    public createOfficial(
        {data, eventId}: ICreateOfficialArgs,
    ): any {

        const official = CrudAdapter.insertItem(CollectionKeys.officials, {
            ...data,
            eventId,
        });

        return official;
    }

    public findOfficial(
        args: IFindOfficialArgs,
    ): any {
        return CrudAdapter.find(CollectionKeys.officials, args);
    }

    public updateOfficial(

        {id}: IdArgs,
        data: any,
    ): any {

        return CrudAdapter.updateItem(CollectionKeys.officials, id, data);
    }

}
