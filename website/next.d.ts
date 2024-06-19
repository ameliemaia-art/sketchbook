import type {
  NextComponentType,
  NextLayoutComponentType,
  NextPageContext,
} from "next";
import type { AppProps } from "next/app";

import { FooterData } from "@interfaces/sanity/Footer";

declare module "next" {
  type NextLayoutComponentType<P = {}> = NextComponentType<
    NextPageContext,
    any,
    P
  > & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}

declare module "next/app" {
  type AppLayoutProps<P = {}> = AppProps & {
    Component: NextLayoutComponentType;
    footerData: FooterData;
  };
}

declare global {
  interface Window {
    adobeDataLayer: any;
  }
  namespace NodeJS {
    interface ProcessEnv {}
  }
}
