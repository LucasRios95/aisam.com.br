import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Target, Award, Users } from "lucide-react";

const Aisam = () => {
  return (
    <PageLayout
      title="AISAM"
      description="Conheça a história, missão e valores da Associação das Indústrias de São Roque, Araçariguama, Alumínio e Mairinque"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* História */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  A AISAM foi fundada em agosto de 1986, como Sociedade Civil sem fins lucrativos, 
                  com o objetivo claro de reunir as indústrias de São Roque, Araçariguama, 
                  Alumínio e Mairinque.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Desde então, temos trabalhado incansavelmente para promover a união dos 
                  empresários e defender seus interesses comuns, fortalecendo o setor 
                  industrial de nossa região.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="card-shadow">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">1986</h3>
                    <p className="text-muted-foreground">Ano de Fundação</p>
                  </CardContent>
                </Card>
                <Card className="card-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">Mais de 39</h3>
                    <p className="text-muted-foreground">Anos de Experiência</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Missão, Visão e Valores */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <Card className="card-shadow">
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Representar e defender os interesses das indústrias associadas, 
                  promovendo o desenvolvimento econômico sustentável da região.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Visão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser reconhecida como a principal entidade representativa do setor 
                  industrial da região, promovendo inovação e competitividade.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Valores</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transparência, cooperação, ética, sustentabilidade e 
                  comprometimento com o desenvolvimento regional.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Região de Atuação */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-muted/30 rounded-lg p-8"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Região de Atuação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["São Roque", "Araçariguama", "Alumínio", "Mairinque"].map((city, index) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-xl">
                      {city.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{city}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Aisam;