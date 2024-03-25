import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import { CharacterCard } from ".";

describe("CharacterCard", () => {
  const data = {
    id: 1017100,
    name: "A-Bomb (HAS)",
    description:
      "Rick Jones has been Hulk's best bud since day one, but now he's more than a friend...he's a teammate! Transformed by a Gamma energy explosion, A-Bomb's thick, armored skin is just as strong and powerful as it is blue. And when he curls into action, he uses it like a giant bowling ball of destruction! ",
    thumbnail: {
      path: "http://i.annihil.us/u/prod/marvel/i/mg/3/20/5232158de5b16",
      extension: "jpg",
    },
    url: "http://marvel.com/characters/76/a-bomb?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
  };

  it("Should return a CharacterCard", () => {
    const characterCard = renderer
      .create(<CharacterCard character={data} />)
      .toJSON();
    expect(characterCard).toMatchSnapshot();
  });

  it("Should return a CharacterCard with ('No description available')", () => {
    const characterCard = renderer
      .create(<CharacterCard character={{ ...data, description: "" }} />)
      .toJSON();
    expect(characterCard).toMatchSnapshot();
  });

  it("Should render a 'Read more' link with correct URL", () => {
    render(<CharacterCard character={data} />);
    const readMoreButton = screen.getByRole("link", { name: /Read more/i });
    expect(readMoreButton).toBeInTheDocument();
    expect(readMoreButton).toHaveAttribute("href", data.url);
  });

  it("Should not render the 'Read more' link if no URL is provided", () => {
    render(<CharacterCard character={{ ...data, url: undefined }} />);
    const readMoreButton = screen.queryByRole("link", { name: /Read more/i });
    expect(readMoreButton).not.toBeInTheDocument();
  });
});
