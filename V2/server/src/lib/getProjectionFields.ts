import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
} from "graphql-parse-resolve-info";

export default function getProjectionFields(resolverInfo, modelSchema) {
  const parsedInfo = parseResolveInfo(resolverInfo) as
    | ResolveTree
    | FieldsByTypeName;
  const returnType = Object.keys(parsedInfo.fieldsByTypeName).filter(
    (field) => field !== "_Entity"
  )[0];
  const baseType = returnType.replace("Connection", "");
  const modelSchemaFields = Object.keys(modelSchema.obj);
  const linkedFields = ["account", "author", "post", "postAuthor"];
  let queryFields;

  const fields = parsedInfo.fieldsByTypeName[returnType];
  if (fields.hasOwnProperty("edges")) {
    const nodeFields =
      // @ts-ignore
      fields.edges.fieldsByTypeName[`${baseType}Edge`].node.fieldsByTypeName[
        baseType
      ];
    queryFields = Object.keys(nodeFields);
  } else {
    queryFields = Object.keys(parsedInfo.fieldsByTypeName[returnType]);
  }

  linkedFields.forEach((field) => {
    const fieldIndex = queryFields.indexOf(field);

    if (fieldIndex === -1) {
      return;
    } else if (field === "author" || field === "postAuthor") {
      queryFields[fieldIndex] = `${field}ProfileId`;
    } else {
      queryFields[fieldIndex] = `${field}Id`;
    }
  });

  const trimmedQueryFields = queryFields.filter((field) =>
    modelSchemaFields.includes(field)
  );
  trimmedQueryFields.push("_id");

  return trimmedQueryFields.join(" ");
}
