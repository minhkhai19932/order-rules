import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  /**
   * Initial route for the in-memory router.
   * Defaults to "/".
   */
  route?: string;
  /**
   * Extra props forwarded to MemoryRouter.
   */
  routerProps?: MemoryRouterProps;
}

function renderWithRouter(
  ui: ReactElement,
  { route = "/", routerProps, ...options }: RenderWithRouterOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]} {...routerProps}>
        {children}
      </MemoryRouter>
    );
  }

  return testingLibraryRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { renderWithRouter as render };


