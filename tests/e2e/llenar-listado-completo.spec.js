import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PNG_FIXTURE = path.join(__dirname, "fixtures", "sample.png");
const PDF_FIXTURE = path.join(__dirname, "fixtures", "sample.pdf");

test.describe("Llenar Listado completo", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("recorre los 3 EmpresaSteps + los 13 EstudioSteps sin error", async ({ page }) => {
    // Navegar al panel de Listados
    await page.getByRole("link", { name: /listados/i }).click();
    await expect(page).toHaveURL(/listados/i);
    await page.getByRole("button", { name: /llenar listado/i }).first().click();
    await expect(page.getByText(/Llenar Datos de la Empresa/i)).toBeVisible({ timeout: 10_000 });

    // ─── EmpresaStep1: Información de la Empresa ───
    await page.locator('input[type="file"]').first().setInputFiles(PNG_FIXTURE);
    await page.getByLabel(/Nombre Comercial/i).fill("Test Co. SA de CV");
    await page.getByLabel(/^RFC$/i).fill("TST010101AAA");
    await page.getByLabel(/^Email$/i).fill("contacto@testco.mx");
    await page.getByLabel(/Tel[eé]fono/i).fill("8181818181");
    await page.getByLabel(/Domicilio F[ií]sico/i).fill("Av. Test 123");
    await page.getByLabel(/Ciudad/i).fill("Monterrey");
    await page.getByLabel(/^Estado$/i).fill("Nuevo León");
    await page.getByRole("button", { name: /siguiente/i }).click();

    // ─── EmpresaStep2: Información de la Dirección ───
    await page.locator('input[type="file"]').nth(1).setInputFiles(PDF_FIXTURE); // Constancia
    await page.getByLabel(/Actividades de la Empresa/i).fill("Servicios de TI");
    await page.getByLabel(/Giro Empresarial/i).fill("Software");
    await page.getByLabel(/Nombre del Responsable del Inmueble/i).fill("Juan Pérez");
    await page.getByLabel(/Cargo del Responsable del Inmueble/i).fill("Gerente");
    await page.getByLabel(/Nombre del Representante Legal/i).fill("María López");
    await page.getByLabel(/Cargo del Representante Legal/i).fill("Directora");
    await page.locator('input[type="file"]').last().setInputFiles(PDF_FIXTURE); // INE
    await page.getByLabel(/Superficie del Terreno/i).fill("500");
    await page.getByLabel(/Superficie Construida/i).fill("300");
    await page.getByLabel(/Poblaci[oó]n Fija/i).fill("20");
    await page.getByLabel(/Poblaci[oó]n Flotante/i).fill("5");
    await page.getByLabel(/Niveles del Inmueble/i).fill("3 niveles");
    await page.getByLabel(/Antig[uü]edad del Inmueble/i).fill("10 años");
    await page.getByLabel(/^Norte$/i).fill("Calle del Comercio");
    await page.getByLabel(/^Sur$/i).fill("Calle del Río");
    await page.getByLabel(/^Este$/i).fill("Av. Principal");
    await page.getByLabel(/^Oeste$/i).fill("Av. Secundaria");

    // Subir 4 imágenes de colindancias (los 4 últimos file inputs)
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();
    for (let i = count - 4; i < count; i++) {
      await fileInputs.nth(i).setInputFiles(PNG_FIXTURE);
    }

    await page.getByPlaceholder(/área interna/i).fill("Oficinas");
    await page.getByRole("button", { name: /^agregar$/i }).click();
    await page.getByRole("button", { name: /siguiente/i }).click();

    // ─── EmpresaStep3: Información de Riesgo ───
    await page.getByLabel(/Descripci[oó]n de la Empresa/i).fill("Empresa pequeña dedicada a TI");

    // 2 selects de riesgo (internalRiskType + surroundingRiskType)
    const interno = page.getByText("Tipo de Riesgo Interno", { exact: false }).first();
    await interno.click();
    await page.getByRole("option", { name: /ordinario/i }).click();

    const entorno = page.getByText("Tipo de Riesgo por Entorno", { exact: false }).first();
    await entorno.click();
    await page.getByRole("option", { name: /ordinario/i }).click();

    // Textarea de antecedentes
    await page.getByLabel(/Antecedentes/i).fill(
      "Sin incidentes mayores.\n\nÚltima inspección hace 2 años.\n\nNo se han detectado fugas."
    );

    // Calendario (cerrar sin elegir, opcional)
    await page.getByPlaceholder(/Seleccionar fechas/i).click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: /guardar/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click({ timeout: 30_000 });

    // ─── EstudioStep 1..13: avanzar respondiendo "Sí aplica" cuando aparezca el modal ───
    for (let i = 0; i < 13; i++) {
      const aplicaBtn = page.getByRole("button", { name: /s[ií] aplica/i });
      if (await aplicaBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await aplicaBtn.click();
      }
      const finalizar = page.getByRole("button", { name: /finalizar/i });
      const siguiente = page.getByRole("button", { name: /siguiente/i });
      if (await finalizar.isVisible({ timeout: 500 }).catch(() => false)) {
        await finalizar.click();
        break;
      }
      await siguiente.click();
    }

    // Verificación final
    await expect(
      page.getByText(/listado enviado a revisi[oó]n|listo|completado|under review/i)
    ).toBeVisible({ timeout: 20_000 });
  });
});
