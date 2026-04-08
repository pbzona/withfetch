import { describe, expect, it } from "vitest";
import * as api from "./index.ts";

describe("index exports", () => {
  it("exports the full runtime API", () => {
    expect(Object.keys(api).sort()).toEqual(
      [
        "accept",
        "basic",
        "basicFromEnv",
        "bearer",
        "bearerFromEnv",
        "contentType",
        "createFetch",
        "header",
        "headerFromEnv",
        "userAgent",
        "vercelOidc",
      ].sort(),
    );
  });
});
