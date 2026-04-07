import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {JSON.stringify(users)}
    </div>
  );
}

export default App;