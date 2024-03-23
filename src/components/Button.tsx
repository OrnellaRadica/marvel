import Link from "next/link";
import { ComponentProps } from "react";
import styled, { css } from "styled-components";

interface BaseProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

type LinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

type Props = BaseProps & (ButtonProps | LinkProps);

function primaryColorStyles() {
  return css`
    background-color: #444;
    color: #fff;
    &:hover {
      background-color: #1b1a1a;
    }
  `;
}

function secondaryColorStyles() {
  return css`
    background-color: #fff;
    color: #444;
    outline: 2px solid #444;

    &:hover {
      background-color: #e4e4e4;
    }
  `;
}

function buttonBaseStyles(props: Props) {
  const { variant } = props;

  return css`
    padding: 16px 24px;
    text-decoration: none;
    border-radius: 4px;
    display: flex;
    gap: 16px;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: -0.16px;
    border: none;
    width: fit-content;
    ${() => {
      switch (variant) {
        case "primary":
          return primaryColorStyles();
        case "secondary":
          return secondaryColorStyles();
        default:
          primaryColorStyles();
      }
    }}
  `;
}

const StyledButton = styled.button<BaseProps & ButtonProps>(buttonBaseStyles);
const StyledAnchor = styled.a<BaseProps & LinkProps>(buttonBaseStyles);
const StyledLink = styled(Link)<BaseProps & LinkProps>(buttonBaseStyles);

export function Button(props: Props) {
  if (typeof props.href !== "string") {
    return <StyledButton type="button" {...props} />;
  }

  if (typeof props.href === "string" && props.href.startsWith("/")) {
    return <StyledLink {...props} />;
  }
  // In this case it's an external link
  return <StyledAnchor {...props} />;
}
