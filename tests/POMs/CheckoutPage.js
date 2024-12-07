import { expect } from '@playwright/test'

import { CheckoutOverviewPage } from './CheckoutOverviewPage'

export class CheckoutPage {
    page
    firstNameField
    lastNameField
    postalCodeField
    continueButton
    errorButton

    constructor(page) {
        this.page = page
        this.firstNameField = page.getByTestId('firstName')
        this.lastNameField = page.getByTestId('lastName')
        this.postalCodeField = page.getByTestId('postalCode')
        this.continueButton = page.getByTestId('continue')
        this.errorButton = page.getByTestId('error-button')
    }

    async fillUserDetails(firstName, lastName, postalCode) {
        await this.firstNameField.fill(firstName)
        await this.lastNameField.fill(lastName)
        await this.postalCodeField.fill(postalCode)
    }

    async continueToOverview() {
        await this.continueButton.click()

        return new CheckoutOverviewPage(this.page)
    }

    async assertErrorButtonVisible() {
        await expect(this.errorButton).toBeVisible()
    }
}

