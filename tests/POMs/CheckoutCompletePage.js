import { expect } from '@playwright/test'

export class CheckoutCompletePage {
    page
    confirmationImage
    confirmationHeader
    confirmationDescription
    backHomeButton

    constructor(page) {
        this.page = page
        this.confirmationImage = page.getByTestId('pony-express')
        this.confirmationHeader = page.getByTestId('complete-header')
        this.confirmationDescription = page.getByTestId('complete-text')
        this.backHomeButton = page.getByTestId('back-to-products')
    }

    // assertOrderConfirmationRender
    async assertOrderConfirmationRender() {
        await expect(this.confirmationImage).toBeVisible()
        await expect(this.confirmationHeader).toBeVisible()
        await expect(this.confirmationDescription).toBeVisible()
        await expect(this.backHomeButton).toBeVisible()
    }
}