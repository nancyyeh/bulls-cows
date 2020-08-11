import React from "react";
import "./App.css";
import HowToPlay from "./HowToPlay";
import AlertDialog from "./AlertDialog";
import { Button, Typography, Grid, TextField, Box } from "@material-ui/core/";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core/";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core/";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteIcon from "@material-ui/icons/Delete";
import Confetti from "react-dom-confetti";
const useState = React.useState;
const useEffect = React.useEffect;

//LocalState
const useLocalState = (localStorageKey) => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey) || ""
  );

  useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

function App() {
  const [answer, setAnswer] = useState(null);
  const [guess, setGuess] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [attemptHistory, setHistory] = useState({});
  const [seconds, setSec] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fastest, setFastest] = useLocalState("fastest");
  const [least, setLeast] = useLocalState("least");
  const [alertMessage, setAlertMessage] = useState(null);

  //Confetti
  const config = {
    angle: 90,
    spread: 300,
    startVelocity: "80",
    elementCount: "200",
    dragFriction: 0.15,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  // generate a random number to begin
  useEffect(() => {
    generateNumber();
  }, []);

  // timer start when attempt is greater than 0 (started guessing)
  useEffect(() => {
    if (attempt > 0) {
      setIsTimerActive(true);
    }
  }, [attempt]);

  // Action when guesed correctly
  useEffect(() => {
    if (isCorrect === true) {
      // Congrats Message
      setAlertMessage({
        title: "CONGRATSSSSSSS!!!!",
        body: `You got it right with ${attempt} attempts using ${seconds} seconds!`,
        button: "ok",
      });
      // stop timmer and disabled submit button
      setIsTimerActive(false);
      setIsSubmitDisabled(true);
      setIsTextDisabled(true);
      // set Best Score
      if (least === "" && fastest === "") {
        setFastest(seconds);
        setLeast(attempt);
      } else if (attempt <= least && seconds < fastest) {
        setFastest(seconds);
        setLeast(attempt);
      }
    }
  }, [isCorrect]);

  //Timer - updating time
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSec((seconds) => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  //generate a random number for people to guess on
  const generateNumber = () => {
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(numbers);
    const fourNum = numbers.slice(0, 4);
    setAnswer(fourNum.join(""));
    setAttempt(0);
    setHistory({});
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // action when clicked restart game
  const clickedRestart = () => {
    handleClose();
    generateNumber();
    setSec(0);
    setIsTimerActive(false);
    setIsSubmitDisabled(false);
    setIsTextDisabled(false);
    setIsCorrect(false);
  };

  //helpper function
  const isGuessExist = (guessed, history) => {
    return Object.values(history).some((item) => {
      return item.guess === guessed;
    });
  };
  // action when submit guesses
  const checkMatch = () => {
    if (guess.length !== 4) {
      setAlertMessage({
        title: "Woopsie Daisy!",
        body:
          "It looks like you missed something! Make sure you have entered 4 numbers.",
        button: "ok",
      });
    } else if (isGuessExist(guess, attemptHistory)) {
      setAlertMessage({
        title: "Try something new!",
        body: "You have guessed this number already. Try a number!",
        button: "ok",
      });
    } else {
      let a = 0;
      let b = 0;
      for (var i = 0; i < guess.length; i++) {
        let number = guess[i];
        if (answer.includes(number)) {
          if (guess[i] === answer[i]) {
            a += 1;
          } else {
            b += 1;
          }
        }
      }
      if (a === 4) {
        setIsCorrect(true);
      }
      const newAttempt = attempt + 1;
      const AsBs = a + "A" + b + "B";
      setAttempt(newAttempt);
      setHistory({
        ...attemptHistory,
        [newAttempt]: {
          attemptNumber: newAttempt,
          guess: guess,
          AsBs: AsBs,
        },
      });
      setGuess("");
    }
  };

  //past attempts to be insert into Table
  const pastAttempts = Object.entries(attemptHistory).map(([key, value]) => {
    return (
      <TableRow key={key}>
        <TableCell align="center">{value.attemptNumber}</TableCell>
        <TableCell align="center">{value.guess}</TableCell>
        <TableCell align="center">{value.AsBs}</TableCell>
      </TableRow>
    );
  });

  const regexp = /^[0-9\b]+$/;
  const [guessError, setGuessError] = useState(false);
  const [guessHelper, setGuessHelper] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isTextDisabled, setIsTextDisabled] = useState(false);

  // Handle guess changed
  const handleGuessChange = (event) => {
    let guessInput = event.target.value;
    if (guessInput === "" || regexp.test(guessInput)) {
      setGuess(event.target.value);
    }

    // return T or F on if there is repeated num
    const isRepeated = (nums) => {
      return new Set(nums).size !== nums.length;
    };
    if (isRepeated(guessInput)) {
      setGuessError(true);
      setGuessHelper("Error: duplicated numbers");
      setIsSubmitDisabled(true);
    } else {
      setGuessError(false);
      setIsSubmitDisabled(false);
      setGuessHelper("");
    }
  };
  // clear best score
  const clearBestScore = () => {
    setLeast("");
    setFastest("");
  };

  return (
    <Box
      className="App"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={2}
    >
      <Box className="game-title" p={2}>
        <img src="bullsandcows.png" alt="bull_and_cows" width="70%" />
        <HowToPlay />
        <Typography color="textSecondary" gutterBottom>
          An old code-breaking challegne - it is proven that any number could be
          solved within seven turns. Can you beat it in seven turns?
        </Typography>
      </Box>

      <Box className="input-details" p={2}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"You sure you want to start a new game?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={clickedRestart} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <TextField
            error={guessError}
            id="guess"
            label="Guess"
            onChange={handleGuessChange}
            value={guess}
            helperText={guessHelper}
            inputProps={{ maxLength: 4 }}
            disabled={isTextDisabled}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={checkMatch}
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
          <Button variant="contained" onClick={handleClickOpen}>
            <RefreshIcon />
          </Button>
        </div>
      </Box>

      <Box className="history-details" p={2}>
        <Typography variant="h2">History</Typography>
        {least && (
          <Typography variant="h4">
            Best Score: {least} attemps in {fastest} seconds
            <Button size="small" onClick={clearBestScore}>
              <DeleteIcon />
            </Button>
          </Typography>
        )}

        <Typography variant="h5">
          <Grid container>
            <Grid item xs={6}>
              Attempt(s): {attempt}
            </Grid>
            <Grid item xs={6}>
              Timer: {seconds} second(s)
            </Grid>
          </Grid>
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mx="auto"
          m={1}
          px={4}
        >
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Attempt</TableCell>
                  <TableCell align="center">Guess</TableCell>
                  <TableCell align="center">Clue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{pastAttempts}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <AlertDialog
        alertTitle={alertMessage?.title}
        alertDetails={alertMessage?.body}
        buttonTitle={alertMessage?.button}
        isOpen={alertMessage !== null}
        onClose={() => {
          setAlertMessage(null);
        }}
      />
      <Confetti active={isCorrect} config={config} />
    </Box>
  );
}

export default App;
