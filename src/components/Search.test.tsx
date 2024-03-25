import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Search } from "./Search";
import { NextRouter } from "next/router";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("Search, user actions.", () => {
  const routerPush = jest.fn();
  const mockRouter: Partial<NextRouter> = {
    push: routerPush,
    query: {},
    isReady: true,
  };

  const mockedCharacters = [
    {
      id: 1011334,
      name: "3-D Man",
      description: "",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784",
        extension: "jpg",
      },
      url: "http://marvel.com/characters/74/3-d_man?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
    },
    {
      id: 1017100,
      name: "A-Bomb (HAS)",
      description:
        "Rick Jones has been Hulk's best bud since day one, but now he's more than a friend...he's a teammate! Transformed by a Gamma energy explosion, A-Bomb's thick, armored skin is just as strong and powerful as it is blue. And when he curls into action, he uses it like a giant bowling ball of destruction! ",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/3/20/5232158de5b16",
        extension: "jpg",
      },
      url: "http://marvel.com/characters/76/a-bomb?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
    },
  ];

  beforeEach(() => {
    useRouter.mockImplementation(() => mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should allow to user to input a character name and search it, this character is in the data, it shouldn't trigger a fetch", async () => {
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    const mockedFetch = jest.fn();
    global.fetch = mockedFetch;

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="idle"
        setSearchStatus={setSearchStatusMock}
        characters={mockedCharacters}
      />
    );

    const searchedCharacter = mockedCharacters[0];
    const characterName = searchedCharacter.name; // 3-D man

    // Simulate typing in the input field
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: characterName } });
    expect(input).toHaveValue(characterName);

    const submitButton = screen.getByLabelText("submit search");
    fireEvent.click(submitButton);

    // The router push has been called, saving the input value as query parameter.
    expect(routerPush).toHaveBeenCalledWith(
      { query: { search: characterName } },
      undefined,
      { shallow: true }
    );
    expect(mockedFetch).not.toHaveBeenCalled();
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(searchedCharacter);
    expect(setSearchStatusMock).toHaveBeenCalledWith("success");
  });

  it("Should allow the user to input a character name and search it, this character is not in the data, it should trigger a fetch, with a succesfull response", async () => {
    const mockedCharacter = {
      id: 1009149,
      name: "Abyss",
      description: "",
      thumbnail: {
          path: "http://i.annihil.us/u/prod/marvel/i/mg/9/30/535feab462a64",
          extension: "jpg"
      },
      url: "http://marvel.com/characters/85/abyss?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde"
    };

    const mockedFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockedCharacter),
    });
    global.fetch = mockedFetch;
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="idle"
        setSearchStatus={setSearchStatusMock}
        characters={mockedCharacters}
      />
    );

    const characterName = "Abyss";
    // Simulate typing in the input field
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: characterName } });
    expect(input).toHaveValue(characterName);

    const submitButton = screen.getByLabelText("submit search");
    fireEvent.click(submitButton);

    // The router push has been called, saving the input value as query parameter.
    expect(routerPush).toHaveBeenCalledWith(
      { query: { search: characterName } },
      undefined,
      { shallow: true }
    );

    // Resets the character to null
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(null);

    // Change the state to loading.
    expect(setSearchStatusMock).toHaveBeenCalledWith("loading");

    // The search api has been called with the expected name.
    expect(mockedFetch).toHaveBeenCalledWith(`api/characters/${characterName}`);

    await waitFor(() => {
      expect(setSearchedCharacterMock).toHaveBeenCalledWith(mockedCharacter);
      expect(setSearchStatusMock).toHaveBeenCalledWith("success");
    });
  });

  it("Should allow to user to input a character name and search it, this character is not in the data, it should trigger a fetch, no character found", async () => {
    const notFoundCharacter = null;
    const mockedFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(notFoundCharacter),
    });
    global.fetch = mockedFetch;
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="idle"
        setSearchStatus={setSearchStatusMock}
        characters={mockedCharacters}
      />
    );

    const characterName = "super orne";
    // Simulate typing in the input field
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: characterName } });
    expect(input).toHaveValue(characterName);

    const submitButton = screen.getByLabelText("submit search");
    fireEvent.click(submitButton);

    // The router push has been called, saving the input value as query parameter.
    expect(routerPush).toHaveBeenCalledWith(
      { query: { search: characterName } },
      undefined,
      { shallow: true }
    );

    // Resets the character to null
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(null);

    // Change the state to loading.
    expect(setSearchStatusMock).toHaveBeenCalledWith("loading");

    // The search api has been called with the expected name.
    expect(mockedFetch).toHaveBeenCalledWith(`api/characters/${characterName}`);

    await waitFor(() => {
      expect(setSearchedCharacterMock).toHaveBeenCalledWith(
        notFoundCharacter
      );
      expect(setSearchStatusMock).toHaveBeenCalledWith("no-results");
    });
  });

  it("Should clear input and search status when clear button is clicked", async () => {
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="no-results"
        setSearchStatus={setSearchStatusMock}
        characters={[]}
      />
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "super orne" } });
    expect(input).toHaveValue("super orne");

    const clearButton = screen.getByRole("button", { name: "Clear" });
    expect(clearButton).toBeInTheDocument(); // Ensure Clear button is rendered

    fireEvent.click(clearButton);

    // The status changes to idle to render the grid.
    expect(setSearchStatusMock).toHaveBeenCalledWith("idle");

    // Removes the searched character.
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(null);

    // The input value has been removed.
    expect(input).toHaveValue("");

    // The router push has been called, saving the input value as query parameter.
    expect(routerPush).toHaveBeenCalledWith({ query: {} }, undefined, {
      shallow: true,
    });
    expect(input).toHaveFocus();
  });

  it("Should trigger the handleClear function when submitting the form with empty value", async () => {
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="success"
        setSearchStatus={setSearchStatusMock}
        characters={[]}
      />
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");

    const form = screen.getByTestId("search-form");
    fireEvent.submit(form);

    // The status changes to idle to render the grid.
    expect(setSearchStatusMock).toHaveBeenCalledWith("idle");

    // Removes the searched character.
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(null);

    // The input value has been removed.
    expect(input).toHaveValue("");

    // The router push has been called, saving the input value as query parameter.
    expect(routerPush).toHaveBeenCalledWith({ query: {} }, undefined, {
      shallow: true,
    });
    expect(input).toHaveFocus();
  });

  it("Should disable submit button in loading state", () => {
    render(
      <Search
        setSearchedCharacter={() => {}}
        searchStatus="loading"
        setSearchStatus={() => {}}
        characters={mockedCharacters}
      />
    );

    const submitButton = screen.getByLabelText("submit search");
    expect(submitButton).toBeDisabled();

    const clearButton = screen.queryByRole("button", { name: "Clear" });
    expect(clearButton).not.toBeInTheDocument(); // Ensure Clear button is not rendered
  });
});

describe("Search, useEffect", () => {
  const routerPush = jest.fn();
  const mockRouter: Partial<NextRouter> = {
    push: routerPush,
    query: { search: "abyss" },
    isReady: true,
  };

  beforeEach(() => {
    jest.resetModules();
    useRouter.mockImplementation(() => mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should trigger character search when a 'search' query param exists", async () => {
    const mockedCharacter = {
      id: 1009149,
      name: "Abyss",
      description: "",
      thumbnail: {
          path: "http://i.annihil.us/u/prod/marvel/i/mg/9/30/535feab462a64",
          extension: "jpg"
      },
      url: "http://marvel.com/characters/85/abyss?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde"
    };

    const mockedFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockedCharacter),
    });
    global.fetch = mockedFetch;
    const setSearchedCharacterMock = jest.fn();
    const setSearchStatusMock = jest.fn();

    render(
      <Search
        setSearchedCharacter={setSearchedCharacterMock}
        searchStatus="idle"
        setSearchStatus={setSearchStatusMock}
        characters={[]}
      />
    );

    const characterName = "abyss";
    // The router push should not be called.
    expect(routerPush).not.toHaveBeenCalled();

    // Resets the character to null
    expect(setSearchedCharacterMock).toHaveBeenCalledWith(null);

    // Change the state to loading.
    expect(setSearchStatusMock).toHaveBeenCalledWith("loading");

    // The search api has been called with the expected name.
    expect(mockedFetch).toHaveBeenCalledWith(`api/characters/${characterName}`);

    await waitFor(() => {
      expect(setSearchedCharacterMock).toHaveBeenCalledWith(mockedCharacter);
      expect(setSearchStatusMock).toHaveBeenCalledWith("success");
    });
  });
});
