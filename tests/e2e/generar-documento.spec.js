import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth.js";

test.describe("Generación de documento .docx", () => {
  test("genera un .docx para un listado completado", async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByRole("link", { name: /listados/i }).click();

    // Espera la respuesta POST al endpoint de generación
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => /\/document\//i.test(r.url()) && r.request().method() === "POST",
        { timeout: 60_000 }
      ),
      page
        .getByRole("button", { name: /generar documento|descargar pipc|generar pipc/i })
        .first()
        .click(),
    ]);

    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"] || "";
    expect(contentType).toMatch(
      /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/octet-stream/
    );

    const body = await response.body();
    expect(body.length).toBeGreaterThan(10_000);
  });
});
