import { Chip, Stack, Box } from '@mui/material'
import SideBar from './components/SideBar'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { v4 as uuid } from 'uuid'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

function App() {
  const [triggerListState, setTriggerListState] = useState([])
  const [capturedKey, setCapturedKey] = useState(null)
  const [mainKey, setMainKey] = useState(null)
  const [autoKey, setAutoKey] = useState(null)
  const [toggleKey, setToggleKey] = useState(null)
  const [delayTime, setDelayTime] = useState(null)

  useEffect(() => {
    if (mainKey) {
      setTriggerListState((prev) => [...prev, { name: '主要觸發鍵', key: mainKey, id: uuid() }])
      setMainKey(null)
    }
    if (autoKey) {
      setTriggerListState((prev) => [...prev, { name: '自動觸發鍵', key: autoKey, id: uuid() }])
      setAutoKey(null)
    }
    if (toggleKey) {
      setTriggerListState((prev) => [...prev, { name: '開始/暫停鍵', key: toggleKey, id: uuid() }])
      setToggleKey(null)
    }
    if (delayTime) {
      setTriggerListState((prev) => [...prev, { name: '延遲時間', key: delayTime, id: uuid() }])
      setDelayTime(null)
    }
  }, [mainKey, autoKey, toggleKey, delayTime])
  const setKey = async () => {
    const responese = await window.api.setKey()
    console.log(responese)
  }

  const getKey = async () => {
    console.log('get key')
    const responese = await window.api.getKey()
    return responese
  }

  const pollKey = async (getKey, setCapturedKey) => {
    console.log('poll key')
    const responese = await getKey()
    if (responese.key) {
      setCapturedKey(responese.key)
    } else {
      setTimeout(() => pollKey(getKey, setCapturedKey), 10) // 使用箭头函数传递参数
    }
  }

  const handleClick = () => {
    console.info('You clicked the Chip.')
  }

  const handleDelete = (id) => {
    setTriggerListState((prev) => prev.filter((trigger) => trigger.id !== id))
    console.info('You clicked the delete icon.')
  }

  return (
    <Stack
      direction={'row'}
      sx={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <Stack sx={{ width: '60%', px: '8%', paddingY: 2, overflowY: 'auto' }}>
        {triggerListState.map((trigger, index) => (
          <Stack key={trigger.id}>
            <Chip
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    {trigger.name +
                      ': ' +
                      (trigger.key || 'N/A') +
                      (trigger.name === '延遲時間' ? '秒' : '')}
                  </span>
                </Box>
              }
              deleteIcon={<DeleteIcon sx={{ marginLeft: 'auto' }} />} // Ensure the delete icon moves to the end
              variant="outlined"
              onClick={handleClick}
              onDelete={() => handleDelete(trigger.id)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                paddingRight: '10px' // Optional, to ensure enough space for the delete icon
              }}
              color="primary"
            />

            {triggerListState.length > 1 && index < triggerListState.length - 1 && (
              <KeyboardArrowDownIcon color="action" fontSize="large" sx={{ margin: 'auto' }} />
            )}
          </Stack>
        ))}
      </Stack>
      <SideBar
        setKey={setKey}
        getKey={getKey}
        setCapturedKey={setCapturedKey}
        capturedKey={capturedKey}
        pollKey={pollKey}
        setMainKey={setMainKey}
        mainKey={mainKey}
        setAutoKey={setAutoKey}
        autoKey={autoKey}
        setToggleKey={setToggleKey}
        toggleKey={toggleKey}
        setDelayTime={setDelayTime}
        delayTime={delayTime}
      />
    </Stack>
  )
}

export default App
