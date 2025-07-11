import { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/registerLogin.css"; 
const Register = ()=>{
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const formValid = () => {
      return formData.username && formData.email && formData.password;
    };
    const handleChange = (e) => {

        setFormData((prev)=>({
                ...prev,
                [e.target.name]:e.target.value
            })
        )
    }

    

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await registerUser(formData);
        setMessage("Registration successful!");
        setFormData({ name: "", email: "", password: "" });
      } catch (err) {
        setMessage(err.response?.data?.error || "Something went wrong");
      }
    };
    


    return (
      <div className="body">
        <div className="form-container">
          <h2>Register</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            {formValid && (
            <button type="submit">Register</button>
            )}
          </form>
        </div>
      </div>
    );

}

export default Register;