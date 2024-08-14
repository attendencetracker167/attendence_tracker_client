import { Link } from "react-router-dom"
const Welcome = () => {
  return (
    <div className="typewriter w-full h-screen flex items-center justify-center flex-col gap-y-4">
      <h1 className="text-2xl xs:max-sm:text-lg">Hey,Welcome to Help Desk !,Lets work Together</h1>
      <Link to='/login' className="bg-indigo-600 text-white p-1 px-2 rounded-sm ">Signin Start!</Link>
    </div>
  )
}

export default Welcome