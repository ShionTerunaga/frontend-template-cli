import { createHttpError } from "@/shared/error/http/http";
import { describe, expect, it } from "vitest";

describe("http", () => {
    it("createHttpErrorのreturnNotFoundAPIUrlが正常に作られる", () => {
        const { returnNotFoundAPIUrl } = createHttpError;
        const error = returnNotFoundAPIUrl;

        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4041);
        expect(error.message).toBe("APIのURLが見つかりません");
    });

    it("createHttpErrorのreturnNoPermissionが正常に作られる", () => {
        const { returnNoPermission } = createHttpError;
        const error = returnNoPermission;

        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4031);
        expect(error.message).toBe("権限がありません");
    });

    it("createHttpErrorのreturnBadRequestが正常に作られる", () => {
        const { returnBadRequest } = createHttpError;
        const error = returnBadRequest;

        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4001);
        expect(error.message).toBe("不正なリクエストです");
    });
});
