import React, { memo, useState } from "react";
import {
  Grid,
  Pagination,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  NativeSelect,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Card,
  LinearProgress,
} from "@mui/material";

import { TabContext, TabPanel } from "@mui/lab";

import ResultCard from "./ResultCard";
import ResultGridCard from "./ResultGridCard";
import Sort from "./Sort";

import styled from "@emotion/styled";
import {
  Facet,
  SearchProvider,
  Results,
  ResultsPerPage,
  Paging,
  PagingInfo,
  WithSearch,
} from "@elastic/react-search-ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faGrip,
  faGripHorizontal,
  faList,
  faSquare,
  faTable,
  faTableCells,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../Wrapper";
import { i18n } from "next-i18next";
import ResultsTable from "./ResultTable";
import Filter from "./Filter";
import TagFilter from "./TagFilter";

const SearchResults = styled(Results)`
  margin: 0px;
  padding: 0px;
`;

const FilterBox = styled(Card)`
  min-width: 100%;
  padding: 10px;
  border-radius: 0px;
  border-left: none;
  border-right: none;
  background-color: ${(props) => props.theme.palette.background.default};
`;
const FilterTabs = styled(Tabs)`
  min-height: 0px;
`;
const FilterTabPanel = styled(TabPanel)`
  min-height: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
`;

const FilterTab = styled(Tab)`
  min-height: 0px;
  border: 1px solid ${(props) => props.theme.palette.text.secondary};
  margin-right: 15px;
  border-radius: 50px;
  color: ${(props) => props.theme.palette.text.primary};
  background-color: ${(props) => props.theme.palette.background.default};

  &.Mui-selected {
    background-color: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.primary.contrastText};
  }
`;

// To hide tabs initially
const HiddenTab = styled(Tab)`
  min-height: 0px;
  visibility: hidden;
`;

const ResultsPerPageView = ({ options, value, onChange }) => (
  <Box minWidth={80}>
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        {i18n.t("search.results_per_page")}
      </InputLabel>
      <NativeSelect
        value={value}
        onChange={(o) => onChange(o.nativeEvent.target.value)}
        inputProps={{
          name: "sort",
          id: "uncontrolled-native",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  </Box>
);

const ViewToggle = ({ onChange, view }) => (
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={onChange}
    sx={{
      ml: 2,
    }}
  >
    <ToggleButton value="list">
      <FontAwesomeIcon icon={faList} />
    </ToggleButton>
    <ToggleButton value="table">
      <FontAwesomeIcon icon={faTable} />
    </ToggleButton>
    <ToggleButton value="grid">
      <FontAwesomeIcon icon={faGripHorizontal} />
    </ToggleButton>
  </ToggleButtonGroup>
);

const PagingInfoView = ({ start, end, totalResults }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "end",
    }}
  >
    <Typography justifyContent="center" display="inline-block">
      {i18n.t("search.showing")} <b>{start}</b> - <b>{end}</b>{" "}
      {i18n.t("search.out_of")} <b>{totalResults}</b> {i18n.t("search.results")}
    </Typography>
  </Box>
);

const PagingView = ({ current, totalPages, onChange }) => (
  <Pagination
    count={totalPages}
    color="primary"
    page={current}
    onChange={(event, value) => onChange(value)}
  />
);

// This is the Search UI component. The config contains the search state and actions.
const SearchContainer = memo(
  ({ config, sort_options, search_facets, columns }) => {
    // For showing and hiding search filters
    const [filter, setFilter] = useState("hide");
    const handleFilterChange = (event, newFilter) => {
      if (newFilter === filter) {
        setFilter("hide");
      } else {
        setFilter(newFilter + "");
      }
    };

    // For switch between list and table view
    const [view, setView] = useState("list");
    const handleViewChange = (event, newView) => {
      if (newView !== null) {
        setView(newView);
      }
    };

    return (
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ isLoading }) => ({ isLoading })}>
          {({ isLoading }) => (isLoading ? <LinearProgress /> : null)}
        </WithSearch>
        {false && <TagFilter />}
        <TabContext value={filter}>
          <FilterBox xs={12} variant="outlined">
            <FilterTabs
              value={filter}
              onChange={handleFilterChange}
              indicatorColor="none"
            >
              {search_facets.map((facet, index) => (
                <FilterTab
                  value={facet.label}
                  label={i18n.t(facet.label)}
                  key={facet.label}
                  iconPosition="start"
                  icon={<FontAwesomeIcon icon={faChevronDown} />}
                />
              ))}
              <HiddenTab value="hide" label="Hide" key="hide" />
            </FilterTabs>
            {search_facets.map((facet, index) => (
              <FilterTabPanel value={facet.label} key={index}>
                <Facet
                  key={index}
                  field={facet.field}
                  label={facet.label}
                  filterType="any"
                  view={Filter}
                  value={filter}
                  index={index}
                  show={25}
                />
              </FilterTabPanel>
            ))}
          </FilterBox>
        </TabContext>
        <Wrapper fullWidth>
          <Grid container spacing={3}>
            <Grid m={2} size={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <PagingInfo view={PagingInfoView} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Sort sortOptions={sort_options} />
                  <ViewToggle onChange={handleViewChange} view={view} />
                </Box>
              </Box>
            </Grid>
            <Grid size={12}>
              {view === "list" && (
                <SearchResults
                  resultView={ResultCard}
                  titleField="name"
                  urlField="data_id"
                  shouldTrackClickThrough
                />
              )}
              {view === "table" && (
                <WithSearch mapContextToProps={({ results }) => ({ results })}>
                  {({ results }) => (
                    <ResultsTable results={results} columns={columns} />
                  )}
                </WithSearch>
              )}
              {view === "grid" && (
                <WithSearch mapContextToProps={({ results }) => ({ results })}>
                  {({ results }) => (
                    <Grid container spacing={3} alignItems="stretch">
                      {results.map((res, i) => (
                        <ResultGridCard result={res} key={res.id} />
                      ))}
                    </Grid>
                  )}
                </WithSearch>
              )}
            </Grid>
            <Grid m={2} size={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ResultsPerPage
                  view={ResultsPerPageView}
                  options={[10, 20, 50, 100]} // Limiting to 100 because table view only allows 100
                />
                <Paging view={PagingView} />
              </Box>
            </Grid>
          </Grid>
        </Wrapper>
      </SearchProvider>
    );
  },
);

SearchContainer.displayName = "SearchContainer";

export default SearchContainer;
