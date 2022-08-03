import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { DialogContentText, Stack, Typography } from '@mui/material';

export default function UploadDialog({ title, handleClose, handleSubmit, isOpen, isLoading, onFilesChange }: any) {
    const [fileList, setFileList] = React.useState<File[]>([]);

    React.useEffect(() => {
        if (!isOpen) {
            setFileList([]);
        }
    }, [isOpen])

    function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.currentTarget?.files;
        const fileListArr = [];
        if (files != null) {
            if (files.length > 20) {
                alert("The maximum number of files is 20")
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (file) {
                    fileListArr.push(file);
                }
            }
        }
        setFileList(fileListArr);
        onFilesChange(fileListArr);
    }

    return (
        <div>
            <Dialog disableEnforceFocus disableEscapeKeyDown open={isOpen} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Max 20 files per time.
                    </DialogContentText>
                    <Stack direction="column" spacing={2}>
                        <Button style={{ width: '100%' }} variant="contained" component="label" disabled={isLoading}>
                            Select Files
                            <input onChange={handleFilesChange} hidden accept=".csv" multiple type="file" />
                        </Button>
                        {
                            fileList.map((file: File) => (
                                <Typography key={file.name}>{file.name}</Typography>
                            ))
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
                    <LoadingButton loading={isLoading} onClick={handleSubmit} autoFocus>
                        Upload
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div >
    );
}
