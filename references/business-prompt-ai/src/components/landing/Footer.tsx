export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
            <span className="w-5 h-5 rounded-[5px] bg-foreground flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-[2px] bg-primary" />
            </span>
            AnasNode
          </div>
          <p className="mt-3 text-[12.5px] text-muted-foreground max-w-xs leading-relaxed">
            AI automation for the businesses that keep cities running.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-[12.5px] sm:justify-self-end">
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Product</p>
            <a href="#how" className="block text-foreground hover:text-muted-foreground transition-colors">How it works</a>
            <a href="#industries" className="block text-foreground hover:text-muted-foreground transition-colors">Industries</a>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Company</p>
            <a href="#" className="block text-foreground hover:text-muted-foreground transition-colors">About</a>
            <a href="#" className="block text-foreground hover:text-muted-foreground transition-colors">Contact</a>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Legal</p>
            <a href="#" className="block text-foreground hover:text-muted-foreground transition-colors">Privacy</a>
            <a href="#" className="block text-foreground hover:text-muted-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between text-[11.5px] text-muted-foreground font-mono">
          <span>© 2025 AnasNode</span>
          <span>Made for operators.</span>
        </div>
      </div>
    </footer>
  );
}
