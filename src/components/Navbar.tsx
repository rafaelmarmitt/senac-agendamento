import { Button } from "@/components/ui/button";
import { Calendar, Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

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
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Minha Conta
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {(userRole === 'manager' || userRole === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link to="/gerente">Painel Gerente</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Painel Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/registro">Cadastrar</Link>
                </Button>
              </>
            )}
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
            <div className="px-4 pt-2 space-y-2">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                  >
                    Dashboard
                  </Link>
                  {(userRole === 'manager' || userRole === 'admin') && (
                    <Link 
                      to="/gerente" 
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                    >
                      Painel Gerente
                    </Link>
                  )}
                  {userRole === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/registro">Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
