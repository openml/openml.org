import React, { memo, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import { darken } from "polished";
import { useTranslation } from "next-i18next";
import dataSearchConfig from "../../search_configs/dataConfig";
import taskSearchConfig from "../../search_configs/taskConfig";
import flowSearchConfig from "../../search_configs/flowConfig";
import runSearchConfig from "../../search_configs/runConfig";
import collectionSearchConfig from "../../search_configs/dataConfig";
import benchmarkSearchConfig from "../../search_configs/dataConfig";
import measureSearchConfig from "../../search_configs/dataConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Box, InputBase, MenuItem, Select } from "@mui/material";

import { SearchProvider, SearchBox } from "@elastic/react-search-ui";

const SearchWrapper = styled(Box)`
  border-radius: 2px;
  background-color: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.palette.header.background};
  position: relative;
  width: 100%;
  color: ${(props) => props.theme.palette.sidebar.header.brand.color};

  background-color: ${(props) =>
    darken(
      0.05,
      props.ecolor ? props.ecolor : props.theme.palette.header.background,
    )};
`;

const SearchIcon = styled("div")(({ theme }) => ({
  svg: {
    width: 19,
    height: 19,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2.5),
  },
}));

const IndexSelect = styled(Select)`
  color: ${(props) => props.theme.palette.header.search.color};
  padding-left: ${(props) => props.theme.spacing(1.5)};
  border: none;
  height: 40px;
  box-sizing: border-box;

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  svg {
    color: ${(props) => props.theme.palette.header.search.color};
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
    color: ${(props) => props.theme.palette.header.search.color};
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
      min-width: calc(100vw - 720px);
    }
  }
`;

const SearchBar = memo(() => {
  const { t } = useTranslation();
  const router = useRouter();

  const indexConfigs = {
    data: dataSearchConfig,
    task: taskSearchConfig,
    flow: flowSearchConfig,
    run: runSearchConfig,
    collection: collectionSearchConfig,
    benchmark: benchmarkSearchConfig,
    measure: measureSearchConfig,
  };

  const indices = useMemo(
    () => [
      { key: "data", value: "Datasets" },
      { key: "task", value: "Tasks" },
      { key: "flow", value: "Flows" },
      { key: "run", value: "Runs" },
      { key: "collection", value: "Collections" },
      { key: "benchmark", value: "Benchmark" },
      { key: "measure", value: "Measures" },
    ],
    [],
  );

  const [selectedIndex, setSelectedIndex] = useState("data");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStarted, setSearchStarted] = useState(false);

  // Listen to index changes
  useEffect(() => {
    const pathSegments = router.pathname.split("/");
    const indexFromUrl = pathSegments[1];

    if (["d", "t", "f", "r", "b", "c", "m"].includes(indexFromUrl)) {
      const index = indices.find((item) => item.key.charAt(0) === indexFromUrl);
      if (index) {
        setSelectedIndex(index.key);
      }
    }
  }, [router.pathname, indices]);

  // Listen to query changes
  useEffect(() => {
    if (typeof router.query.q === "string") {
      setSearchTerm(router.query.q);
      setSearchStarted(true);
    }
  }, [router.query.q]);

  const handleIndexChange = (event) => {
    const newIndex = event.target.value;
    setSelectedIndex(newIndex);

    if (searchStarted && searchTerm) {
      router.push(`/${newIndex[0]}/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Copies the the search term into the config when starting the search
  const buildSearchConfig = (selectedIndex, searchTerm) => ({
    ...indexConfigs[selectedIndex],
    initialState: {
      searchTerm: searchTerm || "",
    },
    alwaysSearchOnInitialLoad: true,
  });

  const buildSearchConfigSimpler = (selectedIndex, searchTerm) => ({
    ...indexConfigs[selectedIndex],
  });

  return (
    <>
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
              border: `1px solid rgba(0, 0, 0, 0.12)`,
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

      {searchStarted && searchTerm ? ( // Wait for a search to be started before activating the search context
        <SearchProvider
          config={buildSearchConfigSimpler(selectedIndex, searchTerm)}
        >
          <SearchBox
            defaultInputValue={searchTerm}
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
            onSubmit={(term) => {
              setSearchTerm(term); // update committed search
              router.push(
                `/${selectedIndex[0]}/search?q=${encodeURIComponent(term)}`,
              );
            }}
            autocompleteView={({ autocompletedResults, getItemProps }) => (
              <div className="sui-search-box__autocomplete-container">
                {autocompletedResults.map((result, i) => (
                  <div
                    {...getItemProps({
                      key: result.id || i,
                      item: result,
                    })}
                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {result.title?.snippet || "No title"}
                  </div>
                ))}
              </div>
            )}
            //inputView={({ getInputProps }) => {
            //  const inputProps = getInputProps();
            //  return (
            //    <Input
            //      {...inputProps}
            //      placeholder={t("search." + selectedIndex)}
            //    />
            //  );
            //}}
          />
        </SearchProvider>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm) {
              setSearchStarted(true);
              router.push(
                `/${selectedIndex[0]}/search?q=${encodeURIComponent(searchTerm)}`,
              );
            }
          }}
        >
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search." + selectedIndex)}
          />
        </form>
      )}
    </>
  );
});

const SearchContainer = ({ ecolor }) => (
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

SearchBar.displayName = "Search";

export default SearchContainer;
