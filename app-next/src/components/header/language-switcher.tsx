"use client";

import * as React from "react";
// import { Globe } from "lucide-react";
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
        {/* <Button variant="ghost" size="icon" className="size-10">
            <Globe className="size-6" />
            <span className="sr-only">Change language</span>
          </Button> */}
        <Button
          variant="ghost"
          size="icon"
          className="size-10 cursor-pointer text-slate-700 hover:bg-slate-300 hover:text-slate-900"
        >
          <LanguageIcon className="size-6 cursor-pointer" />
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
