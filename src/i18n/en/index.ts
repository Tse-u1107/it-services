import type { BaseTranslation } from '../i18n-types.js';

const en = {
  // TODO: your translations go here
  HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
  common: {
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
  },
  nav: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
  },
  errors: {
    notFound: 'Page not found',
    serverError: 'Something went wrong',
  },
  home: {
    greetingLong: 'Hi, How can we help you?',
    list: {
      account: 'Account & access',
      network: 'Network & connectivity',
      software: 'Software & applications',
      hardware: 'Hardware & Devices',
      security: 'Security & Policies',
      support: 'Support & Services',
    }
  },
} satisfies BaseTranslation;

export default en;


// NYU login / NET ID setup
// Password reset / Recovery
// Two-factor Authentication
// Account issues for Students/Faculty/Staff