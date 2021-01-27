// https://docs.cypress.io/api/introduction/api.html
const number = Math.floor(Math.random() * 100) + 1

describe('Test the login page', () => {
  it('Visits the login page', () => {
    cy.visit('/login')
    cy.contains('Welcome')
  })

  /**
   * Doesn't work in a headless setting
   */
  // it('Click Google login button', () => {
  //   cy.visit('/login')
  //   cy.contains('Google').click()
  // })
  //
  // it('Click Facebook login', () => {
  //   cy.visit('/login')
  //   cy.contains('Facebook').click()
  // })

  it('Go to the register form', () => {
    cy.visit('/login')
    cy.contains('Sign up').click()
    cy.contains('Back').click()
  })

  it('Fill in email', () => {
    cy.get('.input-email input')
      .type('mail@stevie-ray.nl')
      .should('have.value', 'mail@stevie-ray.nl')
  })

  it('Fill in password', () => {
    cy.get('.input-password input')
      .type('8Ty>g{Q"F!#4')
      .should('have.value', '8Ty>g{Q"F!#4')
  })

  it('Click login button', () => {
    cy.contains('Login').click()
  })

  it('Go to workout tab', () => {
    cy.location('pathname', { timeout: 1000 }).should('be', '/')
    // cy.contains('Start adding exercises')
    cy.get('.tab-workout').click()
    // cy.contains('No personal workouts found')
  })

  it('Add a new workout', () => {
    cy.get('.button-workout-new').click()

    cy.location('pathname', { timeout: 1000 }).should('contain', '/workout/new')
    cy.contains('Start adding exercises')
  })

  it('Click add workout 1 button', () => {
    cy.get('.button-workout-add').click()
  })

  it('Click save exercise 1 button', () => {
    cy.get('.button-exercise-add').click()
    cy.wait(500)
  })

  it('Click add exercise 2 button', () => {
    cy.get('.button-workout-add').click()
  })

  it('Click save exercise 2 button', () => {
    cy.get('.button-exercise-add').click()
  })

  it('Click save workout button', () => {
    cy.get('.button-workout-save').click()
  })

  it('Popup should show up', () => {
    cy.contains("You're almost there!")
  })

  it('Fill in workout name', () => {
    cy.get('.input-workout-name input')
      .type(`Workout ${number}`)
      .should('have.value', `Workout ${number}`)
  })

  it('Fill in workout description', () => {
    cy.get('.input-workout-description textarea')
      .type('Workout Description')
      .should('have.value', 'Workout Description')
  })

  it('Click save workout button', () => {
    cy.get('.button-workout-save').last().click()
  })

  it('Go to workout tab', () => {
    cy.get('.tab-community').click()

    cy.location('pathname', { timeout: 1000 }).should('include', '/community')

    cy.get('.tab-progress').click()

    cy.location('pathname', { timeout: 1000 }).should('include', '/progress')
    cy.contains('No recordings added yet')
  })

  it('Go to Settings', () => {
    cy.get('.menu-hamburger--button').click()
    cy.contains('Settings').click()
  })

  it('Go to Settings: General', () => {
    cy.get('.item-general').click()
    cy.go('back')
  })

  it('Go to Settings: Hangboards', () => {
    cy.get('.item-hangboards').click()
    cy.go('back')
  })

  it('Go to Settings: Notifications', () => {
    cy.get('.item-notifications').click()
    cy.go('back')
  })

  it('Go to Settings: Profile', () => {
    cy.get('.item-profile').click()
  })

  it('Click Logout button', () => {
    cy.get('.button-logout').click()
  })
})
