import React from 'react';

export interface Item {
  id: string;
  title: string;
  content: string; // optional, default to ""
  icon: React.ReactNode; // optional, can pass a Heroicon component
}
