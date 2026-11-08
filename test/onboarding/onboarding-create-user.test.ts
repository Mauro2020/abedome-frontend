import { describe, expect, it } from "vitest";
import { onboardingErrorMessage } from "../../src/onboarding/onboarding-error-message";

describe("onboarding error messages", () => {
  it.each([
    {
      name: "a JSON response message",
      error: { body: { message: "Username already exists" } },
      expected: "Username already exists",
    },
    {
      name: "a JSON response message attached to an Error",
      error: Object.assign(new Error("Generic error"), {
        body: { message: "Specific server error" },
      }),
      expected: "Specific server error",
    },
    {
      name: "an Error message",
      error: new Error("Connection failed"),
      expected: "Connection failed",
    },
    {
      name: "a non-JSON response body",
      error: { body: "Bad Gateway" },
      expected: "Bad Gateway",
    },
    {
      name: "a request error without a response body",
      error: { body: undefined, error: "Request error" },
      expected: "Request error",
    },
    {
      name: "an error without usable details",
      error: undefined,
      expected: "Unknown error",
    },
  ])("uses $name", ({ error, expected }) => {
    expect(onboardingErrorMessage(error, "Unknown error")).toBe(expected);
  });
});
