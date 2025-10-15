import './App.css'
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router-dom';
import MainRouter from './routes';
import { ConfigProvider } from 'antd';
import { THEME } from './config/theme';

function App() {

  return (
      <>
        <ConfigProvider theme={THEME}>
          <RouterProvider router={MainRouter} />
        </ConfigProvider>
      </>
   )
}


export default App