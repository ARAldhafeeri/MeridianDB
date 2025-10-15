
import LoginForm from '../forms/LoginForm'
import logo from "../assets/logo.png";
export default function LoginPage() {
  console.log("login page")
  return (
    <div className='login-page'>
      <div className='logo-wrapper'>
      <img src={logo} className='logo' />
      </div>
      <LoginForm />
    </div>
  )
}
