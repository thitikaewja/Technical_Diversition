import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const lotteryData = [
  { id: 1, prize: "รางวัลที่ 1" },
  { id: 2, prize: "รางวัลที่เลขข้างเคียงรางวัลที่ 1" },
  { id: 3, prize: "รางวัลที่ 2" },
  { id: 4, prize: "รางวัลเลขท้าย 2 ตัว" },
];

interface RANDOM {
  prize1: number;
  prize11: number;
  prize12: number;
  prize2: number[];
  last2Digits: number;
}

function App() {
  const [randomResult, setRandomResult] = useState<RANDOM>();
  const [inputResult, setInputResult] = useState<number>();
  const [lotteryMessage, setLotteryMessage] = useState<string>("");

  const Random_Number = (): RANDOM => {
    const prize1 = Math.floor(Math.random() * 900) + 100;
    const prize11 = prize1 + 1;
    const prize12 = prize1 - 1;
    const prize2 = Array.from(
      { length: 3 },
      () => Math.floor(Math.random() * 900) + 100
    );
    const last2Digits = Math.floor(Math.random() * 100);
    return {
      prize1,
      prize11,
      prize12,
      prize2,
      last2Digits,
    };
  };

  const handleClick = () => {
    const result = Random_Number();
    setRandomResult(result);
    localStorage.setItem("randomResult", JSON.stringify(result));
  };

  const onChange = (value: string) => {
    const number = parseInt(value, 10);
    if (!isNaN(number)) {
      setInputResult(number);
    }
  };

  const checkNumber = () => {
    if (randomResult && inputResult !== undefined) {
      const isPrize1 = randomResult.prize1 === inputResult;
      const isPrize11 = randomResult.prize11 === inputResult;
      const isPrize12 = randomResult.prize12 === inputResult;
      const isPrize2 = randomResult.prize2.includes(inputResult);
      const inputLast2Digits = inputResult % 100;
      const isLast2Digits = randomResult.last2Digits === inputLast2Digits;

      let message = "";

      if (isPrize1) {
        message = "ถูกรางวัลที่ 1";
      }
      if (isPrize11 || isPrize12) {
        message += message
          ? " และถูกรางวัลข้างเคียงที่ 1"
          : "ถูกรางวัลข้างเคียงที่ 1";
      }
      if (isPrize2) {
        message += message ? " และถูกรางวัลที่ 2" : "ถูกรางวัลที่ 2";
      }
      if (isLast2Digits) {
        message += message
          ? " และรางวัลเลขท้าย 2 ตัว"
          : "ถูกรางวัลเลขท้าย 2 ตัว";
      }

      if (!message) {
        message = "ไม่ถูกรางวัลใด";
      }

      setLotteryMessage(message);
    }
  };

  useEffect(() => {
    const storedResult = localStorage.getItem("randomResult");
    if (storedResult) {
      setRandomResult(JSON.parse(storedResult));
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", padding: 2 }}>
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TableContainer component={Paper}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  padding: 2,
                  textAlign: "center",
                  backgroundColor: "#002984",
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                ผลการออกรางวัลล็อตเตอรี่ Diversition
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">รางวัล</TableCell>
                    <TableCell align="center">หมายเลข</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lotteryData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.prize}</TableCell>
                      <TableCell align="center">
                        {randomResult &&
                          (row.id === 1
                            ? randomResult.prize1
                            : row.id === 2
                            ? `${randomResult.prize11}, ${randomResult.prize12}`
                            : row.id === 3
                            ? randomResult.prize2.join(", ")
                            : row.id === 4
                            ? String(randomResult.last2Digits).padStart(2, "0")
                            : "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3 }}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              สุ่มรางวัล
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <input
              maxLength={3}
              onChange={(e) => onChange(e.target.value)}
              placeholder="กรอกหมายเลข"
            />
            <Button onClick={checkNumber} sx={{ marginLeft: 2 }}>
              ตรวจหมายเลข
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            {lotteryMessage && (
              <Typography variant="h6" color="primary">
                {lotteryMessage}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
