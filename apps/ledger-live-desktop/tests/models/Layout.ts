import { Page, Locator } from "@playwright/test";

export class Layout {
  readonly page: Page;
  readonly renderError: Locator;
  readonly totalBalance: Locator;
  readonly pageScroller: Locator;
  readonly loadingLogo: Locator;
  readonly logo: Locator;
  readonly loadingSpinner: Locator;
  readonly inputError: Locator;
  readonly inputWarning: Locator;
  readonly drawerCollapseButton: Locator;
  readonly drawerPortfolioButton: Locator;
  readonly drawerMarketButton: Locator;
  readonly drawerAccountsButton: Locator;
  readonly drawerDiscoverButton: Locator;
  readonly drawerSendButton: Locator;
  readonly drawerReceiveButton: Locator;
  readonly drawerManagerButton: Locator;
  readonly drawerBuycryptoButton: Locator;
  readonly drawerExperimentalButton: Locator;
  readonly topbarDiscreetButton: Locator;
  readonly topbarSynchronizeButton: Locator;
  readonly topbarSettingsButton: Locator;
  readonly topbarLockButton: Locator;
  readonly topbarHelpButton: Locator;
  readonly bookmarkedAccountsList: Locator;
  readonly bookmarkedAccounts: Locator;
  readonly drawerSwapButton: Locator;
  readonly drawerEarnButton: Locator;
  readonly appUpdateBanner: Locator;
  readonly discreetTooltip: Locator;

  constructor(page: Page) {
    this.page = page;

    this.renderError = page.locator("data-test-id=render-error");

    // portfolio && accounts
    this.totalBalance = page.locator("data-test-id=total-balance");

    // drawer
    this.drawerCollapseButton = page.locator("data-test-id=drawer-collapse-button");
    this.drawerPortfolioButton = page.locator("data-test-id=drawer-dashboard-button");
    this.drawerMarketButton = page.locator("data-test-id=drawer-market-button");
    this.drawerAccountsButton = page.locator("data-test-id=drawer-accounts-button");
    this.drawerDiscoverButton = page.locator("data-test-id=drawer-catalog-button");
    this.drawerSendButton = page.locator("data-test-id=drawer-send-button");
    this.drawerReceiveButton = page.locator("data-test-id=drawer-receive-button");
    this.drawerManagerButton = page.locator("data-test-id=drawer-manager-button");
    this.drawerBuycryptoButton = page.locator("data-test-id=drawer-exchange-button");
    this.drawerSwapButton = page.locator("data-test-id=drawer-swap-button");
    this.drawerEarnButton = page.locator("data-test-id=drawer-earn-button");
    this.drawerExperimentalButton = page.locator("data-test-id=drawer-experimental-button");
    this.bookmarkedAccountsList = page.locator("data-test-id=drawer-bookmarked-accounts");
    this.bookmarkedAccounts = this.bookmarkedAccountsList.locator(".bookmarked-account-item");

    // topbar
    this.topbarDiscreetButton = page.locator("data-test-id=topbar-discreet-button");
    this.topbarSynchronizeButton = page.locator("data-test-id=topbar-synchronize-button");
    this.topbarSettingsButton = page.locator("data-test-id=topbar-settings-button");
    this.topbarLockButton = page.locator("data-test-id=topbar-password-lock-button");
    this.topbarHelpButton = page.locator("data-test-id=topbar-help-button");
    this.discreetTooltip = page.locator("#tippy-12"); // automatically generated tippy id but it's consistent

    // general
    this.pageScroller = page.locator("id=page-scroller");
    this.loadingLogo = page.locator("id=loading-logo");
    this.logo = page.locator("data-test-id=logo");
    this.inputError = page.locator("id=input-error"); // no data-test-id because css style is applied
    this.inputWarning = page.locator("id=input-warning"); // no data-test-id because css style is applied
    this.loadingSpinner = page.locator("data-test-id=loading-spinner");

    // updater
    this.appUpdateBanner = page.locator("data-test-id=layout-app-update-banner");
  }

  async goToPortfolio() {
    await this.drawerPortfolioButton.click();
  }

  async goToMarket() {
    await this.drawerMarketButton.click();
  }

  async goToAccounts() {
    await this.drawerAccountsButton.click();
  }

  async goToDiscover() {
    await this.drawerDiscoverButton.click();
  }

  async goToManager() {
    await this.drawerManagerButton.click();
  }

  async goToBuyCrypto() {
    await this.drawerBuycryptoButton.click();
  }

  async goToSwap() {
    await this.drawerSwapButton.click();
  }

  async goToEarn() {
    await this.drawerEarnButton.click();
  }

  async toggleDiscreetMode() {
    await this.topbarDiscreetButton.click();
    await this.discreetTooltip.waitFor({ state: "hidden" }); // makes sure the tooltip has disappeared to prevent flakiness
  }

  async goToSettings() {
    await this.topbarSettingsButton.click();
  }

  async lockApp() {
    await this.topbarLockButton.click();
  }

  async openSendModal() {
    await this.drawerSendButton.click();
  }

  async openReceiveModal() {
    await this.drawerReceiveButton.click();
  }

  async waitForLoadingSpinner() {
    await this.loadingSpinner.waitFor({ state: "visible" });
    await this.loadingSpinner.waitFor({ state: "detached" });
  }

  async waitForLoadingSpinnerToHaveDisappeared() {
    await this.loadingSpinner.waitFor({ state: "detached" });
  }
}
