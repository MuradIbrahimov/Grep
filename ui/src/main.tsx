import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Routing from './routes/root.routes'
import withProviders from './app/providers'

import './styles/index.css'

const Root = withProviders(() => <Routing/>)

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
