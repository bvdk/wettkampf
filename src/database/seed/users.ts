import {genRandomString, sha512} from "../../passport";


export default [
    {
        id: "ddab8ead-989b-4c33-b473-e2af70e509c3",
        role: "admin",
        username: "admin",
    }, {
        id: "e49ad3e6-4fb7-4762-a854-4d9cf3e9b7ad",
        role: "guest",
        username: "guest",
    },
].map( (user) => {

    const salt = genRandomString(user.username.length);
    const authInfo = sha512(user.username, salt);


    return {
        ...user,
        authInfo,
    };
} );
