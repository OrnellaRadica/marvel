import renderer from "react-test-renderer";
import { CharacterCardSkeleton } from ".";

it("Should render the skeleton card", () => {
  const characterCard = renderer.create(<CharacterCardSkeleton />).toJSON();
  expect(characterCard).toMatchSnapshot();
});
