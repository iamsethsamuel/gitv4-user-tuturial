import {queries} from "github-apiv4"
import './App.css';
import { useState } from 'react';

function App() {
	const [user, setUser] = useState([]),[userName, setUserName] = useState(""), [message, setMessage] = useState("")
	const submit = (e) =>{
		const accessCode = process.env.REACT_APP_GITHUB_TOKEN
		const userFields = "bio login twitterUsername email company avatarUrl"
		const repositoryFields = `name description url homepageUrl createdAt`
		const fields = `${userFields} ${queries.Followers({first:10,fields:userFields})} ${queries.Following({first:10,fields:userFields})}
						${queries.Repositories({first:10,fields:repositoryFields})}`
		setMessage("loading")
		fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `bearer ${accessCode}`
			},
			body: JSON.stringify({ query: queries.UserQuery(userName,fields) }),
			}).then(value=>value.json().then(res=>{
				if(res.data){
					setMessage("")
					setUser(res.data.user)
				}else{
					setUser({})
					if(res.message){
						setMessage(res.message)						
					}else{
						setMessage(res.errors)
					}
				}
			}))
	}
  return (
	<div className="App">
		<div className="input-group">
			<form onSubmit={(e) => {e.preventDefault();submit(userName)}}>
				<input type="text" name="login" value={userName} onChange={(e)=>setUserName(e.target.value)} className="form-control" placeholder="Enter user Github login" />
				<button type="submit">Submit</button>
			</form>
		</div>
		{message==="loading"&&<Progress />}
		{message!=="loadin"&& typeof message === "object"? 
			message.map((err,index)=><h3 key={index}>{err.message}</h3>):
		 	<h3>{message}</h3>}
		{(user&&message==="")?<UserComponent user={user} />:<h4>User not Found</h4>}
	</div>
	);
}

const Progress = (props) => {
	return <div className="progress">
	<svg>
	  <circle cx="70" cy="70" r="70"></circle>
	  <circle cx="70" cy="70" r="70"></circle>
	  </svg>
  </div>
}

const UserComponent = (props) => {
	const user = props.user
	return user?<div className="container">
		<table>
			<thead>
				<tr>
				<th>Email</th>
				<th>Bio</th>
				<th>Company</th>
				<th>Twitter</th>
				</tr>
			</thead>
			<tbody>
				<tr>
				<td data-column="Name">{user.email}</td>
				<td data-column="Last Name">{user.bio}</td>
				<td data-column="Job Title">{user.company}</td>
				<td data-column="Twitter">{user.twitterUsername}</td>
				</tr>
			</tbody>
		</table>
		<div className="container">
		<h4>Followers {user.followers&&user.followers.totalCount}</h4>
		<table>
			<thead>
				<tr>
				<th>Avatar</th>
				<th>Login</th>
				<th>Email</th>
				<th>Bio</th>
				<th>Company</th>
				<th>Twitter</th>
				</tr>
			</thead>
			<tbody>
			{user.followers&&user.followers.nodes.map((user, index)=><tr  key={index}>
					<td data-column="Name"><img src={user.avatarUrl} alt={user.bio} height="50px" width="50px" /></td>
					<td data-column="Name">{user.login}</td>
					<td data-column="Name">{user.email}</td>
					<td data-column="Last Name">{user.bio}</td>
					<td data-column="Job Title">{user.company}</td>
					<td data-column="Twitter">{user.twitterUsername}</td>
					</tr>
				)}
			</tbody>
		</table>
		</div>
		<div className="container">
		<h4>Following {user.following&&user.following.totalCount}</h4>
		<table>
			<thead>
				<tr>
				<th>Avatar</th>
				<th>Login</th>
				<th>Email</th>
				<th>Bio</th>
				<th>Company</th>
				<th>Twitter</th>
				</tr>
			</thead>
			<tbody>
			{user.following&&user.following.nodes.map((user, index)=> <tr  key={index}>
				<td data-column="Name"><img src={user.avatarUrl} alt={user.bio} height="50px" width="50px" /></td>
				<td data-column="Name">{user.login}</td>
				<td data-column="Name">{user.email}</td>
				<td data-column="Last Name">{user.bio}</td>
				<td data-column="Job Title">{user.company}</td>
				<td data-column="Twitter">{user.twitterUsername}</td>
				</tr>
			)}
			</tbody>
		</table>
		</div>
		<div className="container">
		<h4>Repositories {user.repositories&&user.repositories.totalCount}</h4>
		<table>
			<thead>
				<tr>
				<th>Name</th>
				<th>Description</th>
				<th>Homepage</th>
				<th>Url</th>
				<th>CreatedAt</th>
				<th>Twitter</th>
				</tr>
			</thead>
			<tbody>
			{user.repositories&&user.repositories.nodes.map((repository, index)=> <tr  key={index}>
				<td data-column="Name">{repository.name}</td>
				<td data-column="Name">{repository.description}</td>
				<td data-column="Name"><a href={repository.homepageUrl} target="_blank" rel="noreferrer">{repository.homepageUrl}</a></td>
				<td data-column="Last Name"><a href={repository.url} target="_blank" rel="noreferrer">{repository.url}</a></td>
				<td data-column="Job Title">{repository.createdAt}</td>
				<td data-column="Twitter">{repository.twitterUsername}</td>
				</tr>
			)}
			</tbody>
		</table>
		</div>
	</div>:<div className="container">
		<h1>Sorry an error occurred</h1>
	</div>
}
export default App;