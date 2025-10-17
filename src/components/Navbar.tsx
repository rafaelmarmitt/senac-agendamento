import { Button } from "@/components/ui/button";
import { Calendar, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SENAC Agendas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/calendario" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Calendário
            </Link>
            <Link 
              to="/salas" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Salas
            </Link>
            <Link 
              to="/sobre" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sobre
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/registro">Cadastrar</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link 
              to="/calendario" 
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
            >
              Calendário
            </Link>
            <Link 
              to="/salas" 
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
            >
              Salas
            </Link>
            <Link 
              to="/sobre" 
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
            >
              Sobre
            </Link>
            <div className="px-4 pt-2 space-y-2">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/login">
                  <User className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link to="/registro">Cadastrar</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
