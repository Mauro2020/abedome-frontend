import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "../../src/common/dom/fire_event";
import type { LocalizeFunc } from "../../src/common/translations/localize";
import type * as OnboardingData from "../../src/data/onboarding";
import "../../src/onboarding/onboarding-create-user";

const onboardUserStep = vi.hoisted(() => vi.fn());

vi.mock("../../src/components/ha-button", () => ({}));

vi.mock("../../src/data/onboarding", async (importOriginal) => ({
  ...(await importOriginal<typeof OnboardingData>()),
  onboardUserStep,
}));

const localize = ((key: string) =>
  key === "ui.common.unknown_error" ? "Unknown error" : key) as LocalizeFunc;

const userData = {
  name: "Test User",
  username: "test-user",
  password: "a-strong-password",
  password_confirm: "a-strong-password",
};

let element: HTMLElementTagNameMap["onboarding-create-user"];

const submitForm = async () => {
  const form = element.shadowRoot!.querySelector("ha-form")!;
  fireEvent(form, "value-changed", { value: userData });
  await element.updateComplete;

  const button = element.shadowRoot!.querySelector("ha-button")!;
  expect(button.disabled).toBe(false);
  button.dispatchEvent(new MouseEvent("click"));

  await vi.waitFor(() => {
    expect(onboardUserStep).toHaveBeenCalledOnce();
  });

  return button;
};

describe("onboarding-create-user", () => {
  beforeEach(async () => {
    onboardUserStep.mockReset();
    element = document.createElement("onboarding-create-user");
    element.localize = localize;
    element.language = "en";
    document.body.append(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

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
  ])("shows $name and re-enables submission", async ({ error, expected }) => {
    onboardUserStep.mockRejectedValueOnce(error);

    const button = await submitForm();

    await vi.waitFor(() => {
      expect(
        element.shadowRoot!.querySelector("ha-alert")?.textContent?.trim()
      ).toBe(expected);
    });
    expect(button.disabled).toBe(false);
  });
});
