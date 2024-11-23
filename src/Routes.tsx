import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

/*
  Define the structure of the page component.
  Each page is a React component that is exported as the default export.
*/
export interface Page {
  default: React.ComponentType;
}

/*
  Define a mapping of page paths to their corresponding page components.
  The key is the path of the page, and the value is the Page interface.
*/
interface Pages {
  [key: string]: Page;
}

/*
  Define the structure of a route configuration.
  Each route has a path and an associated component to render.
*/
interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

/*
  Routes component: This component receives a pages object,
  generates route configurations, and renders the defined routes.
*/
const Routes = ({ pages }: { pages: Pages }) => {
  // Generate the route configurations from the pages object.
  const routes: RouteConfig[] = useRoutes(pages);

  // Create an array of Route components based on the route configurations.
  const routeComponents = routes.map(
    ({ path, component: Component }: RouteConfig) => (
      <Route key={path} path={path} element={<Component />} />
    )
  );

  // Find the NotFound component to render for unmatched routes.
  const NotFound =
    routes.find(({ path }: RouteConfig) => path === "/notFound")?.component ||
    (() => <div>Not Found</div>); // Fallback to a simple Not Found component.

  return (
    <ReactRouterRoutes>
      {routeComponents} {/* Render the defined route components */}
      <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
    </ReactRouterRoutes>
  );
};

/*
  useRoutes function: Generates route configurations based on the provided pages object.
  It transforms the file paths into route paths and extracts the default components.
*/
const useRoutes = (pages: Pages): RouteConfig[] => {
  const routes = Object.keys(pages)
    .map((key) => {
      // Convert the file path to a route path.
      let path = key
        .replace("./pages", "") // Remove the base directory.
        .replace(/\.(t|j)sx?$/, "") // Remove the file extension.
        .replace(/\/index$/i, "/") // Convert index files to root paths.
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase()) // Lowercase the first letter of the path.
        .replace(/\[\.\.\.(\w+?)\]/g, (_match, _) => `*`) // Convert catch-all params.
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`); // Convert dynamic params.

      // Remove trailing slashes from paths, except for the root path.
      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      // Warn if the page does not export a default React component.
      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      // Return the path and component for the route.
      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route): route is RouteConfig => Boolean(route.component)); // Ensure route has a valid component.

  return routes; // Return the generated route configurations.
};

export default Routes;
