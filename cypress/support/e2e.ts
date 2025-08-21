// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import axe-core for accessibility testing
import 'cypress-axe';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check accessibility
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<Element>
    }
  }
}
