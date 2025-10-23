import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from '@/assets/aisam-logo.webp'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "AISAM", href: "/aisam" },
    { name: "Vagas", href: "/vagas" },
    { name: "Associados", href: "/associados" },
    { name: "Diretoria", href: "/diretoria" },
    { name: "Consultoria Jurídica", href: "/consultoria-juridica" },
    { name: "Serviços", href: "/servicos" },
    { name: "JAISAM", href: "/jaisam" },
    { name: "Associe-se", href: "/associe-se" },
    { name: "Links Úteis", href: "/links-uteis" },
    { name: "Notícias", href: "/noticias" },
  ];

  const isActivePage = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="AISAM - Página inicial"
            >
              <img
                src={logo}
                alt="AISAM"
                className="h-16 w-auto group-hover:scale-105 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActivePage(item.href)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  aria-current={isActivePage(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden lg:block">
            <Button variant="outline" asChild>
              <a href="http://localhost:5175" target="_blank" rel="noopener noreferrer">
                Acessar Sistema
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActivePage(item.href)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActivePage(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="http://localhost:5175"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Acessar Sistema
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;