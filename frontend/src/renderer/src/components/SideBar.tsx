import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material'
import React, { useState } from 'react'

const SideBar = ({
  getKey,
  setKey,
  pollKey,
  capturedKey,
  setCapturedKey,
  setMainKey,
  mainKey,
  setAutoKey,
  autoKey,
  setToggleKey,
  toggleKey,
  setDelayTime,
  delayTime
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [buttonName, setButtonName] = useState('')
  const [buttonType, setButtonType] = useState('')
  const [inputDeleyTime, setInputDelayTime] = useState('')

  const buttonList = [
    { name: '設定主要觸發鍵', type: 'mainKey' },
    { name: '設定自動觸發鍵', type: 'autoKey' },
    { name: '設定開始/暫停觸發鍵', type: 'toggleKey' },
    { name: '設定延遲時間', type: 'delayTime' }
  ]

  const handleOpen = async (buttonName: string, buttonType: string) => {
    setCapturedKey(null)
    console.log('dialog open')
    setDialogOpen(true)
    setButtonName(buttonName)
    setButtonType(buttonType)
    if (buttonType !== 'delayTime') {
      await setKey()
      await pollKey(getKey, setCapturedKey)
    }
  }

  const handleClose = (_: any, reason: string) => {
    if (reason === 'backdropClick') return
    setDialogOpen(false)
    setButtonName('')
    setButtonType('')
    setCapturedKey(null)
  }
  const handleDialogButtonClose = () => {
    setDialogOpen(false)
    setButtonName('')
    setButtonType('')
    setCapturedKey(null)
  }
  const handleConfirem = (buttonType) => {
    if (buttonType === 'mainKey') {
      setMainKey(capturedKey)
    } else if (buttonType === 'autoKey') {
      setAutoKey(capturedKey)
    } else if (buttonType === 'toggleKey') {
      setToggleKey(capturedKey)
    } else if (buttonType === 'delayTime') {
      setDelayTime(delayTime)
    }

    if (buttonType === 'delayTime') {
      setDelayTime(inputDeleyTime)
    }
    setDialogOpen(false)
    setButtonName('')
    setButtonType('')
    setCapturedKey(null)
    setInputDelayTime('')
  }

  return (
    <Stack
      direction={'column'}
      spacing={2}
      padding={2}
      sx={{
        backgroundColor: '#F2F1EF',
        width: '40%'
      }}
    >
      {buttonList.map((button, index) => (
        <Button
          onClick={() => handleOpen(button.name, button.type)}
          key={index}
          variant="contained"
        >
          {button.name}
        </Button>
      ))}

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth={true}>
        <DialogTitle>{buttonName}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {capturedKey !== null && buttonType !== 'delayTime' && <span>已設為{capturedKey}</span>}
            {capturedKey == null && buttonType !== 'delayTime' && (
              <span>請按下您想要設定的按鍵</span>
            )}
            {buttonType === 'delayTime' && (
              <TextField
                onChange={(e) => setInputDelayTime(e.target.value)}
                type="number"
                slotProps={{
                  htmlInput: { step: 0.5, min: 0 },
                  input: {
                    endAdornment: <InputAdornment position="end">秒</InputAdornment>
                  }
                }}
              />
            )}
            <Button
              variant="contained"
              disabled={!capturedKey}
              onClick={() => handleOpen(buttonName, buttonType)}
            >
              重設
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttonType !== 'delayTime' && (
            <Button onClick={() => handleConfirem(buttonType)} disabled={!capturedKey}>
              確定
            </Button>
          )}
          {buttonType === 'delayTime' && (
            <Button onClick={() => handleConfirem(buttonType)} disabled={!inputDeleyTime}>
              確定
            </Button>
          )}
          <Button onClick={handleDialogButtonClose}>取消</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SideBar
