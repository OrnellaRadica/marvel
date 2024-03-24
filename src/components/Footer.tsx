import styled from "styled-components";

const FooterRoot = styled.footer`
  max-width: 480px;
  padding: 20px;
  margin: auto;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 1180px;
    padding: 40px;
    flex-direction: row;
  }

  a {
    text-decoration: none;
    color: #444;
    font-weight: 600;
  }
`;

interface FooterProps {
  attributionHTML: string;
}

export function Footer(props: FooterProps) {
  return (
    <FooterRoot>
      <div dangerouslySetInnerHTML={{ __html: props.attributionHTML }} />
      <p>Ornella Radica - Web Developer</p>
    </FooterRoot>
  );
}
