import path from "path";
import core from "./core";

async function binWrite() {
    const target = path.resolve(__dirname, "..", "..", "bin", "index.js");

    await core(target);
}

binWrite();
