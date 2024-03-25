import renderer from "react-test-renderer";
import { Button } from "./Button";

describe("Button", () => {
  it("Should return a button", () => {
    const button = renderer.create(<Button>Example button</Button>).toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Should return a button with secondary prop", () => {
    const button = renderer
      .create(<Button variant="secondary">Example button</Button>)
      .toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Should return a button with type 'submit'", () => {
    const button = renderer
      .create(<Button type="submit">Example button</Button>)
      .toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Should return a link NextJs component", () => {
    const button = renderer
      .create(<Button href="/">Example button</Button>)
      .toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Should return a link to an external href", () => {
    const button = renderer
      .create(<Button href="https://www.marvel.com/">Example button</Button>)
      .toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Should return a link to an external href in a new tab", () => {
    const button = renderer
      .create(<Button href="https://www.marvel.com/" target="_blank">Example button</Button>)
      .toJSON();
    expect(button).toMatchSnapshot();
  });
});
