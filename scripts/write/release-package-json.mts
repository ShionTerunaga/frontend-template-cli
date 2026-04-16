import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type RootPackageJson = {
    name: string;
    version: string;
    description?: string;
    type?: string;
    license?: string;
    engines?: Record<string, string>;
    bin?: Record<string, string>;
    files?: string[];
    preferGlobal?: boolean;
    packageManager?: string;
    dependencies?: Record<string, string>;
};

function resolveOutputPath() {
    const cliOutputPath = process.argv[2];

    if (cliOutputPath) {
        return path.resolve(process.cwd(), cliOutputPath);
    }

    return path.resolve(__dirname, "..", "..", ".release-dist", "package.json");
}

async function main(): Promise<void> {
    const sourcePackageJsonPath = path.resolve(
        __dirname,
        "..",
        "..",
        "package.json"
    );
    const outputPath = resolveOutputPath();
    const outputDir = path.dirname(outputPath);
    const sourcePackageJsonText = await fs.promises.readFile(
        sourcePackageJsonPath,
        "utf8"
    );
    const sourcePackage = JSON.parse(sourcePackageJsonText) as RootPackageJson;
    const releaseVersion = process.env.RELEASE_VERSION ?? sourcePackage.version;

    const releasePackageJson = {
        name: sourcePackage.name,
        version: releaseVersion,
        description: sourcePackage.description,
        type: sourcePackage.type,
        license: sourcePackage.license,
        engines: sourcePackage.engines,
        bin: sourcePackage.bin,
        files: sourcePackage.files,
        preferGlobal: sourcePackage.preferGlobal,
        packageManager: sourcePackage.packageManager,
        dependencies: sourcePackage.dependencies
    };

    await fs.promises.mkdir(outputDir, { recursive: true });
    await fs.promises.writeFile(
        outputPath,
        `${JSON.stringify(releasePackageJson, null, 2)}\n`,
        "utf8"
    );
}

main();
