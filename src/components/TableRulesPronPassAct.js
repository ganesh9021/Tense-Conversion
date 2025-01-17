import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function TableRulesPronPassAct() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Passive voice</StyledTableCell>
            <StyledTableCell align="center">Active voice</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row"> me </StyledTableCell>
              <StyledTableCell align="center"> I </StyledTableCell>
            </StyledTableRow> 
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row"> you </StyledTableCell>
              <StyledTableCell align="center"> you </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row"> us </StyledTableCell>
              <StyledTableCell align="center"> we </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row"> them </StyledTableCell>
              <StyledTableCell align="center"> they </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="center" component="th" scope="row"> it </StyledTableCell>
              <StyledTableCell align="center"> it </StyledTableCell>
            </StyledTableRow>          
        </TableBody>
      </Table>
    </TableContainer>
  );
}
