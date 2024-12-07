import { expect } from '@playwright/test'

import { CartPage } from './CartPage'

import { ProductDetailsPage } from './ProductDetailsPage'

export class InventoryPage {
    page
    title
    menuTrigger
    inventoryList
    inventoryItem
    inventoryItemTitle
    shoppingCartCounter
    openShopingCartButton
    shoppingCartCounter
    sortingSelector
    inventoryItemName
    openShopingCartButton

    constructor(page) {
        this.page = page
        this.title = page.getByTestId('title')
        this.menuTrigger = page.getByRole('button', { name: 'Open Menu' })
        this.logoutButton = page.getByTestId('logout-sidebar-link')
        this.inventoryList = page.getByTestId('inventory-list')
        this.inventoryItem = page.getByTestId('inventory-item')
        this.inventoryItemTitle = page.getByTestId('inventory-item-name')
        this.shoppingCartCounter = page.getByTestId('shopping-cart-badge')
        this.sortingSelector = page.getByTestId('product-sort-container')
        this.inventoryItemName = page.getByTestId('inventory_item_name')
        this.openShopingCartButton = page.getByTestId('shopping-cart-badge')
    }

    /**
     * Asserts that the page has successfully loaded by checking the visibility
     * of the title and inventory list elements.
     */
    async assertPageLoad() {
        await expect(this.title).toBeVisible();
        await expect(this.inventoryList).toBeVisible();
    }

    /** opens hamburger menu */
    async openMenu() {
        await this.menuTrigger.click()
    }

    /** clicks Logout button */
    async logoutUser() {
        await this.logoutButton.click()
    }

    /**
     * clicks 'add to cart' for a specific item based on title param
     * @param {string} itemTitle - title of the product
     */
    async addProductToCart(itemTitle) {
        const selectedItemButton = this.inventoryItem.filter({
            hasText: itemTitle
        }).getByRole('button')

        await selectedItemButton.click()
    }

    /**
     * asserts a specific count icon being present on shoping cart
     * @param {string} count - number of items in cart to assert
     */
    async assertShoppingCartCount(count) {
        await expect(this.shoppingCartCounter).toContainText(count)
    }

    /**
     * selects option from the dropdown on Inventory page
     * @param {string} sortingOption - one of the options in filter dropdown
     */
    async sortItems(sortingOption) {
        await this.sortingSelector.selectOption({ label: sortingOption })
    }

    /**
     * asserts alphabetical sorting using native js array functions to sort the array and compare
     * @param {boolean} reverse - false if alphabetical, true if reverse alphabetical order
     */
    async assertAlphabeticalSorting(reverse) {
        const inventoryItemNames = await this.inventoryItemName.allTextContents()

        if (reverse) {
            //reverse alphabetical order using native javascript array function
            const sortedItems = inventoryItemNames.sort().reverse()

            //assert that text contents returned by PW selector are equal to array sorted by js
            expect(sortedItems).toEqual(inventoryItemNames)
        } else {
            //alphabetical order using native javascript array function
            const sortedItems = inventoryItemNames.sort()

            //assert that contents returned by PW selector are equal to array sorted by js
            expect(sortedItems).toEqual(inventoryItemNames)
        }
    }

    /**
     * asserts that an item with specified title has all required elements rendered
     * @param {string} itemTitle - title of the item
     */
    async assertItemRendered(itemTitle) {
        const selectedItem = this.inventoryItem.filter({
            hasText: itemTitle
        })

        const itemName = await selectedItem.getByTestId('inventory_item_name')

        expect(itemName).toHaveText(itemTitle)

        const description = await selectedItem.getByTestId('inventory_item_desc')

        expect(description).toBeVisible()

        const price = await selectedItem.getByTestId('inventory-item-price')

        expect(price).toBeVisible()

        const addToCartButton = await selectedItem.getByRole('button', { name: 'Add to cart' })

        expect(addToCartButton).toBeVisible()

        const itemImage = await selectedItem.getByRole('img')

        expect(itemImage).toBeVisible()
    }

    /**
     * opens the cart page
     * @returns {CartPage} - new cart page
     */
    async openCart() {
        await this.openShopingCartButton.click()

        return new CartPage(this.page)
    }

    /**
     * removes item with a specified title from the cart
     * @param {string} itemTitle - title of the item
     */
    async removeItemFromCart(itemTitle) {
        const selectedItem = this.inventoryItem.filter({
            hasText: itemTitle
        })

        const removeFromCartButton = await selectedItem.getByRole('button', { name: 'Remove' })

        await removeFromCartButton.click()
    }

    async openProductDetailsPage(itemTitle) {
        const selectedItem = this.inventoryItem.filter({
            hasText: itemTitle
        }).getByTestId('inventory-item-name')

        await selectedItem.click()

        return new ProductDetailsPage(this.page)
    }
}