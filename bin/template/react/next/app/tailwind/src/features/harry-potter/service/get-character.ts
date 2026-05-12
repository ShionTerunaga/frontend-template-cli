import { appConfig } from "@/shared/config/config";
import { APIScheme } from "../model/model-res";
import { parseApi } from "./parse-api";
import { Result } from "ts-shared";
import { APIView } from "../model/model-view";
import { hasParseFetcher } from "@/services/fetcher-get";
import { Option } from "ts-shared";
import { FetcherError } from "@/shared/error/fetcher";

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
