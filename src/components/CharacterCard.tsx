import { Character } from "@/types/schemas";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const CharacterRoot = styled.div`
  border-radius: 4px;
  overflow: hidden;
  background: white;
  outline: 1px solid #e0e0e0;
`;

const CharacterImg = styled(Image)`
  object-fit: cover;
  width: 100%;
  @media (min-width: 768px) {
    height: 230px;
  }
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 24px;
  padding: 24px;
  margin-top: auto;
  height: calc(100% - 294px);
  @media (min-width: 768px) {
    height: calc(100% - 234px);
  }
`;

const CharacterName = styled.h4`
  font-size: 18px;
  letter-spacing: -0.64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (min-width: 768px) {
    font-size: 24px;
    line-height: 24px;
  }
`;

const CharacterDescription = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #6c6c6c;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.64px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const CharacterLink = styled(Link)`
  background-color: #444;
  color: #fff;
  padding: 16px 24px;
  text-decoration: none;
  border-radius: 4px;
  margin-left: auto;
  display: flex;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.24px;
  &:hover {
    background-color: #1b1a1a;
  }
`;

const ArrowIcon = styled.svg`
  width: 20px;
  fill: #fff;
  stroke: #fff;
  stroke-width: 2px;
`;

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <CharacterRoot>
      <CharacterImg
        src={character.thumbnail.path + "." + character.thumbnail.extension}
        width={436}
        height={290}
        alt={character.name + " image"}
      />
      <CharacterInfo>
        <CharacterName>{character.name}</CharacterName>
        <CharacterDescription>
          {character.description
            ? character.description
            : "(No description available)"}
        </CharacterDescription>
        {/* TODO: get url */}
        <CharacterLink href="/" target="blank">
          Read more
          <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
              d="m31.71 15.29-10-10-1.42 1.42 8.3 8.29H0v2h28.59l-8.29 8.29 1.41 1.41 10-10a1 1 0 0 0 0-1.41z"
              data-name="3-Arrow Right"
            />
          </ArrowIcon>
        </CharacterLink>
      </CharacterInfo>
    </CharacterRoot>
  );
}
