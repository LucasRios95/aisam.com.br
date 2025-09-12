import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-grow page-transition"
        role="main"
      >
        {title && (
          <div className="bg-muted/50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              >
                {title}
              </motion.h1>
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-xl text-muted-foreground max-w-3xl mx-auto"
                >
                  {description}
                </motion.p>
              )}
            </div>
          </div>
        )}
        
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;