export const ABEDOME_PRODUCT_NAME = "ABEDOME";
export const ABEDOME_CORE_TITLE = "ABEDOME Core";
export const ABEDOME_FRONTEND_TITLE = "ABEDOME Frontend";
export const ABEDOME_OS_TITLE = "ABEDOME OS";
export const ABEDOME_SUPERVISOR_TITLE = "ABEDOME Supervisor";

const UPSTREAM_OS_INSTALLATION_METHOD = "Home Assistant OS";
const UPSTREAM_PRODUCT_NAME = "Home Assistant";

const replaceUpstreamProductName = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replaceAll(UPSTREAM_PRODUCT_NAME, ABEDOME_PRODUCT_NAME);
  }

  if (Array.isArray(value)) {
    return value.map(replaceUpstreamProductName);
  }

  return value;
};

export const formatAbedomeInstallationMethod = (
  installationMethod?: string
): string | undefined =>
  installationMethod === UPSTREAM_OS_INSTALLATION_METHOD
    ? ABEDOME_OS_TITLE
    : installationMethod;

export const formatAbedomePageTitle = (title?: string): string =>
  title ? `${title} – ${ABEDOME_PRODUCT_NAME}` : ABEDOME_PRODUCT_NAME;

/**
 * Brand generic, localized product copy while preserving rich placeholders.
 * Do not use this for third-party product names such as Home Assistant Cloud.
 */
export const formatAbedomeProductText = <T>(value: T): T =>
  replaceUpstreamProductName(value) as T;
