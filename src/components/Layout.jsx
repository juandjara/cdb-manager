import React from 'react'
import styled from 'styled-components'
import Aside from '@/components/aside/Aside'
import { Router } from '@reach/router'
import FunctionDetails from '@/views/FunctionDetails'

const Grid = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    'header'
    'aside'
    'main'
    'footer';

  @media (min-width: 720px) {
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'header header'
      'aside main'
      'footer footer';
  }

  > header {
    grid-area: header;
  }
  > aside {
    grid-area: aside;
  }
  > main {
    grid-area: main;
  }
  > footer {
    grid-area: footer;
  }
`

function Hello() {
  return (
    <div className="p-4 my-8 text-center">
      <span role="img" aria-label="Hello!" title="Hello!" className="text-4xl">
        👋
      </span>
    </div>
  )
}

function GridLayout({ path, route: Route }) {
  return (
    <Grid>
      <header className="border-b border-gray-200 py-4 px-6">
        <h1 className="text-2xl font-medium">CDB Manager</h1>
      </header>
      <Aside />
      <main>{<Route path={path} />}</main>
      <footer className="text-sm py-4 px-4 border-t border-gray-200 bg-gray-50 z-20">
        <span>Caught any bug? Want to improve the website? </span>
        <a
          rel="noopener noreferrer"
          href="https://github.com/juandjara/cdb-manager"
          className="font-semibold hover:underline"
        >
          Collaborate on Github
        </a>
      </footer>
    </Grid>
  )
}

export default function Layout() {
  return (
    <Router>
      <GridLayout path="/" route={Hello} />
      <GridLayout path="/functions/:fnName" route={FunctionDetails} />
    </Router>
  )
}
