import React from 'react';
import './nav-button.css';
import '../../fonts.css';

interface NavButtonProps {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const NavButton = ({ onClick, text, disabled = false, href, target, rel }: NavButtonProps): React.ReactNode => {
  // If href is provided, render as link
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`nav-button poppins-extrabold ${disabled ? 'disabled' : ''}`}
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        {text}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      onClick={onClick}
      className={`nav-button poppins-extrabold ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export { NavButton };
