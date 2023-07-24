N8N Nodes Couchbase

The Couchbase node allows you to automate documents in Couchbase. n8n has built-in support for a wide range of Couchbase features, including executing, inserting, updating, removing, and finding documents. n8n is a free and source-available workflow automation platform.

Use this connector

To install a community node in your n8n instance :

			•	Go to Settings > Community Nodes :
			•	Select 'Install a community node'
			•	Type in "n8n-nodes-couchbase" and hit Install
	 
For more information on installing community nodes, visit the Community nodes docs page.

Features

			•	Insert documents
			•	Update documents
			•	Find documents
			•	Remove documents
	 
Couchbase Credentials

Create a Couchbase account and you will need to input the following: 

			•	Connection String

				1.	Couchbase Server, you can use this connection string couchbase://127.0.0.1/?connectionTimeout=1200
					
				2.	Couchbase Capella, you can navigate to the tab named Connect and copy the connection string.

			•	Username
			•	Password
			•	Bucket
			•	Scope 
			•	Collection 

Those credentials are needed in order for you to connect to Couchbase.

Example Usage

This workflow allows you to insert a document into a Couchbase. This example usage workflow would use the following three nodes. - Start - Set - Couchbase 

The final workflow should look like the following image.


<img width="468" alt="image" src="https://github.com/maruakinu/n8n-nodes-couchbase/assets/100325935/b7947dde-af19-4b40-9c85-b1c5716fa332">






