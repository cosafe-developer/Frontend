import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PNG = path.join(__dirname, "fixtures", "sample.png");

test.describe("UX de upload de imagen", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("el botón X es visible sin hover y el badge 'reemplazar' aparece en hover", async ({ page }) => {
    await page.getByRole("link", { name: /listados/i }).click();
    await page.getByRole("button", { name: /llenar listado/i }).first().click();
    await expect(page.getByText(/Llenar Datos de la Empresa/i)).toBeVisible({ timeout: 10_000 });

    // Subir el logo (primer file input)
    const logoInput = page.locator('input[type="file"]').first();
    await logoInput.setInputFiles(PNG);

    // El botón "Eliminar imagen" debe estar visible inmediatamente (sin hover)
    const removeBtn = page.getByRole("button", { name: /eliminar imagen/i });
    await expect(removeBtn).toBeVisible({ timeout: 5_000 });

    // El badge "Click para reemplazar" debe aparecer en hover sobre la imagen
    const preview = page.locator('img[alt]').first();
    await preview.hover();
    await expect(page.getByText(/click para reemplazar/i)).toBeVisible({ timeout: 2_000 });

    // Click en X elimina la imagen
    await removeBtn.click();
    await expect(removeBtn).not.toBeVisible({ timeout: 5_000 });
  });
});
