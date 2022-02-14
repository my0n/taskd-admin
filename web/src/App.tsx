import { Button } from 'react-bulma-components';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AsyncBoundary } from './components/AsyncBoundary';
import { OrgList } from './components/OrgList';
import { createOrg } from './endpoints/createOrg';

const App = () => {
  return (
    <div className="App">
      <ErrorBoundary fallback={<div>Encountered an error</div>}>
        <AsyncBoundary>
          <Button onClick={}>Create new Org</Button>
          <OrgList />
        </AsyncBoundary>
      </ErrorBoundary>
    </div>
  );
}

export default App;
