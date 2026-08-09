import type { HassEntities } from "home-assistant-js-websocket";
import { describe, expect, it } from "vitest";

import {
  ABEDOME_CORE_TITLE,
  ABEDOME_OS_TITLE,
  ABEDOME_SUPERVISOR_TITLE,
  formatAbedomeInstallationMethod,
} from "../../src/data/abedome";
import {
  filterUpdateEntities,
  isSystemUpdate,
  type UpdateEntity,
} from "../../src/data/update";

const createUpdateEntity = (entityId: string, title: string): UpdateEntity =>
  ({
    entity_id: entityId,
    state: "off",
    attributes: { title },
  }) as UpdateEntity;

describe("ABEDOME product labels", () => {
  it("shows the branded OS installation method", () => {
    expect(formatAbedomeInstallationMethod("Home Assistant OS")).toBe(
      ABEDOME_OS_TITLE
    );
    expect(formatAbedomeInstallationMethod("Home Assistant Container")).toBe(
      "Home Assistant Container"
    );
  });

  it.each([
    ABEDOME_CORE_TITLE,
    ABEDOME_OS_TITLE,
    ABEDOME_SUPERVISOR_TITLE,
    "Home Assistant Core",
    "Home Assistant Operating System",
    "Home Assistant Supervisor",
  ])("recognizes %s as a system update", (title) => {
    expect(isSystemUpdate(createUpdateEntity("update.system", title))).toBe(
      true
    );
  });

  it("sorts branded system updates before other updates", () => {
    const entities = {
      "update.application": createUpdateEntity(
        "update.application",
        "Application"
      ),
      "update.supervisor": createUpdateEntity(
        "update.supervisor",
        ABEDOME_SUPERVISOR_TITLE
      ),
      "update.os": createUpdateEntity("update.os", ABEDOME_OS_TITLE),
      "update.core": createUpdateEntity("update.core", ABEDOME_CORE_TITLE),
    } as unknown as HassEntities;

    expect(
      filterUpdateEntities(entities).map((entity) => entity.attributes.title)
    ).toEqual([
      ABEDOME_CORE_TITLE,
      ABEDOME_OS_TITLE,
      ABEDOME_SUPERVISOR_TITLE,
      "Application",
    ]);
  });
});
