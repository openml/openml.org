import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MainContext } from "../../App.js";

import {
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Paper = styled(MuiPaper)(spacing);

const ShortCell = styled(TableCell)`
  padding-left: 10px;
  padding-right: 0px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TablePaper = styled(Paper)`
  width: 100%;
`;
const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${props => props.theme.spacing(12)}px);
  cursor: pointer;
`;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function shortenHeader(s) {
  s = s
    .replace("qualities.", "")
    .replace("NumberOf", "")
    .replace("nr_of_", "");
  s = s
    .replace(".name", "")
    .replace("run_task.", "")
    .replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { rows, order, orderBy } = this.props;
    return (
      <TableHead>
        <TableRow>
          {rows !== undefined &&
            rows.map(
              r => (
                <ShortCell
                  key={r.id}
                  align={r.numeric ? "left" : "left"}
                  padding="none"
                  sortDirection={orderBy === r.id ? order : false}
                  style={{ height: 49, paddingLeft: 10, paddingRight: 0 }}
                >
                  <Tooltip
                    title="Sort"
                    placement={r.numeric ? "bottom-end" : "bottom-start"}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === r.id}
                      direction={order}
                      onClick={this.createSortHandler(r.id)}
                    >
                      {shortenHeader(r.label)}
                    </TableSortLabel>
                  </Tooltip>
                </ShortCell>
              ),
              this
            )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export class DetailTable extends React.Component {
  static contextType = MainContext;
  //const type = props.entity_type;

  isNumber = n => {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  };

  skipColumns = ([k, v]) => {
    if (
      [
        "description",
        "id",
        "comp_name",
        "quality_id",
        "eval_id",
        "measure_id"
      ].includes(k)
    ) {
      return false;
    } else {
      return true;
    }
  };

  buildColumns = row => {
    if (row) {
      return Object.entries(row)
        .filter(this.skipColumns)
        .map(([k, v]) => {
          if (k !== "description") {
            return {
              id: k,
              numeric: this.isNumber(v),
              disablePadding: true,
              label: k
            };
          } else {
            return undefined;
          }
        });
    }
  };

  buildRows = rows => {
    if (rows) {
      return rows.map((row, index) => {
        row.id = index;
        return row;
      });
    }
  };

  state = {
    order: "asc",
    orderBy: this.props.entity_type + "_id",
    selected: [],
    page: 0,
    rowsPerPage: 100
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    if (event.target.value !== 0) {
      this.setState({ rowsPerPage: event.target.value });
    }
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    let rows = [];
    let data = [];
    if (this.context.results.length > 0) {
      rows = this.buildColumns(this.context.results[0]);
      data = this.buildRows(this.context.results);
    } else {
      rows = [];
      data = [];
    }

    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const nr_rows = Math.min(rowsPerPage, this.context.counts);
    const emptyRows = nr_rows - Math.min(nr_rows, data.length - page * nr_rows);

    return (
      <TablePaper>
        <TableWrapper>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              rows={rows}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  var cells = [];
                  rows.forEach(row => {
                    cells.push(
                      <ShortCell align="left" key={row.id}>
                        {isNaN(n[row.id]) ? "" + n[row.id] : n[row.id]}
                      </ShortCell>
                    );
                  });
                  return (
                    <TableRow
                      hover
                      onClick={event =>
                        this.props.table_select(
                          event,
                          data[n.id][this.context.type + "_id"]
                        )
                      }
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      {cells}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <ShortCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={this.context.counts}
          style={
            this.context.counts ? { display: "block" } : { display: "none" }
          }
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </TablePaper>
    );
  }
}
