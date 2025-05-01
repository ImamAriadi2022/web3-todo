import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoListAbi from "./TodoList.json";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Ganti sesuai address kontrakmu

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlockchain = async () => {
    try {
      if (!window.ethereum) {
        setError("Ethereum provider tidak ditemukan. Install MetaMask.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const todoContract = new ethers.Contract(
        contractAddress,
        TodoListAbi.abi,
        tempSigner
      );
      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(todoContract);
    } catch (err) {
      setError("Gagal menghubungkan ke Ethereum: " + err.message);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await contract.getTasks();
      setTasks(result);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat task: " + err.message);
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!contract || !input.trim()) return;

    try {
      const tx = await contract.addTask(input);
      await tx.wait(); // Tunggu konfirmasi transaksi
      setInput("");
      await loadTasks();
    } catch (err) {
      setError("Gagal menambahkan task: " + err.message);
    }
  };

  const toggle = async (id) => {
    if (!contract) return;

    try {
      const tx = await contract.toggleTask(id);
      await tx.wait();
      await loadTasks();
    } catch (err) {
      setError("Gagal toggle task: " + err.message);
    }
  };

  useEffect(() => {
    loadBlockchain();
  }, []);

  useEffect(() => {
    if (contract) {
      loadTasks();
    }
  }, [contract]);

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Web3 To-Do List</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New Task"
          />
          <button onClick={addTask} disabled={!contract || !input.trim()}>
            Add
          </button>

          <ul>
            {tasks.map((task, i) => (
              <li key={i}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggle(task.id)}
                />
                {task.content}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;