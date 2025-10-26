import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Breadcrumbs component for React Router v6
 * - auto-generates crumbs from current pathname
 * - supports a labelMap prop to show friendly names for dynamic segments
 * - accessible: uses nav[aria-label="Breadcrumb"] and ol/li structure
 *
 * Usage:
 * <Breadcrumbs labelMap={{ users: 'Users', ':id': 'Profile' }} />
 * or
 * <Breadcrumbs labelMap={{ users: 'Users', 'settings': 'Settings' }} />
 */

type LabelMap = Record<string, string>;

interface BreadcrumbsProps {
  separator?: React.ReactNode; // default is Chevron >
  labelMap?: LabelMap; // map path segment -> display label
  className?: string;
}

const defaultSeparator = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 mx-1 text-gray-400"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

function segmentToLabel(segment: string, labelMap?: LabelMap) {
  if (!segment) return '';
  // exact match from labelMap
  if (labelMap && labelMap[segment]) return labelMap[segment];

  // placeholder match e.g. :id
  if (labelMap) {
    const placeholderKey = Object.keys(labelMap).find((k) => k.startsWith(':') && /^:\w+$/.test(k));
    if (placeholderKey && /^\d+$/.test(segment)) {
      // if the path segment looks numeric and there's a :id label, use it
      return labelMap[placeholderKey];
    }
  }

  // nice human readable fallback: replace dashes, underscores, capitalize
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  separator = defaultSeparator,
  labelMap,
  className = '',
}) => {
  const location = useLocation();
  const { pathname } = location;

  // split pathname into segments and build cumulative hrefs
  const segments = pathname.split('/').filter(Boolean); // removes empty

  // if at root path ("/"), show single Home crumb
  if (segments.length === 0) {
    return (
      <nav
        className={`flex items-center text-sm text-gray-600 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          <li>
            <span className="font-semibold text-gray-800">Home</span>
          </li>
        </ol>
      </nav>
    );
  }

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const isLast = idx === segments.length - 1;
    const label = segmentToLabel(seg, labelMap);

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <nav className={`flex items-center text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center">
        {/* Home link */}
        <li>
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>

        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center text-[14px]">
            <span className="sr-only">{i === crumbs.length - 1 ? 'Current page:' : ''}</span>
            <span aria-hidden>{separator}</span>
            {c.isLast ? (
              <span className="font-semibold text-gray-800" aria-current="page">
                {c.label}
              </span>
            ) : (
              <Link to={c.href} className="hover:text-blue-600">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
