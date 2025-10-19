export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  sections: FooterSection[];
  bottomText?: string;
  bottomLinks?: FooterLink[];
  languageSelector?: {
    current: string;
    options: string[];
  };
}
