export function Footer() {
  const currentYear = new Date().getFullYear();
  const siteName = process.env['NEXT_SITE_NAME'] || 'rexdeia';

  return (
    <footer className="mt-14 text-center text-sm font-normal text-gray-700">
      &copy; {siteName} {currentYear}
    </footer>
  );
}
