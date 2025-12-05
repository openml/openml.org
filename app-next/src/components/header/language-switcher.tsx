"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

/**
 * Language Switcher - Client Component
 * Dropdown menu for language selection
 */
export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = React.useState("en");

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    // TODO: Integrate with i18n system
    console.log(`Language changed to: ${langCode}`);
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button> */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <LanguageNetworkIcon className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {lang.code === currentLang && (
              <span className="text-primary ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const LanguageNetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="8" cy="10" r="1" />
    <circle cx="16" cy="8" r="1" />
    <circle cx="15" cy="15" r="1" />
    <path d="M8.8 10.8l5.2 3.7" />
    <path d="M9 10l5.5-2.3" />
    <path d="M12 3v18" opacity=".6" />
    <path d="M3 12h18" opacity=".6" />
  </svg>
);

export const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9h17" />
    <path d="M3.5 15h17" />
    <path d="M12 3c3 4 3 14 0 18" />
    <path d="M12 3c-3 4-3 14 0 18" />
  </svg>
);