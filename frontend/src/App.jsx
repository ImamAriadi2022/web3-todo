import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoListAbi from "./TodoList.json";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Ganti dengan address kontrakmu

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
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
      setWalletConnected(true);
      setError("");
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
      const tx = await contract.addTask(input); // Tidak mengirim ETH jika tidak diperlukan
      await tx.wait();
      setInput("");
      await loadTasks();
    } catch (err) {
      if (err.code === 4001) {
        setError("User membatalkan aksi.");
      } else {
        setError("Gagal menambahkan task: " + err.message);
      }
    }
  };

  const toggle = async (id) => {
    if (!contract) return;

    try {
      const tx = await contract.toggleTask(id);
      await tx.wait();
      await loadTasks();
    } catch (err) {
      if (err.code === 4001) {
        setError("User membatalkan aksi.");
      } else {
        setError("Gagal toggle task: " + err.message);
      }
    }
  };

  const deleteTask = async (id) => {
    if (!contract) return;
  
    try {
      const tx = await contract.deleteTask(id); // Fungsi deleteTask harus ada di smart contract
      await tx.wait();
      await loadTasks();
    } catch (err) {
      if (err.code === 4001) {
        setError("User membatalkan aksi.");
      } else {
        setError("Gagal menghapus task: " + err.message);
      }
    }
  };

  useEffect(() => {
    if (contract) {
      loadTasks();
    }
  }, [contract]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Web3 To-Do List</h1>

      {!walletConnected ? (
        <div style={styles.connectContainer}>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            Silakan hubungkan wallet Anda untuk mulai menggunakan aplikasi.
          </p>
          <button style={styles.connectButton} onClick={connectWallet}>
            Connect Wallet
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      ) : (
        <div style={styles.appContainer}>
          {error && <p style={styles.error}>{error}</p>}
          {loading ? (
            <p style={styles.loading}>Loading tasks...</p>
          ) : (
            <>
              <div style={styles.inputContainer}>
                <input
                  style={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="New Task"
                />
                <button
                  style={styles.addButton}
                  onClick={addTask}
                  disabled={!contract || !input.trim()}
                >
                  Add
                </button>
              </div>

              <ul style={styles.taskList}>
                {tasks.map((task, i) => (
                  <li key={i} style={styles.taskItem}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggle(task.id)}
                    />
                    <span style={styles.taskContent}>{task.content}</span>
                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteTask(task.id)}
                    >
                      Selesai
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
    width: "100vw",
    padding: "20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textShadow: "0 0 4px #00ffcc",
  },
  connectContainer: {
    marginTop: "50px",
  },
  connectButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#00ffcc",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#000",
    boxShadow: "0 0 6px #00ffcc",
    transition: "transform 0.2s",
  },
  appContainer: {
    marginTop: "20px",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #444",
    marginRight: "10px",
    width: "300px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#00ffcc",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#000",
    boxShadow: "0 0 6px #00ffcc",
  },
  deleteButton: {
    padding: "5px 10px",
    fontSize: "0.9rem",
    backgroundColor: "#ff6b6b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#fff",
    marginLeft: "10px",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
  },
  taskItem: {
    marginBottom: "10px",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e2f",
    padding: "10px",
    borderRadius: "5px",
  },
  taskContent: {
    marginLeft: "10px",
    flex: "1",
  },
  error: {
    color: "#ff6b6b",
    marginTop: "10px",
  },
  loading: {
    fontSize: "1.5rem",
    color: "#00ffcc",
  },
};

export default App;