import { expect } from '@playwright/test'

import { InventoryPage } from './InventoryPage'

export class LoginPage {
    page
    loginField
    passwordField
    submitButton
    error

    constructor(page) {
        this.page = page
        this.loginField = page.getByTestId('username')
        this.passwordField = page.getByTestId('password')
        this.submitButton = page.getByTestId('login-button')
        this.error = page.getByTestId('error')
    }

    /**
     * fills login and password and clicks submit button to login the user
     * @param {string} validUserName - username of a user
     * @param {string} validPassword - password of a user
     * @returns {InventoryPage} - new inventory page
     */
    async login(validUserName, validPassword) {
        await this.loginField.fill(validUserName)
        await this.passwordField.fill(validPassword)
        await this.submitButton.click()

        return new InventoryPage(this.page)
    }

    /** checks if error is visible upon incorrect login */
    async assertErrorVisibility() {
        await expect(this.error).toBeVisible()
    }

    /** checks if login and password fields are visible */
    async loginFieldsVisibility() {
        await expect(this.loginField).toBeVisible()
        await expect(this.passwordField).toBeVisible()
    }

}