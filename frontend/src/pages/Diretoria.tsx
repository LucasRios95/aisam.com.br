import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, Mail, Phone } from "lucide-react";

const Diretoria = () => {
  const diretores = [
    {
      name: "Vinicio César Pensa",
      position: "Presidente",
      company: "Vifranca Incorporacoes Ltda",
      email: "vinicio@aisam.com.br",
      image: "../src/assets/vinicio.png"
    },
    {
      name: "Élvio Luiz Lorieri",
      position: "Vice-Presidente",
      company: "SOLDATOPO-FLADAFI CONTAINERS",
      email: "aisam@aisam.com.br",
      image: "../src/assets/elvio.png"
    },
    {
      name: "Eduardo Estefano Filho",
      position: "Conselheiro Consultivo e Fiscal",
      company: "Cambuci S.A.",
      email: "aisam@aisam.com.br",
      image: "../src/assets/eduardo.png"
    },
    {
      name: "José Luiz Gavazzi",
      position: "Conselheiro Consultivo",
      company: "Fábrica de Artefatos de Latex Sao Roque Ltda",
      email: "aisam@aisam.com.br",
      image: '../src/assets/jose-luis-gavazzi.png'
    },
    {
      name: "Paulo Zanão",
      position: "Conselheiro Consultivo",
      company: "Caglaggi Sanmitsu",
      email: "aisam@aisam.com.br",
      image: "../src/assets/paulo-zanao.png"
    },
    {
      name: "Luiz Gonzaga Fontes",
      position: "Conselheiro Consultivo",
      company: "",
      email: "aisam@aisam.com.br",
      image: "../src/assets/luiz-gonzaga.png"
    },
    {
      name: "Reinaldo Mastrogiuseppe",
      position: "Conselheiro Consultivo",
      company: "",
      email: "aisam@aisam.com.br",
      image: "../src/assets/reinaldo.png"
    },
    {
      name: "Antônio Carlos Bonfante",
      position: "Conselheiro Fiscal",
      company: "Indústria Brasileira de Balões",
      email: "aisam@aisam.com.br",
      image: "../src/assets/Antonio-Carlos-Bonfante.png"
    },
    {
      name: "Luciano Lopreto De Souza Dias",
      position: "Conselheiro Fiscal",
      company: "",
      email: "aisam@aisam.com.br",
    }

  ];

  return (
    <PageLayout
      title="Diretoria"
      description="Conheça a diretoria da AISAM e os profissionais que lideram nossa associação"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Introdução */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nossa diretoria é composta por empresários experientes e comprometidos com o
              desenvolvimento industrial da região, trabalhando para fortalecer os laços entre
              as empresas associadas e promover o crescimento sustentável do setor.
            </p>
          </motion.div>

          {/* Grid de Diretores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diretores.map((diretor, index) => (
              <motion.div
                key={diretor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-primary/20 group-hover:border-primary/40 transition-colors duration-300" >
                        <AvatarImage className="w-full h-full" src={diretor.image} alt="" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-lg font-semibold">
                          <img src="{diretor.image}" className="w-full h-full" alt="" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-foreground">{diretor.name}</CardTitle>
                    <p className="text-primary font-medium">{diretor.position}</p>
                    <p className="text-sm text-muted-foreground">{diretor.company}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="truncate">{diretor.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Informações Adicionais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-primary/5 rounded-lg p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Gestão Transparente e Comprometida
            </h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              Nossa diretoria é eleita democraticamente pelos associados para mandatos de dois anos,
              garantindo representatividade e renovação constante de ideias. Todas as decisões são
              tomadas de forma transparente e sempre visando o benefício comum de todos os associados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <div className="text-sm text-muted-foreground">Anos de Mandato</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">6</div>
                <div className="text-sm text-muted-foreground">Membros da Diretoria</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">37</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Diretoria;