import start from "./index";

start().catch((err) => {
    console.error("Error starting server:", err);
});
