import styled from "styled-components";

const CharacterRoot = styled.div`
  border-radius: 4px;
  overflow: hidden;
  background: white;
  outline: 1px solid #e0e0e0;
`;

const CharacterImg = styled.div`
  height: 230px;
  width: 100%;
  background: #f8f8f8;
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 24px;
  padding: 24px;
  margin-top: auto;
  height: calc(100% - 234px);
`;

const CharacterName = styled.div`
  background-color: #e4e4e4;
  height: 30px;
  border-radius: 4px;
`;

const CharacterDescription = styled.div`
  background-color: #e4e4e4;
  height: 80px;
  border-radius: 4px;
`;

const CharacterLink = styled.div`
  background-color: #444;
  height: 54px;
  width: 170px;
  border-radius: 4px;
  margin-left: auto;
`;

export function CharacterCardSkeleton() {
  return (
    <CharacterRoot>
      <CharacterImg/>
      <CharacterInfo>
        <CharacterName/>
        <CharacterDescription/>
        <CharacterLink />
      </CharacterInfo>
    </CharacterRoot>
  );
}
