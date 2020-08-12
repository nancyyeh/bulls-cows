import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import {
  Button,
  Popover,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function HowToPlay() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        size="small"
        onClick={handleClick}
        startIcon={<InfoIcon />}
      >
        How To Play
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box m={2}>
          <Box textAlign="center">
            <Typography variant="h4">How To Play</Typography>
          </Box>
          <div>
            The computer will automatically generate 4 random numbers that does
            not repeat. You will need to guess the number based on the clues
            given.
            <ul>
              <li>
                If you guess the{" "}
                <strong>correct number(s) in the correct position</strong>, the
                computer will provide you number of correct numbers with the
                clue "A".
              </li>{" "}
              <li>
                If you guess the{" "}
                <strong>correct number(s) but in the wrong position</strong>,
                the computer will provide you with the clue "B".
              </li>
            </ul>
            Example:
            <ul>
              <li>Computer generate number: 9527</li>
              <li>Your guess: 7593</li>
              <li>
                Clue: 1A2B
                <br />
                [1A: 5 is in the correct position; 2B: 7 and 9 are both correct
                numbers in the wrong position]
              </li>
            </ul>
            <small>Made with ♥ by Nancy </small>
            <a href="https://github.com/nancyyeh" target="_blank">
              <img src="github.svg" width="18" height="18" title="github" />
            </a>
          </div>
        </Box>
      </Popover>
    </>
  );
}

export default HowToPlay;
