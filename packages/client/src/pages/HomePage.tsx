import { useEffect } from "react";
import logo from "../assets/logo.png";
import { useBreadCrumbs } from "../zustands/breadcrumb";

export default function HomePage() {
  const { setExtra } = useBreadCrumbs();

  useEffect(() => {
    setExtra(["home"])
  }, [])
  
  return (
    <div className='login-page'>
    <div className='logo-wrapper'>
    <img src={logo} className='logo' />
    </div>
    </div>

  )
}
