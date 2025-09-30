import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, HandshakeIcon } from "lucide-react";
import backgroundImage from "@/assets/fabril-background.jpg";


const Hero = () => {
  return (
    <section className="hero-section text-primary-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ background: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30"></div>
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
              AISAM
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-4 opacity-90">
              Associação das Indústrias de São Roque, Araçariguama, Alumínio e Mairinque
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
              Fundada em 1986, reunimos as indústrias da região para fortalecer
              a união empresarial e defender os interesses da classe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/associe-se">
                  <HandshakeIcon className="mr-2 h-5 w-5" />
                  Associe-se agora
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/aisam">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/80 to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">4 Cidades</h3>
              <p className="text-sm opacity-90">São Roque, Araçariguama, Alumínio e Mairinque</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/80 to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Desde 1986</h3>
              <p className="text-sm opacity-90">Mais de 35 anos defendendo nossos associados</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;