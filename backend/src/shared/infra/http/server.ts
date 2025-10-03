import { app } from "./app";
import { startJobs } from "../jobs";

app.listen(3333, () => {
    console.log("Server Online");
    startJobs();
});

