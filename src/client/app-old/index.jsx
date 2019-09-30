import React from 'react';
import {render} from 'react-dom';
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'
import {AuthProvider,SearchContext,searches} from './context.jsx';

import OpenMLApp from './openml.jsx';

// Create root component instances
render(
      <OpenMLApp/>,
  document.getElementById('app'));
