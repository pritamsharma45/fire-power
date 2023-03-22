### Setup for popular auth providers

1. Google

- Head to https://console.cloud.google.com/apis/dashboard.

- Create new project and set up OAuth consent screen

![Screenshot (74)](https://user-images.githubusercontent.com/69457813/226809591-68320823-ff78-4fc4-a28a-7f1f7e4c3732.png)

![Screenshot (76)](https://user-images.githubusercontent.com/69457813/226809600-84ca4952-573d-4fd7-9c1d-801069cc5281.png)

- Click Credentials and then copy Client ID & Client Secret. This has to entered in `.env` file.

![Screenshot (77)](https://user-images.githubusercontent.com/69457813/226809608-d7a0040b-7d41-4e7e-80a0-a3ec91c321cf.png)

![Screenshot (75)](https://user-images.githubusercontent.com/69457813/226809598-f0e525d4-11e4-4c42-a2c6-658a9ef67366.png)

- Provide Authorized redirect URIs as this `http://localhost:3000/api/auth/callback/google`. Local host to be replaced with actual domain when the application is made live.

or follow this video:[Add google auth](https://youtu.be/QXgFaHEuJOE)

2. Facebook

- Head to https://developers.facebook.com/apps

- Creat new app
  ![Screenshot (80)](https://user-images.githubusercontent.com/69457813/226816968-bd6275a4-c42d-40ea-9bae-b329781dd11a.png)

- Click on Add product and then choose Facebook login.
  ![Screenshot (82)](https://user-images.githubusercontent.com/69457813/226816976-9483aa5d-73a9-493a-a47d-afb85f69ffaa.png)

- Under Facebook Login section in the left Navigation pane click on Settings and then Get Advanced Access.
  ![Screenshot (78)](https://user-images.githubusercontent.com/69457813/226816984-10f96b4d-081e-4002-a13e-25678fbdf4da.png)

- Under advanced access settings relevant fields to be turned on.

![Screenshot (79)](https://user-images.githubusercontent.com/69457813/226816985-acb60ef9-594f-4efd-a80b-9de10d279927.png)

or follow this video:[Add facebook auth](https://youtu.be/eTpkgNBmrX8)

3. Twitter

Follow this video:[Add Twitter Auth](https://www.youtube.com/watch?v=Z6ibMSJIwlk&t)
