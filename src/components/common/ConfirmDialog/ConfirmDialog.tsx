import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import React from 'react'

export function ConfirmDialog(
    props: React.PropsWithChildren<{
        title: string
        confirmLabel: string
        disabled?: boolean
        open?: boolean
        onClose?: () => void
        onConfirm: () => void
    }>,
) {
    return (
        <Dialog open={props.open || false} onClose={props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>{props.children}</DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Annuler</Button>
                <Button
                    color="primary"
                    onClick={() => {
                        props.onConfirm()
                        props.onClose && props.onClose()
                    }}
                    disabled={props.disabled}
                >
                    {props.confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
