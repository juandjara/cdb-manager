import React, { Suspense, lazy } from 'react'
import styled from 'styled-components'
import Aside from '@/components/aside/Aside'
import { Router } from '@reach/router'
import Spinner from '@/components/common/Spinner'
import { Redirect } from '@reach/router'

function Loader() {
  return (
    <div className="p-3">
      <Spinner />
    </div>
  )
}

const FunctionDetails = lazy(() => import('@/views/FunctionDetails'))
const SequenceDetails = lazy(() => import('@/views/SequenceDetails'))
const SQLConsole = lazy(() => import('@/views/SQLConsole'))
const TableDetails = lazy(() => import('@/views/TableDetails'))

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
    min-width: 0;
  }
  > footer {
    grid-area: footer;
  }
`

function GridLayout({ path, route: Route }) {
  return (
    <Grid>
      <header className="border-b border-gray-200 py-4 px-6">
        <h1 className="text-2xl font-medium">CDB Manager</h1>
      </header>
      <Aside />
      <main>
        <Suspense fallback={<Loader />}>
          <Route path={path} />
        </Suspense>
      </main>
      <footer className="text-sm py-4 px-4 border-t border-gray-200 bg-gray-50">
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
    <Suspense fallback={<Loader />}>
      <Router>
        <GridLayout path="/" route={() => <Redirect to="/console" />} />
        <GridLayout path="/console" route={SQLConsole} />
        <GridLayout path="/fn/:fnName" route={FunctionDetails} />
        <GridLayout path="/seq/:seqName" route={SequenceDetails} />
        <GridLayout path="/table/:tablename/:tableid" route={TableDetails} />
      </Router>
    </Suspense>
  )
}
