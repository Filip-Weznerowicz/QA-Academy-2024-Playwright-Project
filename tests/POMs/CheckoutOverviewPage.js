import { expect } from '@playwright/test'

import { CheckoutCompletePage } from './CheckoutCompletePage'

export class CheckoutOverviewPage {
    page
    paymentInformation
    shippingInformation
    priceTotal
    itemTotal
    tax
    grossTotal
    finishButton

    constructor(page) {
        this.page = page
        this.paymentInformation = page.getByTestId('payment-info-label')
        this.shippingInformation = page.getByTestId('shipping-info-label')
        this.priceTotal = page.getByTestId('total-info-label')
        this.itemTotal = page.getByTestId('subtotal-label')
        this.tax = page.getByTestId('tax-label')
        this.grossTotal = page.getByTestId('total-label')
        this.finishButton = page.getByTestId('finish')
    }

    async assertCheckoutItemsRendered() {
        await expect(this.paymentInformation).toBeVisible()
        await expect(this.shippingInformation).toBeVisible()
        await expect(this.priceTotal).toBeVisible()
        await expect(this.itemTotal).toBeVisible()
        await expect(this.tax).toBeVisible()
        await expect(this.grossTotal).toBeVisible()
    }

    async clickFinishButton() {
        await this.finishButton.click()

        return new CheckoutCompletePage(this.page)
    }

}