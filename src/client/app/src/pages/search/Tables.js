import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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

const TablePaper = styled(Paper)`
  height: calc(100vh - 115px);
  background-color: #fff;
`;
const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${props => props.theme.spacing(12)}px);
  cursor: pointer;
`;

let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

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

const rows = [
  {
    id: "name",
    numeric: false,
    label: "Dataset name"
  },
  { id: "feat1", numeric: true, label: "Feature 1" },
  { id: "feat2", numeric: true, label: "Feature 2" },
  { id: "feat3", numeric: true, label: "Feature 3" },
  { id: "feat4", numeric: true, label: "Feature 4" }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      order,
      orderBy,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding="none"
                sortDirection={orderBy === row.id ? order : false}
                style={{height:49, paddingLeft:(row.id === 'name' ? 10 : 0),
                        paddingRight:(row.id === 'feat4' ? 10 : 0)}}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
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

export class DatasetTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "calories",
    selected: [],
    data: [
      createData("Dataset 1", 305, 3.7, 67, 4.3),
      createData("Dataset 2", 452, 25.0, 51, 4.9),
      createData("Dataset 3", 262, 16.0, 24, 6.0),
      createData("Dataset 4", 159, 6.0, 24, 4.0),
      createData("Dataset 5", 356, 16.0, 49, 3.9),
      createData("Dataset 6", 408, 3.2, 87, 6.5),
      createData("Dataset 7", 237, 9.0, 37, 4.3),
      createData("Dataset 8", 375, 0.0, 94, 0.0),
      createData("Dataset 9", 518, 26.0, 65, 7.0),
      createData("Dataset 10", 392, 0.2, 98, 0.0),
      createData("Dataset 11", 318, 0, 81, 2.0),
      createData("Dataset 12", 360, 19.0, 9, 37.0),
      createData("Dataset 13", 437, 18.0, 63, 4.0)
    ],
    page: 0,
    rowsPerPage: 10
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
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
        <TablePaper>
          <TableWrapper>
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.props.table_select(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                      >
                        <TableCell component="th" scope="row" padding="none" style={{paddingLeft:10}}>
                          {n.name}
                        </TableCell>
                        <TableCell align="right">{n.calories}</TableCell>
                        <TableCell align="right">{n.fat}</TableCell>
                        <TableCell align="right">{n.carbs}</TableCell>
                        <TableCell align="right">{n.protein}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableWrapper>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
            component="div"
            count={data.length}
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
