/* components/footer/Footer.tsx */

import { SITE_CONFIG } from "@/utils/constants";
import Link from "next/link"
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

type FooterProps = {
  whatsappNumber?: string;
  instagramUser?: string;
};

export default function Footer({ whatsappNumber, instagramUser }: FooterProps) {
  return (
    <footer className="footer-styles">
      <div className="footer-behavior">
        <div className="information row gap-5">
          © {SITE_CONFIG.name} {new Date().getFullYear()} | Todos os direitos reservados
        </div>        

        <div className="flex items-center gap-2">
          <Link 
            href={`https://instagram.com/${instagramUser}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="button instagram"
            aria-label="Instagram"
          >
            <FaInstagram className="icon-size-sm" />
          </Link>
          
          <Link 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="button whatsapp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="icon-size-sm" />
          </Link>
        </div>
      </div>
    </footer>
  );
};