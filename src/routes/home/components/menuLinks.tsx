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

interface SourceLink {
  title: string;
  field_linkto: string | null;
  field_services_icon: string | null;
  view_node: string;
  field_linkto_1: string;
}

interface FilteredLink {
  title: string;
  tag: string;
  url: string;
  viewNode: string;
}

/**
 * Extracts URL from HTML anchor tag
 */
function extractUrlFromViewNode(viewNode: string): string {
  const match = viewNode.match(/href="([^"]+)"/);
  return match ? match[1] : '';
}

/**
 * Filters and tags links from source array based on LINK_CONFIG
 */
function filterAndTagLinks(sourceLinks: SourceLink[]): FilteredLink[] {
  // Create a Map for O(1) lookup
  const configMap = new Map(
    LINK_CONFIG.map(item => [item.title.toLowerCase(), item.tag])
  );

  return sourceLinks
    .filter(link => configMap.has(link.title.toLowerCase()))
    .map(link => ({
      title: link.title,
      tag: configMap.get(link.title.toLowerCase())!,
      url: extractUrlFromViewNode(link.view_node),
      viewNode: link.view_node
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
 * Main function to process links
 */
function processLinks(sourceLinks: SourceLink[]) {
  const filteredLinks = filterAndTagLinks(sourceLinks);
  const groupedLinks = groupLinksByTag(filteredLinks);
  
  return {
    filtered: filteredLinks,
    grouped: groupedLinks,
    stats: {
      total: sourceLinks.length,
      filtered: filteredLinks.length,
      categories: Object.keys(groupedLinks).length
    }
  };
}

// const accountLinks = result.grouped["Account & Access"] || [];
// console.log('Account & Access links:', accountLinks);

export { 
  processLinks, 
  filterAndTagLinks, 
  groupLinksByTag, 
  LINK_CONFIG,
  type FilteredLink,
  type SourceLink 
};