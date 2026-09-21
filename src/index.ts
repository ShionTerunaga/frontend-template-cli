import { red } from "picocolors";
import { run } from "./main";

run().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unexpected error";

    console.error(red(message));
    process.exitCode = 1;
});
