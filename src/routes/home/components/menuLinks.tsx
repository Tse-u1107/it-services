// Define your tag mappings - only place you need to maintain the list
const LINK_CONFIG = [
  { title: "Academic Technology Portal", tag: "Account & Access" },
  { title: "Audio and Visual", tag: "Hardware & Devices" },
  { title: "Campus Card", tag: "Account & Access" },
  { title: "Computing and Server", tag: "Hardware & Devices" },
  { title: "Data Center Management", tag: "Support & Services" },
  { title: "Engage", tag: "Software & Applications" },
  { title: "Event Management System (EMS)", tag: "Software & Applications" },
  { title: "Google Workspace (G Suit)", tag: "Software & Applications" },
  { title: "IP Phone", tag: "Hardware & Devices" },
  { title: "IT Asset Management (ITAM)", tag: "Support & Services" },
  { title: "IT Communication", tag: "Support & Services" },
  { title: "IT Navigation Page", tag: "Support & Services" },
  { title: "IT Request Service", tag: "Support & Services" },
  { title: "Multi-Factor Authentication (MFA)/Duo", tag: "Security & Policies" },
  { title: "NYU Box", tag: "Software & Applications" },
  { title: "NYU Shanghai IT User Manual", tag: "Support & Services" },
  { title: "NYU Shanghai IT WiKi", tag: "Support & Services" },
  { title: "Near Field Communication (NFC)", tag: "Hardware & Devices" },
  { title: "NetID and Password", tag: "Account & Access" },
  { title: "Printing and Advanced Printing", tag: "Hardware & Devices" },
  { title: "Residence Halls Support", tag: "Support & Services" },
  { title: "Security and Policies", tag: "Security & Policies" },
  { title: "Service Desk Support", tag: "Support & Services" },
  { title: "Software and Application", tag: "Software & Applications" },
  { title: "Space Reservation System", tag: "Support & Services" },
  { title: "Text Messaging System (SMS)", tag: "Network & Connectivity" },
  { title: "Virtual Computer Lab (VCL)", tag: "Software & Applications" },
  { title: "Virtual Private Network (VPN)", tag: "Network & Connectivity" },
  { title: "WeChat Enterprise", tag: "Software & Applications" },
  { title: "Wireless Network", tag: "Network & Connectivity" },
  { title: "Workflow Platform", tag: "Software & Applications" }
];

interface NavItem {
  title: string;
  link: string;
  uuid: string;
  children?: NavItem[];
}

interface FilteredLink {
  title: string;
  tag: string;
  link: string;
  uuid: string;
}

/**
 * Recursively extracts all nav items including nested children
 */
function flattenNavItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];
  
  for (const item of items) {
    result.push(item);
    if (item.children && item.children.length > 0) {
      result.push(...flattenNavItems(item.children));
    }
  }
  
  return result;
}

/**
 * Filters and tags links from nav items based on LINK_CONFIG
 */
function filterAndTagLinks(navItems: NavItem[]): FilteredLink[] {
  // Flatten all items including nested children
  const allItems = flattenNavItems(navItems);
  
  // Create a Map for O(1) lookup
  const configMap = new Map(
    LINK_CONFIG.map(item => [item.title.toLowerCase(), item.tag])
  );

  return allItems
    .filter(item => configMap.has(item.title.toLowerCase()))
    .map(item => ({
      title: item.title,
      tag: configMap.get(item.title.toLowerCase())!,
      link: item.link,
      uuid: item.uuid
    }));
}

/**
 * Groups filtered links by their tags
 */
function groupLinksByTag(links: FilteredLink[]): Record<string, FilteredLink[]> {
  return links.reduce((acc, link) => {
    if (!acc[link.tag]) {
      acc[link.tag] = [];
    }
    acc[link.tag].push(link);
    return acc;
  }, {} as Record<string, FilteredLink[]>);
}

/**
 * Main function to process links from local JSON data
 */
function processLinks(navItems: NavItem[]) {
  const filteredLinks = filterAndTagLinks(navItems);
  const groupedLinks = groupLinksByTag(filteredLinks);
  
  return {
    filtered: filteredLinks,
    grouped: groupedLinks,
    stats: {
      total: flattenNavItems(navItems).length,
      filtered: filteredLinks.length,
      categories: Object.keys(groupedLinks).length
    }
  };
}

// Example usage:
// import navData from './navigation.json';
// const result = processLinks(navData);
// const accountLinks = result.grouped["Account & Access"] || [];
// console.log('Account & Access links:', accountLinks);

export { 
  processLinks, 
  filterAndTagLinks, 
  groupLinksByTag,
  flattenNavItems,
  LINK_CONFIG,
  type FilteredLink,
  type NavItem 
};