import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { darken } from "polished";
import { useTranslation } from "next-i18next";
import dataSearchConfig from "../../pages/d/searchConfig";
import taskSearchConfig from "../../pages/t/searchConfig";
import flowSearchConfig from "../../pages/f/searchConfig";
import runSearchConfig from "../../pages/r/searchConfig";
import collectionSearchConfig from "../../pages/d/searchConfig"; // TODO: update when collection config is created
import benchmarkSearchConfig from "../../pages/d/searchConfig"; // TODO: update when benchmark config is created
import measureSearchConfig from "../../pages/d/searchConfig"; // TODO: update when measure config is created

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Box, InputBase, MenuItem, Select } from "@mui/material";

import { SearchProvider, SearchBox } from "@elastic/react-search-ui";
import { useTheme } from "@mui/system";

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
  const router = useRouter();

  // List of configs for each index
  const indexConfigs = {
    data: dataSearchConfig,
    task: taskSearchConfig,
    flow: flowSearchConfig,
    run: runSearchConfig,
    collection: collectionSearchConfig,
    benchmark: benchmarkSearchConfig,
    measure: measureSearchConfig,
  };
  // Mapping of indices for the select dropdown
  const indices = [
    { key: "data", value: "Datasets" },
    { key: "task", value: "Tasks" },
    { key: "flow", value: "Flows" },
    { key: "run", value: "Runs" },
    { key: "collection", value: "Collections" },
    { key: "benchmark", value: "Benchmark" },
    { key: "measure", value: "Measures" },
  ];

  const [selectedIndex, setSelectedIndex] = useState("data");
  const [currentConfig, setCurrentConfig] = useState(dataSearchConfig);

  const handleIndexChange = (event) => {
    const newIndex = event.target.value;
    setSelectedIndex(newIndex);
    setCurrentConfig(indexConfigs[newIndex]);
  };

  // Set the index based on the current path
  useEffect(() => {
    const pathSegments = router.pathname.split("/");
    const indexFromUrl = pathSegments[1];

    if (["d", "t", "f", "r", "b", "c", "m"].includes(indexFromUrl)) {
      const index = indices.find((item) => item.key.charAt(0) === indexFromUrl);
      if (index) {
        setSelectedIndex(index.key);
      }
    }
  }, [router.pathname]); // Depend on router.pathname to re-run the effect when the route changes

  return (
    <SearchProvider config={currentConfig}>
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
              border: `1px solid rgba(0, 0, 0, 0.12);
              `,
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
          window.location.href = `/${selectedIndex[0]}/search?q=${searchTerm}`;
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
