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


export default function TableRulesPassAct() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tense</StyledTableCell>
            <StyledTableCell align="right">Passive voice</StyledTableCell>
            <StyledTableCell align="right">Active voice</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Simple Present Tense </StyledTableCell>
              <StyledTableCell align="right"> S + to be + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + infinitive + object </StyledTableCell>
            </StyledTableRow> 
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Present Continuous Tense </StyledTableCell>
              <StyledTableCell align="right"> S + to be (is, am, are) + being + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + to be (is, am, are) being + present participle + object </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Present Perfect Tense </StyledTableCell>
              <StyledTableCell align="right"> S + have/has been + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + has/have + past participle + object </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Simple Past Tense </StyledTableCell>
              <StyledTableCell align="right"> S + was/were + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + past participle + object </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Past Continuous Tense </StyledTableCell>
              <StyledTableCell align="right"> S + was/were + being + past participle +by object </StyledTableCell>
              <StyledTableCell align="right"> S + was/were + being + past participle + object </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Past Perfect Tense </StyledTableCell>
              <StyledTableCell align="right"> S + had been + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + had + past participle + object </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Simple Future Tense </StyledTableCell>
              <StyledTableCell align="right"> S + will + be + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + will + infinitive + object </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"> Future Perfect Tense </StyledTableCell>
              <StyledTableCell align="right"> S + would + be + past participle + by object </StyledTableCell>
              <StyledTableCell align="right"> Subject + would + infinitive + object </StyledTableCell>
            </StyledTableRow>           
        </TableBody>
      </Table>
    </TableContainer>
  );
}
