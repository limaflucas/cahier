import { test, expect } from '@playwright/test';

const tag = () => `t${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const menuLinks = (page) => page.getByRole('navigation', { name: 'Menu' }).getByRole('link');
const search = (page) => page.getByRole('combobox', { name: 'Filtrer mes sacs ou chercher un mot' });
const lists = (page) => page.getByRole('list', { name: 'Mes sacs' });
const row = (page, name) => lists(page).getByRole('listitem').filter({ has: page.getByRole('link', { name, exact: true }) });
const title = (page) => page.getByRole('heading', { level: 1 });

async function createList(page, name, { emoji, typedEmoji } = {}) {
  await page.getByRole('button', { name: 'Nouveau sac' }).click();
  await page.getByRole('textbox', { name: 'Nom du sac' }).fill(name);
  if (emoji) {
    await page.getByRole('button', { name: 'Choisir un emoji' }).click();
    await page.getByRole('button', { name: emoji, exact: true }).click();
  }
  if (typedEmoji) {
    await page.getByRole('button', { name: 'Choisir un emoji' }).click();
    await page.getByRole('textbox', { name: 'Autre emoji' }).fill(typedEmoji);
  }
  await page.getByRole('button', { name: 'Créer' }).click();
}

test('the sac-de-mots flag decides whether Sac de mots exists', async ({ page, request }) => {
  for (const [base, on] of [['http://localhost:4173', false], ['http://localhost:4174', true]]) {
    await page.goto(`${base}/mes-mots`);
    await expect(menuLinks(page).first()).toBeVisible();
    await expect(menuLinks(page).filter({ hasText: 'Sac de mots' })).toHaveCount(on ? 1 : 0);
    expect((await request.get(`${base}/api/lists`)).status()).toBe(on ? 200 : 404);
  }
});

test.describe('with sac-de-mots on', () => {
  test.use({ baseURL: 'http://localhost:4174' });

  test('the menu lists Sac de mots right after Mes mots', async ({ page }) => {
    await page.goto('/');
    const labels = await menuLinks(page).allTextContents();
    expect(labels.indexOf('Sac de mots')).toBe(labels.indexOf('Mes mots') + 1);
    await menuLinks(page).filter({ hasText: 'Sac de mots' }).click();
    await expect(page).toHaveURL(/\/sac-de-mots$/);
    await expect(title(page)).toHaveText(/^Sac de mots \(\d+\)$/);
  });

  test('a new list shows its emoji, name and count, and opens empty', async ({ page }) => {
    const name = `Maison ${tag()}`;
    await page.goto('/sac-de-mots');
    const before = Number((await title(page).textContent()).match(/\((\d+)\)/)[1]);
    await createList(page, name, { emoji: '🏠' });
    await expect(row(page, name)).toContainText('🏠');
    await expect(row(page, name)).toContainText('0 mot');
    await expect(title(page)).toHaveText(`Sac de mots (${before + 1})`);

    await row(page, name).getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(/\/sac-de-mots\/\d+$/);
    await expect(title(page)).toContainText(name);
    await expect(title(page)).toContainText('🏠');
    await expect(page.getByText("Ce sac est vide. Tapez un mot dans la recherche en haut pour l'ajouter.")).toBeVisible();
  });

  test('any emoji can be typed instead of picked', async ({ page }) => {
    const name = `Cuisine ${tag()}`;
    await page.goto('/sac-de-mots');
    await createList(page, name, { typedEmoji: '👩‍🍳' });
    await expect(row(page, name)).toContainText('👩‍🍳');
  });

  test('a list needs a name, and names clash regardless of case and accents', async ({ page }) => {
    const id = tag();
    await page.goto('/sac-de-mots');
    await createList(page, '');
    await expect(page.getByRole('alert')).toHaveText('Donnez un nom de 1 à 60 caractères.');
    await page.getByRole('button', { name: 'Annuler' }).click();

    await createList(page, `Été ${id}`);
    await expect(row(page, `Été ${id}`)).toBeVisible();
    await createList(page, `ete ${id}`);
    await expect(page.getByRole('alert')).toHaveText('Un sac porte déjà ce nom.');
  });

  test('a list can be renamed inline from both pages', async ({ page }) => {
    const id = tag();
    await page.goto('/sac-de-mots');
    await createList(page, `Travail ${id}`);
    await row(page, `Travail ${id}`).getByRole('button', { name: `Renommer « Travail ${id} »` }).click();
    await page.getByRole('textbox', { name: 'Nom du sac' }).fill(`Bureau ${id}`);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(row(page, `Bureau ${id}`)).toBeVisible();
    await expect(row(page, `Travail ${id}`)).toHaveCount(0);

    await row(page, `Bureau ${id}`).getByRole('link', { name: `Bureau ${id}`, exact: true }).click();
    await page.getByRole('button', { name: `Renommer « Bureau ${id} »` }).click();
    await page.getByRole('textbox', { name: 'Nom du sac' }).fill(`Atelier ${id}`);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(title(page)).toContainText(`Atelier ${id}`);
  });

  test('deleting asks inline first, and Supprimer sits at the far right', async ({ page }) => {
    const name = `Jardin ${tag()}`;
    await page.goto('/sac-de-mots');
    await createList(page, name);
    const listRow = row(page, name);
    const remove = listRow.getByRole('button', { name: 'Supprimer' });
    const removeBox = await remove.boundingBox();
    for (const other of [listRow.getByRole('link'), listRow.getByText('0 mot'), listRow.getByRole('button', { name: `Renommer « ${name} »` })]) {
      const box = await other.boundingBox();
      expect(removeBox.x).toBeGreaterThanOrEqual(box.x + box.width);
    }

    await remove.click();
    await expect(page.getByText(`Supprimer « ${name} » ?`)).toBeVisible();
    await page.getByRole('button', { name: 'Non' }).click();
    await expect(listRow).toBeVisible();

    await listRow.getByRole('button', { name: 'Supprimer' }).click();
    await page.getByRole('button', { name: 'Oui' }).click();
    await expect(row(page, name)).toHaveCount(0);
  });

  test('a list can be deleted from its own page', async ({ page }) => {
    const name = `Garage ${tag()}`;
    await page.goto('/sac-de-mots');
    await createList(page, name);
    await row(page, name).getByRole('link', { name, exact: true }).click();
    await expect(title(page)).toContainText(name);
    const titleBox = await title(page).boundingBox();
    const removeBox = await page.getByRole('button', { name: 'Supprimer' }).boundingBox();
    expect(removeBox.x).toBeGreaterThanOrEqual(titleBox.x + titleBox.width);
    await page.getByRole('button', { name: 'Supprimer' }).click();
    await page.getByRole('button', { name: 'Oui' }).click();
    await expect(page).toHaveURL(/\/sac-de-mots$/);
    await expect(row(page, name)).toHaveCount(0);
  });

  test('on a phone, the delete question on the lists page fits the screen', async ({ page }) => {
    const name = `Maison et jardin ${tag()}`;
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/sac-de-mots');
    await createList(page, name);
    await row(page, name).getByRole('button', { name: 'Supprimer' }).click();
    for (const answer of ['Oui', 'Non']) await expect(page.getByRole('button', { name: answer })).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test('lists sort by date or A→Z, and the choice is remembered', async ({ page }) => {
    const id = tag();
    await page.goto('/sac-de-mots');
    await createList(page, `avion ${id}`);
    await createList(page, `zèbre ${id}`);
    await search(page).fill(id);
    const sort = page.getByRole('group', { name: 'Trier' });

    await expect(sort.getByRole('button', { name: 'Date' })).toHaveAttribute('aria-pressed', 'true');
    await expect(lists(page).getByRole('link')).toHaveText([`zèbre ${id}`, `avion ${id}`]);
    await sort.getByRole('button', { name: 'A→Z' }).click();
    await expect(lists(page).getByRole('link')).toHaveText([`avion ${id}`, `zèbre ${id}`]);

    await page.reload();
    await search(page).fill(id);
    await expect(sort.getByRole('button', { name: 'A→Z' })).toHaveAttribute('aria-pressed', 'true');
    await expect(lists(page).getByRole('link')).toHaveText([`avion ${id}`, `zèbre ${id}`]);
  });

  test('the header search filters lists by name', async ({ page }) => {
    const id = tag();
    await page.goto('/sac-de-mots');
    await expect(search(page)).toHaveAttribute('placeholder', 'Filtrer mes sacs…');
    await createList(page, `Plage ${id}`);
    await createList(page, `Montagne ${id}`);
    await search(page).fill(`plage ${id}`);
    await expect(row(page, `Plage ${id}`)).toBeVisible();
    await expect(row(page, `Montagne ${id}`)).toHaveCount(0);
  });

  test('a deep link to a missing list says so', async ({ page }) => {
    for (const path of ['/sac-de-mots/999999', '/sac-de-mots/abc']) {
      await page.goto(path);
      await expect(page.getByText("Ce sac n'existe pas.")).toBeVisible();
    }
  });
});
