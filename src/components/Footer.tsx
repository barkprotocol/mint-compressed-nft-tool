export default function Footer() {
  return (
    <footer className="flex h-18 w-full items-center bg-black px-8 text-white sm:px-16">
      <div className="flex h-full w-full flex-grow py-4 justify-between items-center">
        <span>&copy; {new Date().getFullYear()} BARK Protocol. All rights reserved.</span>
        <a
          href="/terms-of-use"
          className="text-white hover:underline"
          aria-label="Terms of Use"
        >
          Terms of Use
        </a>
      </div>
    </footer>
  );
}
