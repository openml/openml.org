import React, { memo } from "react";
import styled from "@emotion/styled";
import { darken } from "polished";
import { useTranslation } from "next-i18next";
import dataSearchConfig from "../../pages/d/searchConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Box, InputBase } from "@mui/material";

import { SearchProvider, SearchBox } from "@elastic/react-search-ui";

const SearchWrapper = styled(Box)`
  border-radius: 2px;
  background-color: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.header.background};
  position: relative;
  width: 100%;
  color: ${(props) => props.theme.sidebar.header.brand.color};

  &:hover {
    background-color: ${(props) =>
      darken(
        0.05,
        props.ecolor ? props.ecolor : props.theme.header.background,
      )};
  }

  svg {
    width: 19px;
    height: 19px;
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(2.5)};
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(2.5)};
    min-width: 100vw;
  }

  & > input::placeholder {
    opacity: 0.8;
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    & > input {
      min-width: 440px;
    }
  }
  ${(props) => props.theme.breakpoints.up("lg")} {
    & > input {
      min-width: 740px;
    }
  }
`;

const SearchBar = memo(({ config }) => {
  const { t } = useTranslation();

  return (
    <SearchProvider config={config}>
      <SearchBox
        searchAsYouType={true}
        debounceLength={300}
        autocompleteMinimumCharacters={3}
        autocompleteResults={{
          linkTarget: "_blank",
          sectionTitle: "Results",
          titleField: "name",
          urlField: "url",
          shouldTrackClickThrough: true,
          clickThroughTags: ["test"],
        }}
        autocompleteSuggestions={true}
        onSubmit={(searchTerm) => {
          window.location.href = `search?q=${searchTerm}`;
        }}
        inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
          <>
            <Input
              {...getInputProps({
                placeholder: t("Search"),
              })}
            />
            {getAutocomplete()}
          </>
        )}
      />
    </SearchProvider>
  );
});

const SearchContainer = ({ ecolor }) => {
  const searchConfig = dataSearchConfig;

  return (
    <SearchWrapper
      ecolor={ecolor}
      sx={{
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <FontAwesomeIcon icon={faSearch} />
      <SearchBar config={searchConfig} />
    </SearchWrapper>
  );
};

SearchBar.displayName = "Search";

export default SearchContainer;
