import React from "react";
import styled from "styled-components";
import { Bio } from "../../data/constants";
import {
  FacebookRounded,
  Instagram,
  LinkedIn,
  Twitter,
  GitHub,
  Reddit,
} from "@mui/icons-material";
import { FaDiscord } from "react-icons/fa";
import { SiBluesky } from "react-icons/si"; // Bluesky icon

const FooterContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  position: relative;
  background: radial-gradient(
    circle at 20% 20%,
    rgba(40, 40, 60, 0.6),
    rgba(10, 10, 20, 0.9)
  );
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.primary};
  text-shadow: 0 0 10px ${({ theme }) => theme.primary};
`;

const Nav = styled.ul`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.25s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateY(-3px) scale(1.2);
  }
`;

const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.soft2};
  text-align: center;
  opacity: 0.8;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <Logo>SOURAV KUMAR</Logo>
        <Nav>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
        </Nav>
        <SocialMediaIcons>
          <SocialMediaIcon
            href={Bio.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookRounded />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.insta}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.discord}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.bsky}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiBluesky />
          </SocialMediaIcon>
          <SocialMediaIcon
            href={Bio.reddit}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Reddit />
          </SocialMediaIcon>
        </SocialMediaIcons>
        <Copyright>&copy; 2026 SOURAV KUMAR. All rights reserved.</Copyright>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
