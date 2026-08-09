export const ABEDOME_PRODUCT_NAME = "ABEDOME";
export const ABEDOME_CORE_TITLE = "ABEDOME Core";
export const ABEDOME_FRONTEND_TITLE = "ABEDOME Frontend";
export const ABEDOME_OS_TITLE = "ABEDOME OS";
export const ABEDOME_SUPERVISOR_TITLE = "ABEDOME Supervisor";

const UPSTREAM_OS_INSTALLATION_METHOD = "Home Assistant OS";

export const formatAbedomeInstallationMethod = (
  installationMethod?: string
): string | undefined =>
  installationMethod === UPSTREAM_OS_INSTALLATION_METHOD
    ? ABEDOME_OS_TITLE
    : installationMethod;

export const formatAbedomePageTitle = (title?: string): string =>
  title ? `${title} – ${ABEDOME_PRODUCT_NAME}` : ABEDOME_PRODUCT_NAME;
