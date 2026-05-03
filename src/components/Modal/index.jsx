import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
const ModalComponent = ({ title, children, open, size, setOpen }) => {
  return (
    <>
      <Dialog size={size} open={open}>
        <DialogHeader>
          <div className="flex w-full items-center justify-between">
            <Typography variant="h4">{title}</Typography>
            <div>
              <Button variant="text" color="red" onClick={() => setOpen(false)}>
                <span>Close</span>
              </Button>

            </div>
          </div>
        </DialogHeader>
        <DialogBody className="max-h-[80vh] overflow-auto">
          {children}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ModalComponent;
