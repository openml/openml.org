import { useDispatch } from "react-redux";

// Use throughout your app instead of plain `useDispatch`
const useAppDispatch = () => useDispatch();

export default useAppDispatch;
