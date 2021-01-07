import '@nateradebaugh/react-datetime/css/react-datetime.css';
import * as Sentry from '@sentry/browser';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'erxes-icon/css/erxes.min.css';
import { OwnerDescription } from 'modules/auth/components/OwnerSetup';
import OwnerSetup from 'modules/auth/containers/OwnerSetup';
// global style
import 'modules/common/styles/global-styles.ts';
import { getEnv } from 'modules/common/utils';
import AuthLayout from 'modules/layout/components/AuthLayout';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import apolloClient from './apolloClient';
import Routes from './routes';

Sentry.init({
  dsn:
    'https://ee258b631459426f976a22261da3bfdc@o427075.ingest.sentry.io/5580254',

  tracesSampleRate: 1.0
});

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc, { parseLocal: true });

const target = document.querySelector('#root');

const envs = getEnv();

if (envs.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: envs.REACT_APP_SENTRY_DSN
  });
}

fetch(`${envs.REACT_APP_API_URL}/initial-setup?envs=${JSON.stringify(envs)}`, {
  credentials: 'include'
})
  .then(response => response.text())
  .then(res => {
    let body = <Routes />;

    if (res === 'no owner') {
      body = (
        <AuthLayout
          col={{ first: 5, second: 6 }}
          content={<OwnerSetup />}
          description={<OwnerDescription />}
        />
      );
    }

    return render(
      <ApolloProvider client={apolloClient}>{body}</ApolloProvider>,
      target
    );
  });
