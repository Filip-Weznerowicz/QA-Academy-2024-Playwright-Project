import { expect } from '@playwright/test'

import { InventoryPage } from './InventoryPage'

import { CheckoutPage } from './CheckoutPage'

export class CartPage {
    page
    cartItem
    continueShoppingButton
    proceedToCheckoutButton

    constructor(page) {
        this.page = page
        this.cartItem = page.getByTestId('inventory-item')
        this.continueShoppingButton = page.getByTestId('continue-shopping')
        this.proceedToCheckoutButton = page.getByTestId('checkout')
    }

    /**
     * asserts that an item with specified title and quantity is rendered in cart
     * @param {string} itemTitle - title of the item
     * @param {number} itemCount - count of the items
     */
    async assertCartItemRendered(itemTitle, itemCount) {
        const selectedItem = this.cartItem.filter({
            hasText: itemTitle
        })

        const cartItemTitle = await selectedItem.getByTestId('inventory-item-name')

        await expect(cartItemTitle).toBeVisible()

        const quantity = await selectedItem.getByTestId('item-quantity')

        await expect(quantity).toHaveText(itemCount)
    }

    /**
     * removes item with a specified title from the cart
     * @param {string} itemTitle - title of the item
     */
    async removeItemFromCart(itemTitle) {
        const selectedItem = this.cartItem.filter({
            hasText: itemTitle
        })

        const removeItemButton = selectedItem.getByRole('button', { name: 'Remove' })

        await removeItemButton.click()
    }

    /**
     * returns to inventory page
     * @returns {InventoryPage} - new Inventory page
     */
    async returnToShopping() {
        await this.continueShoppingButton.click()

        return new InventoryPage(this.page)
    }

    /**
     * proceeds to checkout
     * @returns {CheckoutPage} - new Checkout page
     */
    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click()
        return new CheckoutPage(this.page)
    }
}