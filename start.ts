import start from "./src";

start().then((server) => {
    console.log("Started server");

}).catch((err) => {
    console.log("Error starting server:", err);
});
