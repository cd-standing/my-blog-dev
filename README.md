# my-blog-dev
React app with source React code to develop locally before building for deployment

## The full stack for this React app includes:

- Front end 'app' code contained in 'my-blog/src'. This contains all the components for the front end.

- Back end server code contained in 'my-blog-backend/src/server.js'. This facilitates
communication between the front end and the database by setting up a sever on port 8000.

(Source files mentioned contain comments describing the functions of the main components. 
Please read these comments to get an understanding of some of the concepts of React, JSX and Node)

## Recommendations and requirements:

- **Powershell** as admin for Windows to run commands (pre-installed in Windows)
- **Microsoft Visual Studio Code** as IDE https://code.visualstudio.com/download

#### Installing NodeJs

Node JS is required for this app to work. If you don't already have this on your machine it can be downloaded and installed from:

https://nodejs.org/en/download/

Once downloaded add the nodejs source directory as an environment variable in Windows. For example this is 'C:\Program Files\nodejs' on my machine. Depending on your install choices this may be somewhere else.

You can add this to the path by typing 'env' into your windows search bar, opening up 'Edit the system environment variables' > 'Environment Variables' > select 'Path' under 'System variables' >  select 'Edit' > 'New' > Copy and paste the path 'C:\Program Files\nodejs' for the executable here .

#### Check this is on the path by typing

    node -v
    
#### Installing Git

You will need to install Git to clone a local repository and manage your source code.

This can be downloaded from https://git-scm.com/download/win.

Git should be added to your system path automatically but if it isn't, follow the instruction for adding the executable folder to the path from the NodeJS example above.

## Instructions for cloning locally

Using Powershell navigate to local folder

    cd C:\users\[username]\dev
    
then type

    git clone https://github.com/cd-standing/my-blog.git

This will create a 'my-blog-dev' repo.

To install all the node modules for the frontend part of the app, navigate to

	  cd my-blog
    
then type
	
	  npm install
	  
To install all the node modules for the backend part of the app, navigate to

	  cd my-blog-backend
    
then type
	
	  npm install

### MongoDB setup

For local development MongoDB needs to be set up and running on port 27017. MongoDB can be set up using the 
following links:

https://chocolatey.org/install#individual
	
https://chocolatey.org/packages/mongodb#upgrade
	
Install for Windows using Powershell in admin mode and make sure MongoDB bin is set as an environment variable.

## Set up project in VS Code IDE

Navigate to local repo in Powershell

    cd C:\users\[username]\dev\my-blog
    
Open the project in Vs Code

    code .
    
This will open up your app folder structure neatly in VS Code and you can start editing the code from here.

In VS Code you can then select Terminal > New terminal to start running commands from the IDE.
	
### Commands to get things running:

#### Start database

	mongod
	
#### Open database terminal

	mongo

#### When in the server terminal use the following:

To use this specific database

	use my-blog

To insert some sample data (This adds the data as a collection called 'articles')

	db.articles.insert([{ name: 'learn-react', upvotes: 0, comments: [], }, { name: 'learn-node', upvotes: 0, comments: [], }, { name: 'my-thoughts-on-resumes', upvotes: 0, comments: [], }])

	
To find objects in a collection 'articles'

	db.articles.find({})
	
To find a specific article by its name

	db.articles.findOne({name: 'learn-react'})

More example MongoDB syntax can be found on the MongoDB site https://docs.mongodb.com/manual/

----------------------------

#### To start the server:

Open a new terminal and navigate to the 'my-blog-backend' folder

A command has been added to 'package.json' in 'scripts' to use nodemon and auto refresh the local server upon saving code 

    "start": "npx nodemon --exec npx babel-node src/server.js",
  
This enables us to simply use

	  npm start
	
To serve the front end (the structure for this has been set up by using the 'create-react-app' command initially)

Open a new terminal and navigate to 'my-blog'

	  npm start
	  
**The app now has everything running and in place to function as expected**

- The database should be running in the background and have some dummy data inserted as JSON.
- The server.js code in 'my-blog-backend' is dealing with communicatoin with the server and the 
frontend code using 'express', 'body-parser' and the 'mongoClient' modules.
- The frontend should be interactive. You should be able to add comments, upvote and navigate easily between pages.

#### Try creating new components and pages for the frontend and functions to GET or POST to these in the server.js code!

----------------------------


#### To get the app ready for deployment:

Note: Some of these changes may have already been made to this code but 
these additions are useful to know for future development and deployment.

If you notice the changes already exist in the files just run npm build
as specified below.

Change 'title' in index.html to relate to the app. Call it 'My Blog'.

Edite manifest.json and change 'short_name' and 'name' to more relevant names

	My Blog
	My Blog  - A Blog About All Things Programming

To build for deployment in the 'my-blog' folder run

	npm build
	
This will create a 'build' folder containing the code ready for deployment.

Copy the 'build' folder to 'my-blog-backend/src'.

Because the build folder is now inside 'my-blog-backend/src' some files needed 
to be modified to allow both the backend and frontend to be served from here.

Edit 'server.js':

Added at the top

	import path from 'path';

Add just above the first 'app.use...'

	app.use(express.static(path.join(__dirname, '/build')));
	
Add at the bottom, just before 'app.listen...' (this tells all requests that aren't 
caught by any other API routes in the code should be passed on to the app).

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + '/build/index.html'));
	})

---------------------------

### Push to a GitHub respository

Initialise the folder for GitHub

	git init
	
Create a '.gitignore' folder in 'my-blog-backend' and in the file add

	node_modules


Add the files to be committed

	git add .
	
Check the status of the files using

	git status
	
Commit the files using

	git commit -m "Initial commit"
	
Create a github repo on your personal GitHub called 'my-blog' 
(follow instructions on GitHub to do this) and copy the Git URL
for example 'https://github.com/cd-standing/my-blog.git'

Push the local files to the repository (it may ask to add email details for 
a first commit and push, add these as suggested in the terminal and commit again 
if necessary.

	git remote add origin https://github.com/cd-standing/my-blog.git
	
	git push -u origin master
	
The files should now appear in GitHub.

--------------------------------------

### Set up an AWS account and AWS EC2 instance

You can sign up for a Free Tier AWS account here

https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc

This will require entering bank details but the EC2 instance is a free service

Once you are signed in:

	- Select Services > EC2
	- Lunch Instance
	- Choose the top, free option 'Amazon Linux 2 AMI' by clicking 'Select'
	- Select defaults
	- Click Review and Lunch
	- Click Launch
	- Select 'Create a new key pair'
	- Call the key pair 'my-blog-key'
	- Download key pair
	- Click on Launch Instances
	- Move downloaded 'my-blog-key.pem' file to the 'C:\users\cdstanding\.ssh' folder.
	If a .ssh folder doesn't exist, make one.
	- Download Putty to SSH into the AWS instance 
	https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
	(use the 64bit msi)
	- Open Putty Key Generator and Load the downloaded 'my-blog-key.pem' from the .ssh folder
	- Save as private key with the same name (this will turn it into a .ppk file for Putty)
	- Open AWS and go to the launched EC2 instance. Select this then scroll down to get the host
	name (something like this 'ec2-18-130-66-142.eu-west-2.compute.amazonaws.com')
	- Open Putty client and copy and paste the host name into where it says 'Host Name'
	- In the left panel on Putty, scroll down to SSH then Auth, then browse for the .ppk file
	(this gives access with an SSH key)
	- Now click Open and a terminal will be launched
	- For username enter 'ec2-user'
	- We are now logged in to the EC2 instance

#### Install Git on AWS Linux

	sudo yum install git

#### Install the node version manager nvm

Instructions for install can be found here:

https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

Check local node version used for project. Open a Windows terminal and type

	node -v

In AWS terminal

	nvm install [version number of local node]
	
for example
	
	nvm install 12.18.3
	
Install latest version of npm

	npm install -g npm@latest
	
Install MongoDB using instructions on following link:

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/

Scroll down to Amazon Linux 2

To create the repo file copy the example command then

	sudo nano /etc/yum.repos.d/mongodb-org-4.4.repo
	
and insert the contents of the file

	[mongodb-org-4.4]
	name=MongoDB Repository
	baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.4/x86_64/
	gpgcheck=1
	enabled=1
	gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
	
Save with Ctrl o. Press Enter to confirm. Ctrl X to exit.

Use the install command to install the latest version

	sudo yum install -y mongodb-org
	
Once installed, run the database

	sudo service mongod start

Use our specific database

	use my-blog
	
Insert data into a collection called 'articles' with 

	db.articles.insert([{ name: 'learn-react', upvotes: 0, comments: [], }, { name: 'learn-node', upvotes: 0, 
comments: [], }, { name: 'my-thoughts-on-resumes', upvotes: 0, comments: [], }])

If successful this will show that 3 records are successfully inserted.


-------------------------

### Run the app on AWS

Clone the app repository to the EC2 instance

	git clone https://github.com/cd-standing/my-blog.git

This will create a 'my-blog' repo

To install all the node modules for the app

	cd my-blog
	
	npm install
	
Run the server permanently on this EC2 instance. This requires a node module called 'forever'

	npm install -g forever

	forever start -c "npm start" .
	
Check the server is running with

	forever list
	
Map port 80 on AWS instance to port 8000 for the node server

	sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
	
Make the app publicly available through a broswer

Go to AWS EC2 page and the running instance

Scroll down to find security group. For example 'launch-wizard-1'.

In the left pane, scroll down to Security groups and click

Select the security group for this instance, scroll down to Inbound tab > 
> click Edit > Add rule and scroll down to HTTP > Select Source 'Anywhere' > Save

Go back to EC2 instance page > select instance > Copy Public DNS > Paste into browser

App is now accessible publicly in the broswer!

The end.

-----------------------------------------

