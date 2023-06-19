import { SyntheticEvent, useState } from "react";

const  Register = () => {
    
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [passwordConfirm , setPasswordConfirm] = useState("");
   
 const submit = (e:SyntheticEvent) =>{
  e.preventDefault();
  console.log(firstName,lastName,email,password,passwordConfirm);
 }


    
    return (
  
           
      <main className="form-signin w-100 m-auto">
      <form onSubmit={submit}>
        
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name"
          onChange={e => setFirstName(e.target.value)}/>
          <label htmlFor="floatingFirstName">First Name</label>
        </div>

        
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name"
           onChange={e => setLastName(e.target.value)}/>
          <label htmlFor="floatingLastName">Last Name</label>
        </div>
    
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com"
           onChange={e => setEmail(e.target.value)}/>
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
           onChange={e => setPassword(e.target.value)}/>
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPasswordConfirm" placeholder="Password Confirm"
           onChange={e => setPasswordConfirm(e.target.value)}/>
          <label htmlFor="floatingPasswordConfirm">Password Confirm</label>
        </div>
    
       
        <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2023</p>
      </form>
    </main>
    );
    }


export default Register;