import { motion } from "framer-motion";
import logoWhats from "@/assets/whatsapp1.png";

const WhatsAppButton = () => {
  // Telefone da AISAM (removendo caracteres especiais para o link do WhatsApp)
  const phoneNumber = "5511471269979"; // +55 (11) 4712-6979
  const message = "Olá! Gostaria de mais informações sobre a AISAM.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Caixinha de texto */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.8
        }}
        className="hidden md:block bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200"
      >
        <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
          Clique aqui para entrar em contato
        </p>
      </motion.div>

      {/* Botão WhatsApp */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Fale conosco pelo WhatsApp"
      >
        <img
          src={logoWhats}
          alt="WhatsApp"
          className="w-10 h-10 object-contain"
        />

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
