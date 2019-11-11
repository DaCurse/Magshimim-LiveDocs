import React from 'react';
import ReactDOM from 'react-dom';
import RichDocument from '../components/RichDocument';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RichDocument />, div);
  ReactDOM.unmountComponentAtNode(div);
});
