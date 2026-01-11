import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { AuthProvider } from '../../context/AuthContext';

describe('ProfilePage', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </Router>
    );
    // If the component renders without throwing an error, the test passes.
  });
});
