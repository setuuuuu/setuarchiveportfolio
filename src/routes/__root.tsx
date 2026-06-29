import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ThemeStyles } from "@/components/site/ThemeStyles";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl">404</p>
        <h1 className="mt-4 font-display text-2xl uppercase">Page not found</h1>
        <p className="mt-3 text-sm text-ink-soft">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/" className="link-underline text-sm uppercase tracking-widest">
            ← Back to index
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl uppercase">This page didn't load</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm uppercase tracking-widest">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="link-underline"
          >
            Try again
          </button>
          <a href="/" className="link-underline">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Studio / Name — Graphic Design Portfolio" },
      { name: "description", content: "An editorial portfolio of typography, cover art and graphic design." },
      { name: "author", content: "Studio / Name" },
      { property: "og:title", content: "Studio / Name — Graphic Design Portfolio" },
      { property: "og:description", content: "An editorial portfolio of typography, cover art and graphic design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeStyles />
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
