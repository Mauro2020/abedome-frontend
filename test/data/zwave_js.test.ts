import { describe, it, expect, vi } from "vitest";
import {
  fetchZwaveDataCollectionStatus,
  getNodeIdFromDevice,
  setZwaveDataCollectionPreference,
} from "../../src/data/zwave_js";
import type { DeviceRegistryEntry } from "../../src/data/device/device_registry";
import type { HomeAssistant } from "../../src/types";

const mockDevice = (identifiers: [string, string][]) =>
  ({ identifiers }) as DeviceRegistryEntry;

describe("getNodeIdFromDevice", () => {
  it("reads the node ID from the identifier", () => {
    expect(
      getNodeIdFromDevice(mockDevice([["zwave_js", "3245146787-25"]]))
    ).toBe(25);
  });

  it("reads the node ID from the extended identifier", () => {
    expect(
      getNodeIdFromDevice(mockDevice([["zwave_js", "3245146787-25-798:5:20"]]))
    ).toBe(25);
  });

  it("returns multi-digit node IDs in full", () => {
    expect(
      getNodeIdFromDevice(mockDevice([["zwave_js", "3245146787-108"]]))
    ).toBe(108);
  });

  it("ignores provisioning entries, whose DSK blocks parse as numbers", () => {
    expect(
      getNodeIdFromDevice(
        mockDevice([
          [
            "zwave_js",
            "provision_50285-00042-09924-30691-15973-33711-04005-03623",
          ],
        ])
      )
    ).toBeUndefined();
  });

  it("ignores identifiers of other integrations", () => {
    expect(
      getNodeIdFromDevice(mockDevice([["mqtt", "3245146787-25"]]))
    ).toBeUndefined();
  });

  it("picks the Z-Wave identifier when a device has several", () => {
    expect(
      getNodeIdFromDevice(
        mockDevice([
          ["matter", "some-other-id"],
          ["zwave_js", "3245146787-14"],
        ])
      )
    ).toBe(14);
  });

  it("returns undefined when there is no node ID", () => {
    expect(getNodeIdFromDevice(mockDevice([]))).toBeUndefined();
    expect(
      getNodeIdFromDevice(mockDevice([["zwave_js", "3245146787"]]))
    ).toBeUndefined();
  });
});

describe("Z-Wave JS data collection", () => {
  it("requests the preference for the selected config entry", async () => {
    const callWS = vi.fn().mockResolvedValue({ opted_in: false });
    const hass = { callWS } as unknown as HomeAssistant;

    await expect(
      fetchZwaveDataCollectionStatus(hass, "zwave-entry")
    ).resolves.toEqual({ opted_in: false });
    expect(callWS).toHaveBeenCalledWith({
      type: "zwave_js/data_collection_status",
      entry_id: "zwave-entry",
    });
  });

  it("updates only the selected config entry preference", async () => {
    const callWS = vi.fn().mockResolvedValue(undefined);
    const hass = { callWS } as unknown as HomeAssistant;

    await setZwaveDataCollectionPreference(hass, "zwave-entry", true);
    expect(callWS).toHaveBeenCalledWith({
      type: "zwave_js/update_data_collection_preference",
      entry_id: "zwave-entry",
      opted_in: true,
    });
  });
});
