import { test, expect } from '@playwright/test'

import { LoginPage, InventoryPage, CartPage, CheckoutPage, CheckoutOverviewPage } from './POMs'

test.describe('Checkout pages', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('SCENARIO: #13 User should see the checkout overview with details such as payment, shipping info, price total.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage
        let checkoutPage
        let checkoutOverviewPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User goes to Cart page, clicks "Checkout" button and is taken to Checkout Your Information page.', async () => {
            cartPage = await inventoryPage.openCart()
            checkoutPage = await cartPage.proceedToCheckout()
        })

        await test.step('AND: User fills all required fields (First Name, Second Name, Zip/Postal code) with personal data on Checkout Your Information page, clicks "Continue" button and is taken to Checkout Overview page.', async () => {
            await checkoutPage.fillUserDetails('Daffy', 'Duck', '85124')
            checkoutOverviewPage = await checkoutPage.continueToOverview()
        })

        await test.step('THEN: User should be able to see checkout overview with displayed correct details such as payment, shipping info, price total.', async () => {
            await checkoutOverviewPage.assertCheckoutItemsRendered()
        })
    })

    test('SCENARIO: #14 User should get notified when they fail to enter any of the checkout information.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage
        let checkoutPage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart.', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User goes to Cart page, clicks "Checkout" button and is taken to Checkout Your Information page.', async () => {
            cartPage = await inventoryPage.openCart()
            checkoutPage = await cartPage.proceedToCheckout()
        })

        await test.step('AND: User leaves First Name field blank on Checkout Your Information page and clicks "Continue" button.', async () => {
            await checkoutPage.fillUserDetails('', 'Duck', '85124')
            await checkoutPage.continueToOverview()
        })

        await test.step('THEN: User should be presented with an error notification ("Error: First Name is required") on Checkout Your Information page.', async () => {
            await checkoutPage.assertErrorButtonVisible()
        })
    })

    test('SCENARIO: #15 User should get notified after placing a successful order.', async ({ page }) => {
        let loginPage
        let inventoryPage
        let cartPage
        let checkoutPage
        let checkoutOverviewPage
        let checkoutCompletePage

        await test.step('GIVEN: User is logged in and on Swag Labs Inventory page with "Sauce Labs Backpack" product added to Cart', async () => {
            loginPage = new LoginPage(page)
            inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
        })

        await test.step('WHEN: User goes to Cart page, clicks "Checkout" button and is taken to Checkout Your Information page.', async () => {
            cartPage = await inventoryPage.openCart()
            checkoutPage = await cartPage.proceedToCheckout()
        })

        await test.step('AND: User fills all required fields (First Name, Second Name, Zip/Postal code) with personal data on Checkout Your Information page and clicks "Continue" button.', async () => {
            await checkoutPage.fillUserDetails('Daffy', 'Duck', '85124')
            checkoutOverviewPage = await checkoutPage.continueToOverview()
        })

        await test.step('AND: User is taken to Checkout Overview page and clicks "Finish" button.', async () => {
            checkoutCompletePage = await checkoutOverviewPage.clickFinishButton()
        })

        await test.step('THEN: User should be presented with a notification text "Thank you for your order!" confirming order has been placed successfully.', async () => {
            await checkoutCompletePage.assertOrderConfirmationRender()
        })
    })
})