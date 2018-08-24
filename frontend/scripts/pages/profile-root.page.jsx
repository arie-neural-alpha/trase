import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/profile-root.scss';

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';

import ProfileRoot from 'react-components/profile-root/profile-root.container';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <StrictMode>
      <Provider store={store}>
        <TopNav />
      </Provider>
    </StrictMode>,
    document.getElementById('nav')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <ProfileRoot />
      </Provider>
    </StrictMode>,
    document.getElementById('page-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
};
