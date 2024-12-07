import { expect } from '@playwright/test'

export class ProductDetailsPage {
    page
    removeItemFromCartButton

    constructor(page) {
        this.page = page
        this.removeItemFromCartButton = page.getByTestId('remove')
        this.itemImage = page.locator('.inventory_details_img')
        this.itemPrice = page.getByTestId('inventory-item-price')
        this.itemDescription = page.getByTestId('inventory-item-price')
        this.itemName = page.getByTestId('inventory-item-name')
    }

    async removeItemFromCart() {
        await this.removeItemFromCartButton.click()
    }

    async assertProductDetailsRendered() {
        await expect(this.itemImage).toBeVisible()
        await expect(this.itemPrice).toBeVisible()
        await expect(this.itemDescription).toBeVisible()
        await expect(this.itemName).toBeVisible()
    }
}
