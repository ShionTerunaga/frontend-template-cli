import { appConfig } from "@/shared/config/config";
import { APIScheme } from "../model/model-res";
import { parseApi } from "./parse-api";
import type { APIView } from "../model/model-view";
import { hasParseFetcher } from "@/services/fetcher-get";
import type { Result } from "ts-utility-kit/result";
import type { FetcherError } from "@/shared/error/fetcher";
import type { Option } from "ts-utility-kit/option";

export async function getCharacter(
    cache?: RequestCache
): Promise<Result<Option<Array<APIView>>, FetcherError>> {
    return await hasParseFetcher({
        url: appConfig.apiKey,
        scheme: APIScheme,
        cache,
        parse: parseApi
    });
}
