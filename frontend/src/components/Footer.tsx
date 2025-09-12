import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "AISAM", href: "/aisam" },
    { name: "Associados", href: "/associados" },
    { name: "Diretoria", href: "/diretoria" },
    { name: "Serviços", href: "/servicos" },
  ];

  const services = [
    { name: "Consultoria Jurídica", href: "/consultoria-juridica" },
    { name: "Associe-se", href: "/associe-se" },
    { name: "Links Úteis", href: "/links-uteis" },
    { name: "Notícias", href: "/noticias" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  className="flex items-center space-x-3 group"
                  aria-label="AISAM - Página inicial"
                >
                  <img
                    src="/src/assets/aisam-logo.webp"
                    alt="AISAM"
                    className="h-12 w-auto group-hover:scale-105 transition-all duration-300"
                  />
                </Link>
              </div>
            </div>
            <p className="text-background/80 mb-6 leading-relaxed">
              Associação das Indústrias de São Roque, Araçariguama, Alumínio e Mairinque.
              Fundada em 1986, reunimos empresários para defender interesses comuns.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-sm">
                  Av. Santa Rita, 57 – Sala 18/19 – Vila Aguiar<br />
                  CEP: 18130-675 São Roque - SP
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-sm">(11) 4712-6979</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-sm">aisam@aisam.com.br</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-background/80 hover:text-accent transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} AISAM - Associação das Indústrias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;