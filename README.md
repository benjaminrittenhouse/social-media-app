# Social Media App
This social media app allows users to take pictures, upload pictures, caption them, and comment / follow other users accounts and see their pictures in a feed.

# Technologies
This project uses React Native to create the frontend and Firebase to store the user information in a database on the backend. I also utilized Expo to to testing within a web browser and on an iOS device. Redux was utilized for managing the state of the application.

# Testing & Design
Testing was done in mobile view and the app was designed for mobile via React Native. It is linked to firebase, so a lot of testing was removing and adding user information such as their posts, comments, and who they are following.

To utilize expo, install all dependencies and run "expo start -c" to run with a clear cache. 

# Firebase Design
The design of the firebase firestore database consisted of users, posts, following, etc. The path would follow information linked to each specific user. For example, if you wanted to fetch the posts from a specific user, you would access the posts collection, and then the uid within that collection, to which all of the posts would be filed. Similiarly, if you wanted to find out everyone who the current user is following, you would access the uid and then the "following" collection that is connected to said user.

# Resources

https://redux.js.org/
https://reactnative.dev/
https://reactnavigation.org/
https://www.youtube.com/watch?v=1hPgQWbWmEk
