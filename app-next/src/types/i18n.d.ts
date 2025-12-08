import "next-intl";

// Use type safe messages keys
type Messages = typeof import("./messages/en.json");

declare module "next-intl" {
  interface AppConfig {
    Messages: Messages;
  }
}
