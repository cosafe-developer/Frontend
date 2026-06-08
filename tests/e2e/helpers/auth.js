import { expect } from "@playwright/test";

export async function loginAsAdmin(page) {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD deben estar definidos en .env.test");
  }

  await page.goto("/login");
  // El input usa label "Email" / "Password" (en inglés en SignIn.jsx)
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in|iniciar sesi[oó]n/i }).click();

  // Espera redirección post-login
  await expect(page).not.toHaveURL(/\/login/i, { timeout: 15_000 });
}
