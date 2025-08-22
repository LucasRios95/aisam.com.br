import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wrench, 
  Users, 
  Hammer, 
  Building, 
  Phone, 
  Monitor, 
  Cog, 
  Zap,
  UtensilsCrossed,
  Truck,
  Shirt,
  Palette,
  Building2,
  Heart,
  Bed,
  Package
} from "lucide-react";

const industries = [
  { name: "Equipamentos Industriais", icon: Wrench },
  { name: "RH – Recrutamento e Terceirização", icon: Users },
  { name: "Fundição de Ferro e Aço", icon: Hammer },
  { name: "Construção Civil", icon: Building },
  { name: "Telecomunicações", icon: Phone },
  { name: "Internet e TI", icon: Monitor },
  { name: "Serviços de Engenharia", icon: Cog },
  { name: "Metalurgia", icon: Zap },
  { name: "Indústrias de Alimentação e Bebidas", icon: UtensilsCrossed },
  { name: "Indústria de Material Esportivo", icon: Truck },
  { name: "Indústria Eletro-Eletrônica", icon: Zap },
  { name: "Indústria Química", icon: Palette },
  { name: "Administração de Empresas", icon: Building2 },
  { name: "Planos de Saúde – Assistência Médica", icon: Heart },
  { name: "Indústria Textil", icon: Shirt },
  { name: "Indústria Hoteleira", icon: Bed },
  { name: "Indústria de Embalagens", icon: Package },
  { name: "Indústria de Látex", icon: Shirt },
  { name: "Indústria Mobiliária", icon: Building },
  { name: "Indústria de Cosméticos", icon: Palette },
];

const IndustryGrid = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Setores Industriais
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Representamos uma ampla diversidade de indústrias em nossa região
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {industry.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustryGrid;