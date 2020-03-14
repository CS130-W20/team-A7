# Serendipity Overview
An app for those who are spontaneous but indecisive to make travel plans. Take a blind date with a city!
Made by a dedicated team of five UCLA students: Jair Hinojosa, Steven Lara, Christina Oliveira, Kyle Romero, and Kevin Tan.

# How to Build/Run

Acquire the .env file which contains our API keys and place it in /client

For grader: Look for an email with the subject line: 'Team-A7 API Keys'

Run the following commands:

```
git clone git@github.com:CS130-W20/team-A7.git
cd team-A7
cd client
npm install
npm start
```

# Code Structure
  Since we decided to build a React application, we utilize a standard structure for React apps in which we store all components inside client/src/components. Within this folder, we keep each component in a seperate file. This is the main structure of our critical components:
  
  client  
    --src  
      ----assets  
        ------[..assets..]  
      ----components  
        ------About  
        ------Account  
        ------Admin  
        ------App  
        ------CTAButton  
        ------Firebase  
        ------Home  
        ------Landing  
        ------MyTrips  
        ------NavBar  
        ------PasswordChange  
        ------PasswordForget  
        ------Session  
        ------SignIn  
        ------SignOut  
        ------SignUp  
        ------TripGeneration  
      ----constants  

# Testing

Tests can be found under client/src/components/App/README.md, since App constitutes the main React functionality.

