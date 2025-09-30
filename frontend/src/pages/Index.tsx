import Hero from "@/components/Hero";
import IndustryGrid from "@/components/IndustryGrid";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, HandshakeIcon, Handshake, UserCheck } from "lucide-react";
import senaiLogo from "@/assets/senai.svg";
import sesiLogo from "@/assets/Logo-SESI-SP.svg";

const Index = () => {
  return (
    <PageLayout>
      <Hero />

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 title-clean">
              Associação das Indústrias AISAM
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A AISAM é uma entidade fundada em agosto de 1986, como Sociedade Civil sem fins lucrativos,
              com o objetivo de reunir as indústrias de São Roque, Araçariguama, Alumínio e Mairinque,
              visando a união dos empresários e a defesa dos interesses da classe.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Nossa Missão</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Fortalecer o setor industrial regional através da união e cooperação entre empresas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Nossos Valores</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Transparência, cooperação e desenvolvimento sustentável da indústria regional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <HandshakeIcon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Nosso Objetivo</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Defender os interesses comuns e promover o crescimento das indústrias associadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <IndustryGrid />

      {/* Partnerships Section */}
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
              Nossas Parcerias
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trabalhamos em conjunto com instituições renomadas para oferecer
              os melhores benefícios e oportunidades aos nossos associados
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Empresas Sócias</h3>
                    <p className="text-muted-foreground text-sm">
                      Rede colaborativa de empresas associadas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-2">
                      <img src={senaiLogo} alt="SENAI" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">SENAI</h3>
                    <p className="text-muted-foreground text-sm">
                      Capacitação profissional - SENAI Alumínio, SENAI Mairinque
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-2">
                      <img src={sesiLogo} alt="SESI" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">SESI</h3>
                    <p className="text-muted-foreground text-sm">
                      Saúde ocupacional - SESI São Roque, SESI Alumínio
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UserCheck className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">SPC/CDL</h3>
                    <p className="text-muted-foreground text-sm">
                      Serviços de proteção ao crédito e apoio ao comércio regional
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-primary/5 rounded-lg p-8">
              <Handshake className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Fortalecendo a Indústria Regional
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nossas parcerias estratégicas garantem acesso a capacitação profissional,
                saúde ocupacional, proteção ao crédito e uma rede sólida de colaboração empresarial.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-section text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Associe-se agora à AISAM
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se a nós e faça parte da maior associação industrial da região.
              Juntos somos mais fortes!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/associe-se">
                Associe-se Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
