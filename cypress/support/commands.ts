// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for voice recognition to be ready
Cypress.Commands.add('waitForVoiceRecognition', () => {
  cy.window().then((win) => {
    // Wait for Web Speech API to be available
    cy.wrap(win).should('have.property', 'SpeechRecognition');
  });
});

// Custom command to simulate voice command
Cypress.Commands.add('simulateVoiceCommand', (command: string) => {
  cy.window().then((win) => {
    // Simulate voice recognition result
    const event = new CustomEvent('voiceCommand', { detail: command });
    win.dispatchEvent(event);
  });
});

// Custom command to simulate gesture
Cypress.Commands.add('simulateGesture', (gestureType: string) => {
  cy.window().then((win) => {
    // Simulate gesture detection
    const event = new CustomEvent('gestureDetected', { 
      detail: { type: gestureType, confidence: 0.8 } 
    });
    win.dispatchEvent(event);
  });
});

// Custom command to check focus management
Cypress.Commands.add('checkFocusManagement', () => {
  cy.get('body').tab();
  cy.focused().should('exist');
  cy.focused().should('be.visible');
});

// Custom command to test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', () => {
  const focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  
  cy.get(focusableElements).first().focus();
  
  cy.get(focusableElements).each(($element) => {
    cy.wrap($element).focus();
    cy.focused().should('exist');
    cy.focused().should('be.visible');
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      waitForVoiceRecognition(): Chainable<Element>
      simulateVoiceCommand(command: string): Chainable<Element>
      simulateGesture(gestureType: string): Chainable<Element>
      checkFocusManagement(): Chainable<Element>
      testKeyboardNavigation(): Chainable<Element>
    }
  }
}
