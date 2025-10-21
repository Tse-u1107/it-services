// HelpSection.tsx
import React from "react";

interface HelpItem {
  title: string;
  description: string;
  href?: string;
}

interface Section {
  title: string;
  items: HelpItem[];
}

interface HelpSectionProps {
  sections: Section[];
}

const HelpSection: React.FC<HelpSectionProps> = ({ sections }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          {/* Section Title */}
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {section.title}
          </h2>

          {/* Cards */}
          <div className="space-y-6">
            {section.items.map((item, i) => (
              <a
                key={i}
                href={item.href || "#"}
                className="block group transition-all"
              >
                <h3 className="text-purple-700 font-semibold group-hover:underline">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-800 transition-colors">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HelpSection;
