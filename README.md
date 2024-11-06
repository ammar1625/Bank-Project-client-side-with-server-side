this is a simple banking web application created 100% by me from scratch
the idea was inspired from wise bank web app and the design as well
i tried to keep it as simple as possibe because it is for learning purposes 
my main objective was to create a simple but complete back-end and a complete front-end and integrate them with Apis 

the project was created using 3 tier architechture which means to separate each layer in its own project using C# class library
1/the data layer : is a project which interacts with data base
2/ the business layer : is the projects wich contains the logic and it works with the data layer
3/ the api layer : the layer that expose the functionalities that are in business layer and expose them to be consumed by any client side app
3/ the user interface layer : is the layer which consume the apis and allow to the user to interact with the application

the back-end is created using sql server for data base , the back-end programming language is C# and ASP.Net Core for the restfull Apis
the front-end is created using html css javascript pure without using any library or frameworks for css or js

Notes:
//i did not care too mauch about data base design because my main goal was to create a simple but complete web app
//i did not focus on business details like any banking app but i may do some updates later
//before start using the app first you shoud open the server side folder and run the project and execute it in order to simulate the server is runing and ready to recieve requests
//to evede any data base connection error you have  to change the connection string data base log in infos and replace them with yours 
//you can fing the connection string in "BankProjectDataAccessLayer" project exactly in BankProjectDataAccessSettings.cs class there you can modify it according to your personal data base log in infos
//when you run the client side you should Run the following html file index.html because it is the containing the log-in page 
//before performing the log-in you have to open an account you can find a link in the page
