import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary">
              MarketSpace
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The world's leading marketplace for high-quality digital assets. Built by creators, for creators.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/browse?category=HTML_TEMPLATE" className="hover:text-primary transition-colors">HTML Templates</Link></li>
              <li><Link href="/browse?category=REACT" className="hover:text-primary transition-colors">React Components</Link></li>
              <li><Link href="/browse?category=UI_KIT" className="hover:text-primary transition-colors">UI Kits</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Sell</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/seller/dashboard" className="hover:text-primary transition-colors">Become a Seller</Link></li>
              <li><Link href="/seller/products/new" className="hover:text-primary transition-colors">List a Product</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary transition-colors">Seller Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MarketSpace Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
