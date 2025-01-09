import { test, expect } from '@playwright/test';

test('should display welcome text on the front page', async ({ page }) => {
  // Navigate to the app's front page
  await page.goto('http://localhost:5173'); // Update the URL to your app's development server

  // Check if the page contains the text "Welcome to"
  const welcomeText = await page.locator('text=Welcome to WIS');
  await expect(welcomeText).toBeVisible();
});

// test('should have different text when language is toggled', async ({ page }) => {
//   // Navigate to the app's front page
//   await page.goto('http://localhost:5173'); // Update the URL to your app's development server

//   // Check if the page contains the text "Welcome to"
//   const welcomeText = page.locator('text=Welcome to WIS');
//   await expect(welcomeText).toBeVisible();

//   // Use a more robust selector for the Settings button
//   const settingsButton = page.locator('button:has-text("Settings")');
//   await expect(settingsButton).toBeVisible(); // Ensure it's visible before interacting
//   await settingsButton.click();

//   // Open the language dropdown
//   const languageDropdown = page.locator('button:has-text("EN")'); // Adjust if dropdown uses a different tag
//   await expect(languageDropdown).toBeVisible();
//   await languageDropdown.click();

//   // Select "Español" from the dropdown
//   const languageOption = page.locator('text=Español');
//   await expect(languageOption).toBeVisible();
//   await languageOption.click();

//   // Verify the new welcome text
//   const newWelcomeText = page.locator('text=Bienvenido a WIS');
//   await expect(newWelcomeText).toBeVisible();
// });