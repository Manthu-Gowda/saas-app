// ─── Save auth data after login ───────────────────────────────
export const saveAuthToSession = (data) => {
  if (!data) return;

  const {
    accessToken,
    refreshToken,
    expiresIn,
    user,
    role,
  } = data;

  sessionStorage.setItem("accessToken", accessToken || "");
  sessionStorage.setItem("refreshToken", refreshToken || "");

  const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
  if (expiresAt) sessionStorage.setItem("expiresAt", String(expiresAt));

  const roleValue = user?.role || role || "CUSTOMER";
  sessionStorage.setItem("role", roleValue);

  sessionStorage.setItem(
    "user",
    JSON.stringify({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      avatarUrl: user?.avatarUrl,
      industryId: user?.industryId,
      role: roleValue,
      planTier: user?.subscription?.plan?.tier || "FREE",
    })
  );
};

// ─── Read session helpers ─────────────────────────────────────
export const getSessionUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const getSessionRole = () => sessionStorage.getItem("role") || "CUSTOMER";

export const getAccessToken = () => sessionStorage.getItem("accessToken") || null;

export const isAuthenticated = () => Boolean(getAccessToken());

export const clearSession = () => sessionStorage.clear();
