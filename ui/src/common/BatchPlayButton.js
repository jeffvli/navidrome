import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  useDataProvider,
  useTranslate,
  useUnselectAll,
  useNotify,
} from 'react-admin'
import { useDispatch } from 'react-redux'

const BatchPlayButton = ({ resource, selectedIds, action, label, icon }) => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const dataProvider = useDataProvider()
  const unselectAll = useUnselectAll()
  const notify = useNotify()

  const addToQueue = () => {
    dataProvider
      .getMany(resource, { ids: selectedIds })
      .then((response) => {
        // Add tracks to a map for easy lookup by ID, needed for the next step
        const tracks = response.data.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur }),
          {}
        )
        // Add the tracks to the queue in the selection order
        dispatch(action(tracks, selectedIds))
      })
      .catch(() => {
        notify('ra.page.error', 'warning')
      })
    unselectAll(resource)
  }

  return (
    <Button color="secondary" onClick={addToQueue} label={translate(label)}>
      {icon}
    </Button>
  )
}

BatchPlayButton.propTypes = {
  action: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
}

export default BatchPlayButton
