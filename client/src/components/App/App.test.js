import React from 'react';
import { render} from '@testing-library/react';
import NavBar from '../NavBar/NavBar.js';
import Landing from '../Landing/Landing.js';
import About from '../About';
import SignIn from '../Signin';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';

test('NavBar loads', () => {
      const { getByText } = render(
        <BrowserRouter>
          <NavBar/>
        </BrowserRouter>
      );
      const linkElement = getByText("Quiz");
      expect(linkElement).toBeInTheDocument();
    });

  test('Landing page loads', () => {
        const { getByText } = render(
          <BrowserRouter>
            <Landing/>
          </BrowserRouter>
        );
        const linkElement = getByText("Life's already full of surprises...");
        expect(linkElement).toBeInTheDocument();
      });

    test('About page loads', () => {
          const { getByText } = render(
            <BrowserRouter>
              <About/>
            </BrowserRouter>
          );
          const linkElement = getByText("~Serendipity doo da dipity day~");
          expect(linkElement).toBeInTheDocument();
        });  
      test('SignIn page loads', () => {
            const { getByText } = render(
              <BrowserRouter>
                <SignIn/>
              </BrowserRouter>
            );
            const linkElement = getByText("Sign Up");
            expect(linkElement).toBeInTheDocument();
          });