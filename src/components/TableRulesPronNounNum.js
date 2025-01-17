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

export default function TableRulesPronNounNum() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Number\Person</StyledTableCell>
            <StyledTableCell align="center">I</StyledTableCell>
            <StyledTableCell align="center">II</StyledTableCell>
            <StyledTableCell align="center">III</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Singular </StyledTableCell>
              <StyledTableCell align="center"> I -&gt; am </StyledTableCell>
              <StyledTableCell align="center"> you -&gt; are&nbsp; </StyledTableCell>
              <StyledTableCell align="center"> 
                  <p><span>he,she,it -&gt; is</span></p>
		  <p><span>John,Sara -&gt; is</span></p> 
	      </StyledTableCell>
            </StyledTableRow> 
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Plural </StyledTableCell>
              <StyledTableCell align="center"> &nbsp;we -&gt; are&nbsp; </StyledTableCell>
              <StyledTableCell align="center"> you -&gt; are </StyledTableCell>
              <StyledTableCell align="center"> they -&gt; are </StyledTableCell>
            </StyledTableRow>         
        </TableBody>
      </Table>
    </TableContainer>
  );
}
