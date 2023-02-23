/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import AwesomePerson from "../components/Product";
import "@testing-library/jest-dom";

describe("Home page", () => {
  it("renders a person card", () => {
    render(
      <AwesomePerson
        id={"fsdfsdf"}
        name={"Example Name"}
        address={"Example Address"}
        email={"example@gmail.com"}
        phone={"222-333-555-555"}
      />
    );
  });
});
