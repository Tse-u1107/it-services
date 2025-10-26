
interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

export const sampleNavItems: NavItem[] = [
  // HELP section
  {
    id: 'help-getting-started',
    label: 'Getting Started',
    path: '/help/getting-started',
    children: [
      {
        id: 'help-getting-started-setup',
        label: 'Initial Setup',
        path: '/help/getting-started/setup',
      },
      {
        id: 'help-getting-started-guide',
        label: 'Quick Start Guide',
        path: '/help/getting-started/guide',
      },
    ],
  },
  {
    id: 'help-account',
    label: 'Account & Access',
    path: '/help/account',
    children: [
      {
        id: 'help-account-password',
        label: 'Password Reset',
        path: '/help/account/password',
      },
      {
        id: 'help-account-2fa',
        label: 'Two-Factor Authentication',
        path: '/help/account/2fa',
      },
      {
        id: 'help-account-issues',
        label: 'Account Issues',
        path: '/help/account/issues',
      },
    ],
  },
  {
    id: 'help-network',
    label: 'Network & Connectivity',
    path: '/help/network',
    children: [
      {
        id: 'help-network-wifi',
        label: 'WiFi Connection',
        path: '/help/network/wifi',
      },
      {
        id: 'help-network-vpn',
        label: 'VPN Setup',
        path: '/help/network/vpn',
      },
    ],
  },
  {
    id: 'help-software',
    label: 'Software & Applications',
    path: '/help/software',
  },
  {
    id: 'help-hardware',
    label: 'Hardware Support',
    path: '/help/hardware',
  },
  {
    id: 'help-security',
    label: 'Security & Privacy',
    path: '/help/security',
    children: [
      {
        id: 'help-security-policies',
        label: 'Security Policies',
        path: '/help/security/policies',
      },
      {
        id: 'help-security-best-practices',
        label: 'Best Practices',
        path: '/help/security/best-practices',
      },
    ],
  },

  // CONTACT section
  {
    id: 'contact-support',
    label: 'Contact Support',
    path: '/contact/support',
  },
  {
    id: 'contact-feedback',
    label: 'Submit Feedback',
    path: '/contact/feedback',
  },
  {
    id: 'contact-chat',
    label: 'Live Chat',
    path: '/contact/chat',
  },
  {
    id: 'contact-phone',
    label: 'Phone Support',
    path: '/contact/phone',
  },

  // EXAMPLE section
  {
    id: 'example-tutorials',
    label: 'Tutorials',
    path: '/example/tutorials',
    children: [
      {
        id: 'example-tutorials-video',
        label: 'Video Tutorials',
        path: '/example/tutorials/video',
      },
      {
        id: 'example-tutorials-written',
        label: 'Written Guides',
        path: '/example/tutorials/written',
      },
    ],
  },
  {
    id: 'example-faqs',
    label: 'FAQs',
    path: '/example/faqs',
  },
  {
    id: 'example-resources',
    label: 'Resources',
    path: '/example/resources',
    children: [
      {
        id: 'example-resources-downloads',
        label: 'Downloads',
        path: '/example/resources/downloads',
      },
      {
        id: 'example-resources-docs',
        label: 'Documentation',
        path: '/example/resources/docs',
      },
      {
        id: 'example-resources-templates',
        label: 'Templates',
        path: '/example/resources/templates',
      },
    ],
  },
];