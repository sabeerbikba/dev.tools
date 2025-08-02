import { Github, Linkedin, Globe, Instagram } from "lucide-react";
import ExternalLink from "@/common/ExternalLink";

const Footer = () => (
  <footer className="border-t bg-[#303236] border-white/30 !mt-16 text-[#eeeeee]">
    <div className="max-w-7xl !py-6 !px-4 !mx-auto">
      <div className="flex flex-col sm:flex-col md:flex-row md:justify-between md:items-center gap-6 text-center md:text-left">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <a href="/" className="font-semibold">
              Dev.tools
            </a>
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <span className="text-sm text-muted-foreground">
            Built by developers, for developers ❤️
          </span>
        </div>

        <div className="flex flex-col sm:flex-col md:flex-row items-center gap-4">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dev.tools -{" "}
            <ExternalLink href="https://github.com/sabeerbikba/dev.tools/blob/main/LICENSE">
              MIT Licensed
            </ExternalLink>
          </span>
          <div className="flex justify-center gap-3">
            {[
              {
                href: "https://github.com/sabeerbikba",
                label: "GitHub",
                icon: Github,
              },
              {
                href: "http://sabeerbikba.vercel.app/",
                label: "Website",
                icon: Globe,
              },
              {
                href: "https://www.instagram.com/uniquebeast__/",
                label: "LinkedIn",
                icon: Linkedin,
              },
              {
                href: "https://www.instagram.com/uniquebeast__/",
                label: "Instagram",
                icon: Instagram,
              },
            ].map((link) => (
              <ExternalLink
                href={link.href}
                aria-label={link.label}
                key={link.label}
              >
                <link.icon className="w-4 h-4" />
              </ExternalLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
