describe("Search app tests", () => {
  it("Should be able to search a character which already exists in the data without fetching", () => {
    cy.visit("/");
    cy.findByTestId("search-input").type("3-d man");
    cy.findByLabelText("submit search").click();
    cy.findByTestId("search-loading").should("not.exist")
    cy.url().should("include", "search=3-d+man");
    cy.findByTestId("3-D Man")
  });

  it("Should be able to search a character by fetching and then clear it", () => {
    cy.visit("/");
    cy.findByTestId("search-input").type("abyss");
    cy.findByLabelText("submit search").click();
    cy.findByTestId("search-loading");
    cy.url().should("include", "search=abyss");
    cy.findByTestId("Abyss")
    cy.findByRole("button", { name: "Clear" }).click();
    cy.findByTestId("characters-grid");
  });


  it("Should be able to search two characters and then go back to previous", () => {
    cy.visit("/");
    cy.findByTestId("search-input").type("abyss");
    cy.findByLabelText("submit search").click();
    cy.findByTestId("search-loading");
    cy.url().should("include", "search=abyss");
    cy.findByTestId("Abyss")

    // search the second character
    cy.findByTestId("search-input").clear().type("alain");
    cy.findByLabelText("submit search").click();
    cy.findByTestId("search-loading");
    cy.url().should("include", "search=alain");
    cy.findByTestId("Alain")
    cy.go("back")

    // should show previous character
    cy.url().should("include", "search=abyss");
    cy.findByTestId("Abyss")

    // should show the characters grid
    cy.go("back")
    cy.findAllByTestId("character-card").should('have.length', '6')
  });


  it("Should show no results message when searching a character that doesn't exists", () => {
    cy.visit("/");
    cy.findByTestId("search-input").type("super orne");
    cy.findByLabelText("submit search").click();
    cy.findByTestId("search-loading");
    cy.url().should("include", "search=super+orne");
    cy.findByText("No results");
  });

  it("Should fetch more characters when the user clicks on 'Load more'", () => {
    cy.visit("/");
    cy.findByRole("button", { name: "Load more" }).click();
    cy.findAllByTestId("skeleton-card").should('have.length', '6')
    cy.findAllByTestId("character-card").should('have.length', '12')
  });

  it("Should search a character when have a search query param", () => {
    cy.visit("/?search=abyss");
    cy.wait(200)
    cy.findByTestId("search-input").invoke('val')
    .then(val=>{    
      const myVal = val;      
      expect(myVal).to.equal('abyss');
    })
    cy.findByTestId("search-loading");
    cy.url().should("include", "search=abyss");
    cy.findByTestId("Abyss")
  });

  it("Should focus the search input when clicking the header search icon", ()=>{
    cy.visit("/")
    cy.findByLabelText("go to search").click()
    cy.findByTestId("search-input").should("have.focus")
  })
});
