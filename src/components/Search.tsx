import { useRouter } from "next/router";
import { FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SearchIcon } from "./Icons";
import { Character } from "@/types/schemas";
import { SearchStatus } from "@/pages";

const SearchRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 552px;
`;

const Input = styled.input`
  border-radius: 4px 0 0 4px;
  border: 2px solid #e0e0e0;
  border-right: 0px;
  font-size: 18px;
  padding: 14px;
  width: 100%;

  &:focus {
    outline: none;
    border: 2px solid #eb2328;
    border-right: 0px;
  }
`;

const SubmitButton = styled.button`
  background: #eb2328;
  border-radius: 0 8px 8px 0;
  border: 2px solid #eb2328;
  padding: 12px;
  color: #fff;
  cursor: ${(props) => (props.disabled ? "not-allowed" : null)};
  opacity: ${(props) => (props.disabled ? "80%" : "100%")};

  &:focus {
    outline-color: #eb2328;
    outline-offset: 2px;
    outline-width: 2px;
    border-color: #fff;
  }
`;

const ClearButton = styled.button`
  background: #fff;
  border-radius: 4px;
  border: 2px solid #eb2328;
  padding: 8px 16px;
  color: #eb2328;
  font-weight: 600;
  margin-left: auto;

  &:focus {
    outline-color: #eb2328;
    outline-offset: 4px;
    outline-width: 2px;
    border-color: #fff;
    background: #eb2328;
    color: #fff;
  }

  @media (min-width: 768px) {
    margin-left: revert;
  }
`;

interface SearchProps {
  setSearchedCharacter: (character: Character | null) => void;
  searchStatus: SearchStatus;
  setSearchStatus: (next: SearchStatus) => void;
  characters: Character[];
}

export function Search({
  setSearchedCharacter,
  searchStatus,
  setSearchStatus,
  characters,
}: SearchProps) {
  const router = useRouter();
  const [characterName, setCharacterName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCharacterName(event.target.value);
  };

  const handleSearch = async (characterName: string) => {
    if (router.query.search !== characterName) {
      router.push(
        { query: { ...router.query, search: characterName } },
        undefined,
        { shallow: true }
      );
    }

    const lowerCaseCharacter = characterName.toLocaleLowerCase();
    const characterFound = characters.find(
      (character) => character.name.toLocaleLowerCase() === lowerCaseCharacter
    );

    if (characterFound) {
      setSearchedCharacter(characterFound);
      setSearchStatus("success");
      return;
    }
    try {
      setSearchedCharacter(null);
      setSearchStatus("loading");

      const response = await fetch(`api/characters/${characterName}`);
      const data = await response.json();
      setSearchedCharacter(data);
      if (data) {
        setSearchStatus("success");
      } else {
        setSearchStatus("no-results");
      }
    } catch (error) {
      console.error(error);
      setSearchStatus("error");
    }
  };

  const handleClear = () => {
    setSearchStatus("idle");
    setSearchedCharacter(null);
    setCharacterName("");
    const { search, ...restQuery } = router.query;
    router.push({ query: { ...restQuery } }, undefined, { shallow: true });
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!router.isReady) return;
    const search = router.query.search;
    if (search === characterName) return;
    if (!search && characterName) {
      handleClear();
    }
    if (typeof search === "string" && search) {
      setCharacterName(search);
      handleSearch(search);
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!characterName) {
      handleClear();
      return;
    }
    handleSearch(characterName);
  };

  return (
    <SearchRoot>
      <Form onSubmit={handleSubmit} data-testid="search-form">
        <Input
          type="text"
          ref={inputRef}
          value={characterName}
          placeholder="Name of character"
          onChange={handleChange}
          id="search-input"
          data-testid="search-input"
        />
        <SubmitButton
          type="submit"
          disabled={searchStatus === "loading"}
          aria-label="submit search"
        >
          <SearchIcon />
        </SubmitButton>
      </Form>
      {searchStatus === "no-results" || searchStatus === "success" ? (
        <ClearButton onClick={handleClear} type="button">
          Clear
        </ClearButton>
      ) : null}
    </SearchRoot>
  );
}
