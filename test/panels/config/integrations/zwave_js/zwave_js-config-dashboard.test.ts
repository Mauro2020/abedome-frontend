import { render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type * as ZWaveJSData from "../../../../../src/data/zwave_js";
import type * as DialogBox from "../../../../../src/dialogs/generic/show-dialog-box";
import "../../../../../src/panels/config/integrations/integration-panels/zwave_js/zwave_js-config-dashboard";
import type { HomeAssistant } from "../../../../../src/types";

const setZwaveDataCollectionPreference = vi.hoisted(() => vi.fn());
const fetchZwaveDataCollectionStatus = vi.hoisted(() => vi.fn());
const showAlertDialog = vi.hoisted(() => vi.fn());

vi.mock("../../../../../src/data/zwave_js", async (importOriginal) => ({
  ...(await importOriginal<typeof ZWaveJSData>()),
  fetchZwaveDataCollectionStatus,
  setZwaveDataCollectionPreference,
}));

vi.mock(
  "../../../../../src/dialogs/generic/show-dialog-box",
  async (importOriginal) => ({
    ...(await importOriginal<typeof DialogBox>()),
    showAlertDialog,
  })
);

const renderNavigation = (
  optedIn: boolean | undefined,
  statusUnavailable = false
) => {
  const element = document.createElement("zwave_js-config-dashboard");
  element.hass = {
    localize: (key: string, replacements?: Record<string, unknown>) =>
      replacements?.documentation_link ?? key,
  } as HomeAssistant;
  element.configEntryId = "zwave-entry";
  (element as any)._dataCollectionOptIn = optedIn;
  (element as any)._dataCollectionStatusUnavailable = statusUnavailable;

  const container = document.createElement("div");
  render((element as any)._renderNavigationCard(), container, {
    host: element,
  });

  return { container, element };
};

describe("Z-Wave JS data reporting", () => {
  beforeEach(() => {
    setZwaveDataCollectionPreference.mockReset();
    setZwaveDataCollectionPreference.mockResolvedValue(undefined);
    fetchZwaveDataCollectionStatus.mockReset();
    fetchZwaveDataCollectionStatus.mockResolvedValue({ opted_in: false });
    showAlertDialog.mockReset();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps the labeled consent control in the Z-Wave dashboard", async () => {
    const { container } = renderNavigation(false);
    const toggle = container.querySelector("ha-switch")!;
    const documentationLink = container.querySelector<HTMLAnchorElement>(
      'a[href*="zwave-js.github.io/node-zwave-js"]'
    )!;

    expect(container.querySelector('[href*="/config/analytics"]')).toBeNull();
    expect(toggle.checked).toBe(false);
    const internals = (toggle as any).internals;
    Object.assign(internals, {
      setFormValue: vi.fn(),
      setValidity: vi.fn(),
    });
    Object.defineProperties(internals, {
      validity: { configurable: true, value: { valid: true } },
      willValidate: { configurable: true, value: false },
    });
    document.body.append(container);
    await toggle.updateComplete;
    const input = toggle.shadowRoot!.querySelector<HTMLInputElement>(
      'input[role="switch"]'
    )!;
    const labelSlot = input
      .closest("label")!
      .querySelector<HTMLSlotElement>("slot:not([name])")!;
    expect(input.labels?.[0]).toBe(input.closest("label"));
    expect(labelSlot.assignedElements()[0].textContent?.trim()).toBe(
      "ui.panel.config.zwave_js.dashboard.data_collection.toggle_title"
    );
    expect(documentationLink.target).toBe("_blank");
    expect(documentationLink.rel).toContain("noopener");
  });

  it("updates the independent Z-Wave JS preference", async () => {
    const { container, element } = renderNavigation(false);
    const toggle = container.querySelector("ha-switch")!;
    toggle.checked = true;

    toggle.dispatchEvent(new Event("change"));

    await vi.waitFor(() => {
      expect(setZwaveDataCollectionPreference).toHaveBeenCalledWith(
        expect.anything(),
        "zwave-entry",
        true
      );
    });
    expect((element as any)._dataCollectionOptIn).toBe(true);
    expect((element as any)._dataCollectionUpdating).toBe(false);
    expect(showAlertDialog).not.toHaveBeenCalled();
  });

  it("restores the preference and reports a failed update", async () => {
    setZwaveDataCollectionPreference.mockRejectedValueOnce(new Error("boom"));
    const { container, element } = renderNavigation(false);
    const toggle = container.querySelector("ha-switch")!;
    toggle.checked = true;

    toggle.dispatchEvent(new Event("change"));

    await vi.waitFor(() => {
      expect(showAlertDialog).toHaveBeenCalledOnce();
    });
    expect((element as any)._dataCollectionOptIn).toBe(false);
    expect((element as any)._dataCollectionUpdating).toBe(false);
  });

  it("shows a loading indicator until the preference is available", () => {
    const { container } = renderNavigation(undefined);

    expect(container.querySelector("ha-switch")).toBeNull();
    expect(container.querySelector("ha-spinner")).not.toBeNull();
  });

  it("shows an unavailable state on API failure and recovers on retry", async () => {
    fetchZwaveDataCollectionStatus.mockRejectedValueOnce(new Error("boom"));
    const { container, element } = renderNavigation(undefined);

    await (element as any)._loadDataCollectionStatus();
    render((element as any)._renderNavigationCard(), container, {
      host: element,
    });

    expect(container.querySelector("ha-spinner")).toBeNull();
    expect(
      container.querySelector(".data-collection-unavailable")?.textContent
    ).toContain(
      "ui.panel.config.zwave_js.dashboard.data_collection.unavailable"
    );

    fetchZwaveDataCollectionStatus.mockResolvedValueOnce({ opted_in: true });
    await (element as any)._loadDataCollectionStatus();
    render((element as any)._renderNavigationCard(), container, {
      host: element,
    });

    expect(container.querySelector(".data-collection-unavailable")).toBeNull();
    expect(container.querySelector("ha-switch")?.checked).toBe(true);
  });
});
