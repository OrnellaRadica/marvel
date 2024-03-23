import Head from "next/head";
import { randomUUID } from "crypto";
import styled from "styled-components";
import { CharacterCard } from "@/components/CharacterCard";
import { PRIVATE_KEY, PUBLIC_KEY } from "@/config";
import { generateMD5Hash } from "@/utils/generateMD5Hash";
import { Character } from "@/types/schemas";
import { useState } from "react";
import { CharacterCardSkeleton } from "@/components/CharacterCardSkeleton";
import { Button } from "@/components/Button";
import { extractCharactersData } from "@/utils/extractCharactersData";
import { ArrowIcon, Spinner } from "@/components/Icons";
import { Search } from "@/components/Search";

const Container = styled.div`
  margin: 0px auto;
  padding: 20px;
  max-width: 440px;

  @media (min-width: 768px) {
    padding: 40px;
    max-width: 1180px;
  }
`;

const PageTitle = styled.h1`
  margin-bottom: 36px;
  font-size: 40px;
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 32px;
  margin-bottom: 16px;

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SpinnerContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 8px;
  width: fit-content;
  margin: auto;
`;

interface HomeProps {
  characters: Character[];
  totalCharacters: number;
}

export type SearchStatus =
  | "idle"
  | "loading"
  | "error"
  | "no-results"
  | "success";

type LoadMoreStatus = "idle" | "loading" | "error";

export default function Home(props: HomeProps) {
  const [characters, setCharacters] = useState(props.characters);
  const [totalCharacters, setTotalCharacters] = useState(props.totalCharacters);
  const [loadMoreStatus, setLoadMoreStatus] = useState<LoadMoreStatus>("idle");
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [searchedCharacter, setSearchedCharacter] = useState<Character | null>(
    null
  );

  const loadMore = async () => {
    try {
      setLoadMoreStatus("loading");
      const res = await fetch(`/api/characters?offset=${characters.length}`, {
        method: "GET",
      });
      const data = await res.json();
      setCharacters((prev) => [...prev, ...data.characters]);
      setTotalCharacters(data.totalCharacters);
      setLoadMoreStatus("idle");
    } catch (error) {
      setLoadMoreStatus("error");
    }
  };

  return (
    <>
      <Head>
        <title>Marvel - Ornella Radica</title>
        <meta name="description" content="Marvel search character app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <PageTitle>Search your character</PageTitle>
        <Search
          setSearchedCharacter={setSearchedCharacter}
          searchStatus={searchStatus}
          setSearchStatus={setSearchStatus}
          characters={characters}
        />

        {searchStatus === "idle" ? (
          // No search is in process, render the grid.
          <>
            <CharacterGrid>
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
              {loadMoreStatus === "loading" &&
                Array.from({ length: 6 }).map((_, index) => (
                  <CharacterCardSkeleton key={index} />
                ))}
            </CharacterGrid>
            {loadMoreStatus !== "loading" &&
              // Don't show the button if there are no more results to fetch.
              totalCharacters > characters.length && (
                <ButtonContainer>
                  <Button variant="secondary" onClick={loadMore}>
                    Load more
                    <ArrowIcon />
                  </Button>
                </ButtonContainer>
              )}
          </>
        ) : (
          <>
            {searchStatus === "success" && searchedCharacter && (
              <CharacterGrid>
                <CharacterCard character={searchedCharacter} />
              </CharacterGrid>
            )}
            {searchStatus === "no-results" && <h4>No results</h4>}
            {searchStatus === "loading" && (
              <SpinnerContainer>
                <Spinner />
              </SpinnerContainer>
            )}
          </>
        )}
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

  const characters = extractCharactersData(data.data.results);

  return { props: { characters, totalCharacters: data.data.total } };
}
