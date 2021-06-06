import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders firebaseui", () => {
  render(<App />);
  const linkElement = screen.getByText(/Sign in with Google/i);
  expect(linkElement).toBeInTheDocument();
});
