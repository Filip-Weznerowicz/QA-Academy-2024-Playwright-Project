import { expect, test } from '@playwright/test'

import { LoginPage } from './POMs'

test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('SCENARIO: #1 User should be able to log in with standard_user login given the correct credentials.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User has opened Swag Labs Login page.', async () => {
            loginPage = new LoginPage(page)
        })

        await test.step('WHEN: Correct credentials for standard_user are entered and login button is pressed.', async () => {
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('THEN: The standard_user should be successfully logged in and is automatically taken to Swag Labs Inventory Page.', async () => {
            await inventoryPage.assertPageLoad()
        })
    })

    test('SCENARIO: #2 User should not be able to access the e-shop inventory without logging in.', async ({ page }) => {
        await test.step('GIVEN: User is not logged in and opened Swag Labs Inventory page', async () => {
            await page.goto('https://www.saucedemo.com/inventory.html')
        })

        await test.step('WHEN: User is redirected to Swag Labs Login page.', async () => {
            await expect(page).toHaveURL('https://www.saucedemo.com/')
        })

        await test.step('THEN: An error message "Epic sadface: (...)" appeared.', async () => {
            await expect(page.getByTestId('error')).toContainText("Epic sadface: You can only access '/inventory.html' when you are logged in.")
        })
    })

    test('SCENARIO: #3 User whose access is denied (locked_out_user) should not be able to log in.', async ({ page }) => {
        let loginPage

        await test.step('GIVEN: User has opened Swag Labs Login page.', async () => {
            loginPage = new LoginPage(page)
        })

        await test.step('WHEN: Correct credentials for locked_out_user are entered and login button is pressed.', async () => {
            await loginPage.login('locked_out_user', 'secret_sauce')
        })

        await test.step('THEN: The locked_out_user should not be able to log in and an error should be displayed.', async () => {
            await loginPage.assertErrorVisibility()
        })
    })

    test('SCENARIO: #4 User should be logged out once Logout button is pressed.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User opens burger menu and clicks "Logout" button.', async () => {
            await inventoryPage.openMenu()
            await inventoryPage.logoutUser()
        })

        await test.step('THEN: User should be logged out and returned to Swag Labs Login page.', async () => {
            await loginPage.loginFieldsVisibility()
        })
    })

    // EXTRA Scenarios: 16 & 17
    test('SCENARIO: #16 User should not be able to log in with invalid username.', async ({ page }) => {
        let loginPage

        await test.step('GIVEN: User has opened Swag Labs Login page.', async () => {
            loginPage = new LoginPage(page)
        })

        await test.step('WHEN: Invalid username ("Yu_Suzuki") and valid password are entered, and login button is pressed.', async () => {
            await loginPage.login('Yu_Suzuki', 'secret_sauce')
        })

        await test.step('THEN: User should not be able to log in and an error should be displayed.', async () => {
            await loginPage.assertErrorVisibility()
        })
    })

    test('SCENARIO: #17 User should not be able to log in with invalid password.', async ({ page }) => {
        let loginPage

        await test.step('GIVEN: User has opened Swag Labs Login page.', async () => {
            loginPage = new LoginPage(page)
        })

        await test.step('WHEN: Valid username ("standard_user") and invalid password are entered, and login button is pressed.', async () => {
            await loginPage.login('standard_user', 'invalid_password')
        })

        await test.step('THEN: User should not be able to log in and an error should be displayed.', async () => {
            await loginPage.assertErrorVisibility()
        })
    })
})