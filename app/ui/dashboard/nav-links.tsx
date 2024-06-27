"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname(); // uses `usePathname()` hook to grab client's current path
  return (
    <>
      {/* iterates over links arr and generates an element for each */}
      {/* passes in link (object from links arr) */}
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            // uniquely identify each link with a key, able to identify w/n list
            key={link.name}
            // sets dest URL for each link
            href={link.href}
            // uses clsx --> checks client's current pathname and if == link.href it's highlighted blue
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-sky-100 text-blue-600' : pathname == link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            {/* link name is 1. hidden by default AND 2. only displayed on >medium screens */}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
