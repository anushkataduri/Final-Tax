import { Link, type Href } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import type { ComponentProps } from "react";

export interface ExternalLinkProps
  extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
}

export function ExternalLink({ href, ...rest }: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as Href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
