import Head from "next/head";
import { randomUUID } from "crypto";
import styled from "styled-components";
import { CharacterCard } from "@/components/CharacterCard";
import { PRIVATE_KEY, PUBLIC_KEY } from "@/config";
import { generateMD5Hash } from "@/utils/generateMD5Hash";
import { Character, characterSchema } from "@/types/schemas";

const Container = styled.div`
  margin: 0px auto;
  padding: 20px;
  max-width: 440px;

  @media (min-width: 768px) {
    padding: 40px;
    max-width: 1180px;
  }
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 32px;

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

interface HomeProps {
  characters: Character[];
}

export default function Home({ characters }: HomeProps) {
  return (
    <>
      <Head>
        <title>Marvel - Ornella Radica</title>
        <meta name="description" content="Marvel search character app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h1>Marvel</h1>
        <CharacterGrid>
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </CharacterGrid>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const time = randomUUID();
  const hash = generateMD5Hash(time + PRIVATE_KEY + PUBLIC_KEY);
  const limit = 6;
  const url = `http://gateway.marvel.com/v1/public/characters?limit=${limit}&ts=${time}&apikey=${PUBLIC_KEY}&hash=${hash}`;

  const res = await fetch(url);
  const data = await res.json();

  const characters: Character[] = data.data.results.map(
    (character: unknown) => {
      return characterSchema.parse(character);
    }
  );

  return { props: { characters } };
}
