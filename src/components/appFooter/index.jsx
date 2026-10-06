import { LuArrowUpRight, LuGithub } from "react-icons/lu";
import styles from "./styles.module.css";

const portfolioLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net" },
    { label: "GitHub", href: "https://github.com/a2rp" },
    { label: "CodePen", href: "https://codepen.io/ash1198" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan" },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/" },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1",
    },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com" },
];

const supportLinks = [
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/" },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan" },
    { label: "Patreon", href: "https://www.patreon.com/ashishranjan" },
];

const AppFooter = () => {
    const logoUrl = import.meta.env.BASE_URL + "logo.png";

    return (
        <footer className={styles.appFooter}>
            <div className={styles.inner}>
                <div className={styles.owner}>
                    <a
                        className={styles.logoLink}
                        href="https://www.ashishranjan.net"
                        aria-label="Ashish Ranjan portfolio"
                    >
                        <img src={logoUrl} alt="Ashish Ranjan logo" />
                    </a>
                    <p>
                        © {new Date().getFullYear()}{" "}
                        <a
                            href="https://github.com/a2rp"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Ashish Ranjan
                        </a>
                        . All rights reserved.
                    </p>
                </div>
                <div className={styles.linkGroups}>
                    <nav aria-label="Links">
                        {portfolioLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target={
                                    link.href.startsWith("mailto:")
                                        ? undefined
                                        : "_blank"
                                }
                                rel="noreferrer"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="https://github.com/a2rp/support-ticket-board"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <LuGithub aria-hidden="true" />
                            Source code
                            <LuArrowUpRight aria-hidden="true" />
                        </a>
                    </nav>
                    <nav aria-label="Support">
                        {supportLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
