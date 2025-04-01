
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Truck, User } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden">
            <Truck className="h-8 w-8 text-swift-700" />
          </div>
          <span className="hidden font-bold text-xl sm:inline-block">Swift Mail Service</span>
        </Link>
        
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/track">Track</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/services">Services</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/contact">Contact</Link>
          </Button>
          <Button asChild variant="default" className="gap-2 hidden sm:flex">
            <Link to="/login">
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
