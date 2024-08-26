import App from './App';
// import './base.scss';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import './tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Carousel, initTE } from 'tw-elements';
import { PostHogProvider } from 'posthog-js/react';
import { isProduction } from './util';

const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST
};

initTE({ Carousel });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {isProduction ? (
      <PostHogProvider
        apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
