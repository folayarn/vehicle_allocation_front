import { Alert ,Typography} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { closeAlert} from "../../store/slices/PostSlices";
import { useEffect } from "react";

function Icon() {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
const SuccessAlert = () => {
  const {open,message}=useSelector(state=>state.PostSlice)
  const dispatch=useDispatch()
  useEffect(() => {
    setTimeout(() => {
      dispatch(closeAlert())
    }, 4000)
    
  })
  return (
    <><Alert
    open={open}
    color="green"
    className="w-fit z-[9999999] absolute top-5 right-5"
    icon={<Icon />}
    onClose={() => dispatch(closeAlert())}
  >
    <Typography variant="h5" color="white">
      Success
    </Typography>
    <Typography color="white" className="mt-2 font-normal">
      {message}
    </Typography>
  </Alert></>
  )
}

export default SuccessAlert