import { Chip, Stack, Box } from '@mui/material'
import SideBar from './components/SideBar'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { v4 as uuid } from 'uuid'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

function App() {
  const [triggerListState, setTriggerListState] = useState([])
  const [capturedKey, setCapturedKey] = useState(null)
  const [mainKey, setMainKey] = useState(null)
  const [autoKey, setAutoKey] = useState(null)
  const [toggleKey, setToggleKey] = useState(null)
  const [delayTime, setDelayTime] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (mainKey) {
      setTriggerListState((prev) => [
        ...prev,
        { name: '主要觸發鍵', key: mainKey, id: uuid(), type: 'mainKey' }
      ])
      setMainKey(null)
    }
    if (autoKey) {
      setTriggerListState((prev) => [
        ...prev,
        { name: '自動觸發鍵', key: autoKey, id: uuid(), type: 'autoKey' }
      ])
      setAutoKey(null)
    }
    if (toggleKey) {
      setTriggerListState((prev) => [
        ...prev,
        { name: '開始/暫停鍵', key: toggleKey, id: uuid(), type: 'toggleKey' }
      ])
      setToggleKey(null)
    }
    if (delayTime) {
      setTriggerListState((prev) => [
        ...prev,
        { name: '延遲時間', key: delayTime, id: uuid(), type: 'delayTime' }
      ])
      setDelayTime(null)
    }
  }, [mainKey, autoKey, toggleKey, delayTime])
  const setKey = async () => {
    const responese = await window.api.setKey()
    return responese
  }

  const getKey = async () => {
    const responese = await window.api.getKey()
    return responese
  }

  const pollKey = async (getKey, setCapturedKey) => {
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
  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(triggerListState)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setTriggerListState(items)
  }

  //  檢查是否有type mainkey
  const checkMainKey = (key) => {
    let filterKey = key.filter((item) => item.type === 'mainKey')
    if (filterKey.length > 0) {
      return true
    }
  }
  return (
    <Stack
      direction={'row'}
      sx={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <DragDropContext
        onDragEnd={(result) => {
          handleDragEnd(result)
          setIsDragging(false)
        }}
        onDragStart={() => setIsDragging(true)}
      >
        <Droppable droppableId="triggerList">
          {(provided) => (
            <Stack
              sx={{ width: '60%', px: '8%', paddingY: 2, overflowY: 'auto' }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {triggerListState.map((trigger, index) => (
                <Draggable key={trigger.id} draggableId={trigger.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Stack>
                        <Chip
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                              }}
                            >
                              <span>
                                {trigger.name +
                                  ': ' +
                                  (trigger.key || 'N/A') +
                                  (trigger.name === '延遲時間' ? '秒' : '')}
                              </span>
                            </Box>
                          }
                          deleteIcon={<DeleteIcon sx={{ marginLeft: 'auto' }} />}
                          variant="outlined"
                          onClick={handleClick}
                          onDelete={() => handleDelete(trigger.id)}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingRight: '10px'
                          }}
                          color="primary"
                        />
                        {isDragging && <br />}
                        {!isDragging &&
                          triggerListState.length > 1 &&
                          index < triggerListState.length - 1 && (
                            <KeyboardArrowDownIcon
                              color="action"
                              fontSize="large"
                              sx={{ margin: 'auto' }}
                            />
                          )}
                      </Stack>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
      <SideBar
        triggerListState={triggerListState}
        checkMainKey={checkMainKey}
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
