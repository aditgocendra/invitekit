import { AtSign, PhoneCall } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Wedding Templates", href: "#templates" },
    { label: "Circumcision Templates", href: "#templates" },
    { label: "Feature", href: "#solution" },
    { label: "Price", href: "#pricing" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carrier", href: "#" },
    { label: "Contact", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#faq" },
    { label: "Tutorial", href: "#process" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const socialLinks = [
  {
    icon: PhoneCall,
    label: "WhatsApp",
    href: "https://wa.me/6281234567890",
  },
  { icon: AtSign, label: "Email", href: "mailto:hello@invitekit.id" },
];

export default function FooterSection() {
  return (
    <footer className='bg-foreground text-background py-12 lg:py-16'>
      <div className='container mx-auto px-4'>
        {/* Main Footer Content */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* Brand Column */}
          <div className='lg:col-span-2'>
            <span className='font-fredoka text-3xl font-semibold text-secondary'>
              InviteKit
            </span>

            <p className='text-sm text-background/70 mb-4 max-w-xs'>
              A trusted digital invitation platform for digital invitations.
              Cost-effective, easy to distribute, and environmentally friendly.
            </p>

            {/* Social Links */}
            <div className='flex items-center gap-3'>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-default'
                  aria-label={social.label}>
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='font-headline text-lg font-bold text-background mb-4'>
              Products
            </h3>
            <ul className='space-y-2'>
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-sm text-background/70 hover:text-primary font-body transition-default'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='font-headline text-lg font-bold text-background mb-4'>
              About
            </h3>
            <ul className='space-y-2'>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-sm text-background/70 transition-default'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='font-headline text-lg font-bold text-background mb-4'>
              Support
            </h3>
            <ul className='space-y-2'>
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-sm text-background/70 '>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-background/10'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-background/70 font-body text-center sm:text-left'>
              {`© 2025`} InviteKit. Semua hak dilindungi.
            </p>

            <div className='flex items-center gap-6'>
              <Link
                href='#'
                className='text-sm text-background/70 hover:text-primary font-body transition-default'>
                Terms of Service
              </Link>
              <Link
                href='#'
                className='text-sm text-background/70 hover:text-primary font-body transition-default'>
                Privacy
              </Link>
              <Link
                href='#'
                className='text-sm text-background/70 hover:text-primary font-body transition-default'>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
