import React, { memo, useState } from "react";

import styled from "@emotion/styled";
import { darken } from "polished";
import { useTranslation } from "next-i18next";
import dataSearchConfig from "../../pages/d/searchConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Box, InputBase, MenuItem, Select } from "@mui/material";

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
`;

const SearchIcon = styled.div`
  svg {
    width: 19px;
    height: 19px;
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(1.5)};
    padding-left: ${(props) => props.theme.spacing(2.5)};
  }
`;

const IndexSelect = styled(Select)`
  color: ${(props) => props.theme.header.search.color};
  padding-left: ${(props) => props.theme.spacing(1.5)};
  border: none;
  height: 40px;
  box-sizing: border-box;

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  svg {
    color: ${(props) => props.theme.header.search.color};
  }
`;

const IndexMenuItem = styled(MenuItem)`
  padding-top: ${(props) => props.theme.spacing(3.5)};
  padding-bottom: ${(props) => props.theme.spacing(3.5)};
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
      min-width: calc(100vw - 650px);
    }
  }
`;

const SearchBar = memo(() => {
  const { t } = useTranslation();

  const [selectedIndex, setSelectedIndex] = useState("data");
  const indices = [
    { key: "data", value: "Datasets" },
    { key: "task", value: "Tasks" },
    { key: "flow", value: "Flows" },
    { key: "run", value: "Runs" },
    { key: "study", value: "Collections" },
    { key: "measure", value: "Measures" },
  ];

  const handleIndexChange = (event) => {
    setSelectedIndex(event.target.value);
  };

  const config = dataSearchConfig;

  return (
    <SearchProvider config={config}>
      <IndexSelect
        labelId="index-select-label"
        id="index-select"
        value={selectedIndex}
        onChange={handleIndexChange}
        label="Index"
        MenuProps={{
          PaperProps: {
            sx: {
              boxShadow: 2,
              border: "1px solid #d3d4d5",
            },
          },
        }}
      >
        {indices.map((item) => (
          <IndexMenuItem key={item.key} value={item.key}>
            {item.value}
          </IndexMenuItem>
        ))}
      </IndexSelect>
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
                placeholder: t("search." + selectedIndex),
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
  return (
    <SearchWrapper
      ecolor={ecolor}
      sx={{
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <SearchIcon>
        <FontAwesomeIcon icon={faSearch} />
      </SearchIcon>
      <SearchBar />
    </SearchWrapper>
  );
};

SearchBar.displayName = "Search";

export default SearchContainer;
