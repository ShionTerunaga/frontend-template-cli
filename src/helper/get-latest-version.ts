import { isArray, isString } from "../utils/is";
import { resultUtility, type Result } from "ts-shared";

const REPOSITORY_OWNER = "ShionTerunaga";
const REPOSITORY_NAME = "frontend-template-cli";
const GITHUB_API_BASE = "https://api.github.com";

function normalizeVersion(tagName: string): string {
    const version = tagName.trim().replace(/^v/, "");

    if (version === "") {
        throw new Error("Latest tag name is empty");
    }

    return version;
}

async function fetchGitHubJson(path: string): Promise<unknown> {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "create-frontend-template"
        }
    });

    if (!response.ok) {
        throw new Error(
            `GitHub API request failed: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}

async function fetchLatestTagVersion(): Promise<string> {
    const payload = await fetchGitHubJson(
        `/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/tags`
    );

    if (!isArray(payload) || payload.length === 0) {
        throw new Error("GitHub tags response is empty");
    }

    const [latestTag] = payload;

    if (
        typeof latestTag !== "object" ||
        latestTag === null ||
        !("name" in latestTag) ||
        !isString(latestTag.name)
    ) {
        throw new Error(
            "GitHub tags response does not contain a valid tag name"
        );
    }

    return normalizeVersion(latestTag.name);
}

export async function getLatestVersion(): Promise<Result<string, Error>> {
    const { checkPromiseReturn, createNg } = resultUtility;

    return checkPromiseReturn({
        fn: fetchLatestTagVersion,
        err: (error) =>
            error instanceof Error
                ? createNg(
                      new Error(
                          `Failed to resolve the latest repository tag: ${error.message}`
                      )
                  )
                : createNg(
                      new Error("Failed to resolve the latest repository tag")
                  )
    });
}
