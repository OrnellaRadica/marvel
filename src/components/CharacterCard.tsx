import { Character } from "@/types/schemas";
import Image from "next/image";
import styled from "styled-components";
import { Button } from "./Button";
import { ArrowIcon } from "./Icons";

const CharacterRoot = styled.div`
  border-radius: 4px;
  overflow: hidden;
  background: white;
  outline: 1px solid #e0e0e0;
  min-height: auto;
  @media (min-width: 768px) {
    min-height: 480px;
  }
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
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
        <ButtonContainer>
          {character.url && (
            <Button
              href={character.url}
              target="_blank"
              variant="primary"
            >
              Read more
              <ArrowIcon/>
            </Button>
          )}
        </ButtonContainer>
      </CharacterInfo>
    </CharacterRoot>
  );
}
