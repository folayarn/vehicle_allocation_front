
import { useSelector } from 'react-redux'
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'

const MessageAlert = () => {
        const {isError, success, } = useSelector(state => state.PostSlice)
  return (
    <>
    {isError && (<>
    <ErrorAlert/>
    </>)}

    {success && (<>
    <SuccessAlert/>
    </>)}
    </>
  )
}

export default MessageAlert