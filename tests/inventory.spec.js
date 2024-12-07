import { test, expect } from '@playwright/test'

import { LoginPage, InventoryPage, ProductDetailsPage, CartPage } from './POMs'

test.describe('Inventory page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('SCENARIO: #5.1 User should be able to *SORT* [note: filtering is NOT avaibale on the page] the inventory according to the option chosen.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User selects a sorting option "Name (A to Z)" from the available sorting.', async () => {
            await inventoryPage.sortItems('Name (A to Z)')
        })

        await test.step('THEN: Inventory items should be sorted and dispalyed according to the selected option.', async () => {
            await inventoryPage.assertAlphabeticalSorting(false)
        })
    })

    test('SCENARIO: #5.2 User should be able to *SORT* [note: filtering is NOT avaibale on the page] the inventory according to the option chosen.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User selects a sorting option "Name (Z to A)" from the available sorting.', async () => {
            await inventoryPage.sortItems('Name (Z to A)')
        })

        await test.step('THEN: Inventory items should be sorted and dispalyed according to the selected option.', async () => {
            await inventoryPage.assertAlphabeticalSorting(true)
        })
    })

    test('SCENARIO: #6 User should see the correct product details such as image, product name, description and price.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let productDetailsPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User clicks on a "Sauce Labs Backpack" product to view its details.', async () => {
            productDetailsPage = await inventoryPage.openProductDetailsPage('Sauce Labs Backpack')
        })

        await test.step('THEN: User should be redirected to the "Sauce Labs Backpack" product details page, which will showcase the following product details: an image, product name, description, and price.', async () => {
            await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4')
            await productDetailsPage.assertProductDetailsRendered()
        })
    })

    test('SCENARIO: #7 User should see the added product in their cart.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User adds a "Sauce Labs Backpack" product to their cart', async () => {
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step(`THEN: "Sauce Labs Backpack" product should be visible in user's cart.`, async () => {
            cartPage = await inventoryPage.openCart()
            await cartPage.assertCartItemRendered('Sauce Labs Backpack', '1')
        })
    })

    test('SCENARIO: #8 User should see the cart icon update accordingly when adding a product to the cart.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
        })

        await test.step('WHEN: User clicks "Add to Cart" button on "Sauce Labs Backpack" product.', async () => {
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('THEN: Cart icon should be updated to reflect addition of product.', async () => {
            await inventoryPage.assertShoppingCartCount('1')
        })
    })

    test('SCENARIO: #9 User should be able to remove the added product on the cart page.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User opens Cart page and clicks "Remove" button on "Sauce Labs Backpack" product.', async () => {
            cartPage = await inventoryPage.openCart()
            await cartPage.removeItemFromCart('Sauce Labs Backpack')
        })

        await test.step('THEN: User should be able to see "Sauce Labs Backpack" is removed on Cart page and Cart icon should be updated to reflect removal of product.', async () => {
            await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible()
            await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible()
        })
    })

    test('SCENARIO: #10 User should be able to remove the added product from cart on the inventory page.', async ({ page }) => {
        let loginPage
        let inventoryPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User is still on Inventory page and clicks "Remove" button on "Sauce Labs Backpack" product.', async () => {
            await inventoryPage.removeItemFromCart('Sauce Labs Backpack')
        })

        await test.step('THEN: "Sauce Labs Backpack" product is removed on Inventory page and Cart icon should be updated to reflect removal of product.', async () => {
            await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
            await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible()
        })
    })

    test('SCENARIO: #11 User should be able to remove the added product from cart on the specific product page.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let productDetailsPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User navigates to specific product page for "Sauce Labs Backpack" and clicks "Remove" button.', async () => {
            productDetailsPage = await inventoryPage.openProductDetailsPage('Sauce Labs Backpack')
            await productDetailsPage.removeItemFromCart('Sauce Labs Backpack')
        })

        await test.step('THEN: "Sauce Labs Backpack" product is removed on specific product page and Cart icon should be updated to reflect removal of product.', async () => {
            await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
            await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible()
        })
    })

    test('SCENARIO: #12 User should be able to continue shopping from the cart page.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User navigates to Cart page and clicks "Continue Shopping" button.', async () => {
            cartPage = await inventoryPage.openCart()
            cartPage.returnToShopping()
        })

        await test.step('THEN: User should be redirected back to Inventory page and able to continue shopping.', async () => {
            await inventoryPage.assertPageLoad()
        })
    })
})