import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog({
  alertTitle,
  alertDetails,
  buttonTitle,
  isOpen,
  onClose,
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {buttonTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
