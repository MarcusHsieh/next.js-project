'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // URL is updated without reloading page -- thanks Next.js client side nav!
  function handleSearch(term: string) {
    // console.log(term);
    // `URLSearchParams`: 
    //  -- Web API providing utility methods to manipulate URL query parameters
    //  -- instead of complex string literal => `?page=1&query=a`
    const params = new URLSearchParams(searchParams); 
    if (term) {
      params.set('query', term);
    }
    else {
      params.delete('query');
    }
    // `${pathname} == current path so `/dashboard/invoices`
    // `params.toString()` translates input into URL format
    // overall -- update URL w/ user search data
    //  - so if user searches for "Lee"
    //  - URL == `/dashboard/invoices?query=lee`
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // onChange listener -- will invoke handleSearch whenever input value changes
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
