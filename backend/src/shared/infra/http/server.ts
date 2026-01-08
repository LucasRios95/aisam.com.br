import { app } from "./app";
import { startJobs } from "../jobs";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server Online on port ${PORT}`);
    startJobs();
});

