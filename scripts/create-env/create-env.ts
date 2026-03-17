import fs from "fs";
import path from "path";
import { Target } from "./create-env.type";
import { mainNextEnv } from "./next-main-env";
import { tanstackRouterEnv } from "./tanstack-main";
import { vueRouterEnv } from "./vue-router-main";
import { nuxtEnv } from "./nuxt-main";

const targets: Array<Target> = [
    ...mainNextEnv,
    ...tanstackRouterEnv,
    ...vueRouterEnv,
    ...nuxtEnv
];

function ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

for (const t of targets) {
    try {
        ensureDirExists(t.dir);
        const filePath = path.join(t.dir, ".env");
        fs.writeFileSync(filePath, t.content, { encoding: "utf8" });
        // Log relative path for user clarity
        console.log(`Wrote ${path.relative(process.cwd(), filePath)}`);
    } catch (err) {
        console.error(`Failed to write .env in ${t.dir}:`, err);
        process.exitCode = 2;
    }
}

// exit normally
process.exitCode = 0;
