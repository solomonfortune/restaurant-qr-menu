const Navbar = ({ title, subtitle, user, onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onMenuToggle} className="rounded-2xl border border-stone-200 p-3 lg:hidden">
            <span className="block h-0.5 w-5 bg-stone-800" />
            <span className="mt-1.5 block h-0.5 w-5 bg-stone-800" />
            <span className="mt-1.5 block h-0.5 w-5 bg-stone-800" />
          </button>
          <div>
            <h2 className="font-display text-2xl text-stone-900">{title}</h2>
            <p className="text-sm text-stone-500">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-right shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Signed in</p>
          <p className="font-semibold text-stone-800">{user?.restaurantName || user?.name || 'Restaurant Owner'}</p>
          <p className="text-sm text-stone-500">{user?.email || 'owner@example.com'}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
