export const onboardingErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (typeof error === "object" && error !== null && "body" in error) {
    const { body } = error;

    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string" &&
      body.message
    ) {
      return body.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    if ("body" in error && typeof error.body === "string" && error.body) {
      return error.body;
    }

    if ("error" in error && typeof error.error === "string" && error.error) {
      return error.error;
    }
  }

  return fallback;
};
