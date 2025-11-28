import React from "react";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

export default function AffiliateLink({ href, children, className, ...props }: Props) {
    return (
        <a
            href={href}
            target="_blank"
            rel="sponsored noreferrer"
            className={className}
            {...props}
        >
            {children}
        </a>
    );
}
