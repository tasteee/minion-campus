import { mount } from 'svelte'
import App from './App.svelte'
import './styles/tokens.css'
import './styles/global.css'

const appElement = document.getElementById('app')

if (!appElement) throw new Error('Missing #app element')

const app = mount(App, { target: appElement })

export default app
