import React, { memo } from "react";
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
  Chip,
  Tabs,
  Card,
} from "@mui/material";

import { TabContext, TabPanel } from "@mui/lab";

import ResultCard from "./ResultCard";
import styled from "@emotion/styled";

import {
  Facet,
  SearchProvider,
  Results,
  ResultsPerPage,
  Paging,
  PagingInfo,
  Sorting,
  WithSearch,
} from "@elastic/react-search-ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faList,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../Wrapper";
import { i18n } from "next-i18next";
import ResultsTable from "./ResultTable";

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

const SortView = ({ label, options, value, onChange }) => {
  if (value === "|||") {
    value = "[]";
  }
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          {i18n.t("search.sort_by")}
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
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
};

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

const PagingView = ({ current, resultsPerPage, totalPages, onChange }) => (
  <Pagination
    count={totalPages}
    color="primary"
    page={current}
    onChange={(event, value) => onChange(value)}
  />
);

// Allows overriding the filter option text
const facet_aliases = {
  Status: {
    active: "verified",
    in_preparation: "in preparation",
    deactivated: "deprecated",
  },
};

const FilterChip = styled(Chip)`
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 50px;
`;

const FilterPanel = styled.div``;

const Filter = ({ label, options, values, onRemove, onSelect }) => {
  return (
    <FilterPanel>
      {options.map((option) => (
        <FilterChip
          label={
            (label in facet_aliases && option.value in facet_aliases[label]
              ? facet_aliases[label][option.value]
              : i18n.t(`filters.${option.value}`)) +
            "  (" +
            option.count +
            ")"
          }
          key={option.value}
          clickable
          onClick={() =>
            option.selected ? onRemove(option.value) : onSelect(option.value)
          }
          color={option.selected ? "primary" : "default"}
          variant={option.selected ? "default" : "outlined"}
        />
      ))}
    </FilterPanel>
  );
};

// This is the Search UI component. The config contains the search state and actions.
const SearchContainer = memo(
  ({
    config,
    sort_options,
    search_facets,
    columnOrder,
    facet_aliases,
    title,
    type,
  }) => {
    const [filter, setFilter] = React.useState("hide");
    const handleFilterChange = (event, newFilter) => {
      console.log("newFilter", newFilter);
      if (newFilter === filter) {
        setFilter(false);
      } else {
        setFilter(newFilter + "");
      }
    };

    const [view, setView] = React.useState("list");
    const handleViewChange = (event, newView) => {
      if (newView !== null) {
        setView(newView);
      }
    };

    //Translate here because we're using the default Sorting conponent
    const translated_sort_options = sort_options.map((option) => ({
      ...option,
      name: i18n.t(option.name),
    }));

    console.log("Filter:", filter);
    return (
      <SearchProvider config={config}>
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
                />
              </FilterTabPanel>
            ))}
          </FilterBox>
        </TabContext>

        <Wrapper fullWidth>
          <Grid container spacing={3}>
            <Grid item xs={12} m={2}>
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
                  <Sorting
                    label="Sort by"
                    sortOptions={translated_sort_options}
                    view={SortView}
                  />
                  <ViewToggle onChange={handleViewChange} view={view} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
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
                    <ResultsTable results={results} columnOrder={columnOrder} />
                  )}
                </WithSearch>
              )}
            </Grid>
            <Grid item xs={12} m={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ResultsPerPage
                  view={ResultsPerPageView}
                  options={[10, 20, 50, 100, 1000]}
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
