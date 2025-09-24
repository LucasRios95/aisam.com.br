import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2 } from "lucide-react";

// Importar logos dos associados
import logoMGV from "@/assets/Logo CMYK (002).jpg";
import logoSEAP from "@/assets/LOGO ESCURO.png";
import logoSoldatopo from "@/assets/LOGO FLADAFI SOLDATOPO desde 1967.bmp";
import logoIBB from "@/assets/Logotipo IBB.TIF";
import logoCefri from "@/assets/Cefri.jpg";
import logoCambuci from "@/assets/Cambucci.jpg";
import logoCablaggi from "@/assets/Cablaggi.jpg";
import logoCelutex from "@/assets/INALTEX-INDUSTRIA-BRASILEIRA-LTDA.webp";
import logoConcentrol from "@/assets/Concentrol.jpg";
import logoEngeformas from "@/assets/Logo Engeformas correto - 2025.jpg";
import logoGerdau from "@/assets/fabril-background.jpg"; // placeholder
import logoReckitt from "@/assets/fabril-background.jpg"; // placeholder

const Associados = () => {
  const associados = [
    {
      name: "MGV RECURSOS HUMANOS E TERCEIRIZAÇÃO",
      sector: "RH – Recrutamento e Terceirização",
      description: "Especializada em soluções completas de recursos humanos e terceirização de serviços.",
      logo: logoMGV
    },
    {
      name: "SEAP ADMINISTRAÇÃO DE BENS LTDA.",
      sector: "Administração de Empresas",
      description: "Administração profissional de bens e serviços empresariais.",
      logo: logoSEAP
    },
    {
      name: "SOLDATOPO – FLADAFI CONTAINERS LTDA",
      sector: "Fundição de Ferro e Aço",
      description: "Soldagem especializada e fabricação de containers industriais.",
      logo: logoSoldatopo
    },
    {
      name: "IBB – Indústria Brasileira de Balões",
      sector: "Indústria de Látex",
      description: "Fabricação de artefatos de látex e produtos infláveis.",
      logo: logoIBB
    },
    {
      name: "CEFRI – LOGÍSTICA E ARMAZENAGEM FRIGORIFICADA",
      sector: "Indústrias de Alimentação e Bebidas",
      description: "Soluções em logística e armazenagem frigorificada para agroindústria.",
      logo: logoCefri
    },
    {
      name: "CAMBUCI S/A",
      sector: "Indústria de Material Esportivo",
      description: "Fabricação de equipamentos e uniformes esportivos.",
      logo: logoCambuci
    },
    {
      name: "CABLAGGI SANMITSU",
      sector: "Telecomunicações",
      description: "Soluções em cabeamento e infraestrutura de telecomunicações.",
      logo: logoCablaggi
    },
    {
      name: "CELUTEX NÃO TECIDOS",
      sector: "Indústria Textil",
      description: "Produção de tecidos não-tecidos para diversas aplicações industriais.",
      logo: logoCelutex
    },
    {
      name: "CONCENTROL DO BRASIL",
      sector: "Indústria Química",
      description: "Indústria e comércio de produtos químicos especializados.",
      logo: logoConcentrol
    },
    {
      name: "ENGEFORMAS INDÚSTRIA E COMÉRCIO",
      sector: "Equipamentos Industriais",
      description: "Indústria e comércio de auto peças e equipamentos industriais.",
      logo: logoEngeformas
    },
    {
      name: "GERDAU AÇOS LONGOS",
      sector: "Metalurgia",
      description: "Usina siderúrgica de Araçariguama, produção de aços longos.",
      logo: logoGerdau
    },
    {
      name: "RECKITT BENCKISER (BRASIL) LTDA.",
      sector: "Indústria de Cosméticos",
      description: "Produtos de higiene pessoal, cosméticos e perfumaria.",
      logo: logoReckitt
    }
  ];

  return (
    <PageLayout
      title="Associados"
      description="Conheça as empresas que fazem parte da nossa associação industrial"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-lg p-8 mb-12 text-center"
          >
            <Building2 className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Seja um Associado AISAM
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Junte-se a dezenas de empresas que já fazem parte da nossa rede.
              Conheça os benefícios e fortaleça sua empresa através da união industrial.
            </p>
            <Button size="lg" asChild>
              <a href="/associe-se">
                Saiba Mais sobre os Benefícios
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>

          {/* Lista de Associados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associados.map((associado, index) => (
              <motion.div
                key={associado.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden shadow-sm">
                      {associado.logo ? (
                        <img
                          src={associado.logo}
                          alt={`Logo ${associado.name}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-sm leading-tight">
                      {associado.name}
                    </h3>
                    <p className="text-primary font-medium text-sm mb-3">
                      {associado.sector}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {associado.description}
                    </p>
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
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Para mais informações sobre nossos associados
            </h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco para conhecer melhor as empresas parceiras
              e oportunidades de negócio em nossa rede.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/contato">
                Entre em Contato
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Associados;