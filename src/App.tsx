import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import Home from '@/pages/home';
import '@/index.css'

const paths = [
  {
    path: '/',
    element: (
      <Home/>
    ),
  },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
      <RouterProvider router = {BrowserRouter}/>
  );
}

export default App;