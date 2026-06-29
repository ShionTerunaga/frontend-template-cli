export interface HttpCustomStatusScheme {
    returnNotFoundAPIUrl: 4041;
    returnNoPermission: 4031;
    returnBadRequest: 4001;
    returnInternalServerError: 5001;
}
export interface HttpErrorStatusResponse {
    notFound: 404;
    internalServerError: 500;
    forbidden: 403;
    badRequest: 400;
}

export interface HttpErrorStatusErrorMessage {
    returnNotFoundAPIUrl: string;
    returnNoPermission: string;
    returnBadRequest: string;
    returnInternalServerError: string;
}

/**
 * 適宜必要なステータスを追加する
 */
export type HttpStatus =
    | HttpErrorStatusResponse["notFound"]
    | HttpErrorStatusResponse["internalServerError"]
    | HttpErrorStatusResponse["forbidden"]
    | HttpErrorStatusResponse["badRequest"];

export type HttpCustomStatus =
    | HttpCustomStatusScheme["returnNotFoundAPIUrl"] //httpからのレスポンスで404が返ってきた
    | HttpCustomStatusScheme["returnNoPermission"] //権限がない
    | HttpCustomStatusScheme["returnBadRequest"] //不正なリクエスト
    | HttpCustomStatusScheme["returnInternalServerError"]; // サーバーエラー

export interface HttpErrorScheme {
    httpErrorStatusResponse: HttpErrorStatusResponse;
    httpCustomStatusScheme: HttpCustomStatusScheme;
    httpErrorMessage: HttpErrorStatusErrorMessage;
}

export const createHttpScheme: HttpErrorScheme = (function () {
    /**API仕様で変更 */
    const httpErrorStatusResponse: HttpErrorStatusResponse = {
        notFound: 404,
        internalServerError: 500,
        forbidden: 403,
        badRequest: 400
    };
    /**API仕様で変更 */
    const httpCustomStatusScheme: HttpCustomStatusScheme = {
        returnNotFoundAPIUrl: 4041,
        returnNoPermission: 4031,
        returnBadRequest: 4001,
        returnInternalServerError: 5001
    };

    /**API仕様や画面仕様で変更 */
    const httpErrorMessage: HttpErrorStatusErrorMessage = {
        returnNotFoundAPIUrl: "APIのURLが見つかりません",
        returnNoPermission: "権限がありません",
        returnBadRequest: "不正なリクエストです",
        returnInternalServerError: "サーバーエラーです"
    };

    return {
        httpErrorStatusResponse: httpErrorStatusResponse,
        httpCustomStatusScheme: httpCustomStatusScheme,
        httpErrorMessage: httpErrorMessage
    };
})();
