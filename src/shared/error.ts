import { red } from "picocolors";

export function cliErrorLog(err: Error) {
    console.error(red(err.message));
    console.error(red(err.stack ?? ""));
}
