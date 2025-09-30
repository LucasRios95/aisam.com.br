import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2 } from "lucide-react";

// Importar logos dos associados
import logo5STintas from "@/assets/5S TINTAS.jpg";
import logoAgrostahl from "@/assets/Agrostahl.jpg";
import logoAlta from "@/assets/ALTA-Logo_White_RGB (002).jpg";
import logoCablaggi from "@/assets/Cablaggi.jpg";
import logoCambuci from "@/assets/Cambucci.jpg";
import logoBomSono from "@/assets/BomSono (002).jpg";
import logoCefri from "@/assets/Cefri.jpg";
import logoFiorella from "@/assets/FIRELLA.jpg";
import logoSoldatopo from "@/assets/LOGO FLADAFI SOLDATOPO desde 1967.bmp";
import logoFiore from "@/assets/logo-fiore.jpg"
import logoConcentrol from "@/assets/Concentrol.jpg";
import logoEngeformas from "@/assets/Logo Engeformas correto - 2025.jpg";
import logoEtruria from "@/assets/Etruria.jpg";
import logoEverest from "@/assets/LOGO-EVEREST-SEM-FUNDO (002).png";
import logoLatex from "@/assets/Latex.jpg";
import logoIBB from "@/assets/logo-ibb.jpg";
import logoInaltex from "@/assets/Logo Inaltex (002).jpg";
import logoGreenwood from "@/assets/Greenwood.jpg";
import logoLevisa from "@/assets/LEVISA.jpg";
import logoMasterfew from "@/assets/Masterfew.jpg";
import logoLamace from "@/assets/Logo Lamace.png";
import logoVifranca from "@/assets/logo vifranca.jpg";
import logoViniplast from "@/assets/logo vini 2023 alta resolução (002).jpeg";
import logoGoes from "@/assets/Logo Góes (2).jpg";
import logoUnimed from "@/assets/Unimed.jpg";
import logoDemocrata from "@/assets/O democrata.jpg";
import logoInova from "@/assets/logo-inovacao.jpg";
import logoNovosPs from "@/assets/Logo-novosPS.png"

const Associados = () => {
  const associados = [
    {
      name: "5S TINTAS INDÚSTRIA E COMÉRCIO LTDA",
      sector: "Indústria Química",
      description: "Fabricação de tintas e produtos químicos especializados.",
      logo: logo5STintas
    },
    {
      name: "AGROSTAHL S/A INDÚSTRIA E COMÉRCIO",
      sector: "Metalurgia",
      description: "Indústria siderúrgica e produtos de aço.",
      logo: logoAgrostahl
    },
    {
      name: "ALTA PERFORMANCE MATERIALS",
      sector: "Indústria de Materiais Avançados",
      description: "Desenvolvimento e fabricação de materiais de alta performance.",
      logo: logoAlta
    },
    {
      name: "CABLAGGI SANMITSU CONDUTORES ELÉTRICOS LTDA",
      sector: "Telecomunicações",
      description: "Soluções em cabeamento e infraestrutura de telecomunicações.",
      logo: logoCablaggi
    },
    {
      name: "CAMBUCI S/A (PENALTY)",
      sector: "Indústria de Material Esportivo",
      description: "Fabricação de equipamentos e uniformes esportivos.",
      logo: logoCambuci
    },
    {
      name: "BOM SONO LTDA",
      sector: "Indústria Mobiliária",
      description: "Fabricação de colchões e produtos para o sono.",
      logo: logoBomSono
    },
    {
      name: "CEFRI ARMAZENAGEM FRIGORIFICADA E AGROINDUSTRIAL LTDA",
      sector: "Indústrias de Alimentação e Bebidas",
      description: "Soluções em logística e armazenagem frigorificada para agroindústria.",
      logo: logoCefri
    },
    {
      name: "CELUTEX NÃO TECIDOS / FIORELLA",
      sector: "Indústria Têxtil",
      description: "Tecidos e não tecidos para as mais diversas aplicações.",
      logo: logoFiorella
    },
    {
      name: "CONTAINERS FLADAFI - EPP",
      sector: "Fundição de Ferro e Aço",
      description: "Soldagem especializada e fabricação de containers industriais.",
      logo: logoSoldatopo
    },
    {
      name: "DESMO LUB (CONCENTROL)",
      sector: "Indústria Química",
      description: "Indústria e comércio de produtos químicos e lubrificantes.",
      logo: logoConcentrol
    },
    {
      name: "ENGEFORMAS INDÚSTRIA E COMÉRCIO LTDA",
      sector: "Equipamentos Industriais",
      description: "Formas para construção civil.",
      logo: logoEngeformas
    },
    {
      name: "ETRÚRIA INDÚSTRIA E COMÉRCIO LTDA",
      sector: "Indústria Cerâmica",
      description: "Produtos cerâmicos e materiais para construção.",
      logo: logoEtruria
    },
    {
      name: "EVEREST ENGENHARIA DE INFRAESTRUTURA LTDA",
      sector: "Serviços de Engenharia",
      description: "Engenharia de infraestrutura e construção civil.",
      logo: logoEverest
    },
    {
      name: "FÁBRICA DE ARTEFATOS DE LÁTEX ESTRELA",
      sector: "Indústria de Látex",
      description: "Fabricação de artefatos de látex e produtos especializados.",
      logo: logoLatex
    },
    {
      name: "FIORE CAIXAS LTDA",
      sector: "Indústria de Embalagens",
      description: "Fabricação de caixas e embalagens personalizadas.",
      logo: logoFiore
    },
    {
      name: "GREENWOOD INDÚSTRIA E COMÉRCIO LTDA",
      sector: "Indústria Mobiliária",
      description: "Fabricação de móveis e produtos de madeira.",
      logo: logoGreenwood
    },
    {
      name: "INALTEX INDÚSTRIA BRASILEIRA LTDA",
      sector: "Indústria Têxtil",
      description: "Tecidos e não tecidos para as mais diversas aplicações.",
      logo: logoInaltex
    },
    {
      name: "INDÚSTRIA BRASILEIRA DE BALÕES",
      sector: "Indústria de Látex",
      description: "Fabricação de artefatos de látex e produtos infláveis.",
      logo: logoIBB
    },
    {
      name: "INOVAÇÃO ADMINISTRAÇÃO",
      sector: "Administração de Empresas",
      description: "Serviços de administração e gestão empresarial.",
      logo: logoInova
    },
    {
      name: "LAMACE COMÉRCIO DE IMPORTAÇÃO E EXPORTAÇÃO",
      sector: "Comércio Internacional",
      description: "Importação e exportação de produtos diversos.",
      logo: logoLamace
    },
    {
      name: "LEVISA",
      sector: "Indústria Química",
      description: "Produtos químicos especializados.",
      logo: logoLevisa
    },
    {
      name: "MASTERFEW INDÚSTRIA E COMÉRCIO LTDA",
      sector: "Equipamentos Industriais",
      description: "Fabricação de equipamentos e componentes industriais.",
      logo: logoMasterfew
    },
    {
      name: "MELLO COMUNICAÇÕES",
      sector: "Internet e TI",
      description: "Serviços de comunicação e tecnologia da informação.",
      logo: null
    },
    {
      name: "MGV RECURSOS HUMANOS",
      sector: "RH – Recrutamento e Terceirização",
      description: "Especializada em soluções completas de recursos humanos e terceirização de serviços.",
      logo: null
    },
    {
      name: "NZ COOPERPOLYMER TERMOPLÁSTICOS ENGENHARIA",
      sector: "Indústria Química",
      description: "Processamento de termoplásticos e engenharia de materiais.",
      logo: null
    },
    {
      name: "NZ PHILPOLYMER MÁQUINAS",
      sector: "Equipamentos Industriais",
      description: "Fabricação de máquinas para processamento de polímeros.",
      logo: null
    },
    {
      name: "NZ PHILPOLYMER INJEÇÃO",
      sector: "Indústria de Plásticos",
      description: "Injeção de produtos plásticos especializados.",
      logo: null
    },
    {
      name: "NOVOS PS",
      sector: "Serviços Diversos",
      description: "Prestação de serviços diversos para indústria.",
      logo: logoNovosPs
    },
    {
      name: "O DEMOCRATA - IRMÃOS BOCATO",
      sector: "Comunicação",
      description: "Jornal e serviços de comunicação regional.",
      logo: logoDemocrata
    },
    {
      name: "UNIMED SÃO ROQUE",
      sector: "Planos de Saúde – Assistência Médica",
      description: "Cooperativa médica e planos de saúde.",
      logo: logoUnimed
    },
    {
      name: "VALEMAM",
      sector: "Comércio",
      description: "Comércio de produtos diversos.",
      logo: null
    },
    {
      name: "VIFRANCA CORPORAÇÕES LTDA",
      sector: "Administração de Empresas",
      description: "Gestão e administração de empresas.",
      logo: logoVifranca
    },
    {
      name: "VINIPLAST - INDÚSTRIA COMÉRCIO REPRESENTAÇÕES LONAS LTDA",
      sector: "Indústria de Plásticos",
      description: "Fabricação de lonas e produtos plásticos especializados.",
      logo: logoViniplast
    },
    {
      name: "VITIVINÍCOLA GÓES LTDA",
      sector: "Indústrias de Alimentação e Bebidas",
      description: "Produção de vinhos e bebidas alcoólicas.",
      logo: logoGoes
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
              <Link to="/associe-se" >
                Saiba Mais sobre os Benefícios
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
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
                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden shadow-sm">
                      {associado.logo ? (
                        <img
                          src={associado.logo}
                          alt={`Logo ${associado.name}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="h-12 w-12 text-primary" />
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
              <Link to='/contato'>
                Saiba Mais sobre os Associados
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout >
  );
};

export default Associados;